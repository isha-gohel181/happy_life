import jwt from "jsonwebtoken";
import DeviceApproval from "../models/DeviceApproval.js";

// Platforms that the mobile app uses and are therefore subject to device approval.
// Web sessions (web frontend + admin panel) should NEVER be gated here.
const APP_PLATFORMS = new Set(["app", "android", "ios"]);

// Read the `platform` claim from the signed access token.
// The token is already verified upstream by accessTokenAutoRefresh + passport,
// so a trust-only decode is safe — we only need the non-forgeable `platform` claim.
const getTokenPlatform = (req) => {
  try {
    const authHeader = req.headers?.authorization;
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = bearer || req.cookies?.accessToken || null;
    if (!token) return undefined;
    return jwt.decode(token)?.platform;
  } catch {
    return undefined;
  }
};

const requireDeviceApproval = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        data: {},
        err: { message: "Missing authenticated user" },
      });
    }

    // Users explicitly exempted from device approval.
    if (req.user.skipDeviceApproval === true) return next();

    const platform = getTokenPlatform(req);

    // Web clients (web frontend + admin panel) are never device-gated.
    // They are never enrolled in device approval at login so they have no record.
    if (platform === "web") return next();

    const deviceId =
      req.query.deviceId || req.headers["x-device-id"] || req.body?.deviceId;

    const isAppClient = APP_PLATFORMS.has(platform);

    // A non-app client that presents no deviceId (legacy / unknown platform,
    // server-to-server) is treated like web and allowed through — fail-open for
    // non-app traffic so we never lock out a session that was never part of
    // device approval. Real android/ios clients always fall to enforcement below.
    if (!isAppClient && !deviceId) return next();

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "Device ID is required to access this resource",
        data: {},
        err: { message: "Missing deviceId" },
      });
    }

    const deviceApproval = await DeviceApproval.findOne({
      userId: req.user._id,
      deviceId,
    }).sort({ requestedAt: -1 });

    const approved =
      deviceApproval?.status === "approved" && deviceApproval?.isActive === true;

    if (!approved) {
      let message = "Device approval required to access courses";
      if (deviceApproval) {
        if (deviceApproval.status === "pending") {
          message = "Device approval pending";
        } else if (deviceApproval.status === "rejected") {
          message = "Device rejected by admin";
        } else if (deviceApproval.status === "approved" && !deviceApproval.isActive) {
          message = "Device deactivated. Please request approval again.";
          // Auto-transition back to pending so it shows on the Admin panel
          deviceApproval.status = "pending";
          deviceApproval.approvedBy = undefined;
          deviceApproval.rejectionReason = undefined;
          deviceApproval.requestedAt = new Date();
          await deviceApproval.save();
        }
      }

      return res.status(403).json({
        success: false,
        message,
        data: {
          deviceStatus: deviceApproval?.status || "no_device",
          deviceApproval: deviceApproval
            ? {
              id: deviceApproval._id,
              status: deviceApproval.status,
              isActive: deviceApproval.isActive,
            }
            : null,
        },
        err: { message: "Device not approved", requiresApproval: true },
      });
    }

    next();
  } catch (err) {
    console.error("Device approval middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Error checking device approval",
      data: {},
      err: err.message,
    });
  }
};

export default requireDeviceApproval;
