import axios from "axios";
import crypto from "crypto";
import ZoomMeeting from "../models/ZoomMeeting.js";
import CourseEnrollment from "../models/CourseEnrollment.js";
import CourseBundle from "../models/CourseBundle.js";
import User from "../models/user.js";

const generateZoomToken = async () => {
    try {
        const accountId = process.env.ZOOM_ACCOUNT_ID;
        const clientId = process.env.ZOOM_CLIENT_ID;
        const clientSecret = process.env.ZOOM_CLIENT_SECRET;

        if (!accountId || !clientId || !clientSecret) {
            throw new Error("Zoom credentials are not configured in environment variables.");
        }

        const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

        const response = await axios.post(
            tokenUrl,
            {},
            {
                headers: {
                    Authorization: `Basic ${credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Error generating Zoom token:", error.response?.data || error.message);
        throw new Error("Failed to generate Zoom token");
    }
};

const convertToUTC = (dateStr, timezone) => {
    try {
        const date = new Date(dateStr);
        const dateStrUTC = date.toISOString().replace(/\.\d{3}Z$/, "Z");
        return dateStrUTC;
    } catch {
        return dateStr;
    }
};

/**
 * @desc    Create a new Zoom Meeting (supports recurring)
 * @route   POST /zoom/meetings
 * @access  Private
 */
export const createMeeting = async (req, res) => {
    try {
        const {
            topic, type, start_time, duration, timezone, password, agenda, courseId,
            isRecurring, recurrence,
            useExistingLink, existingMeetingId, existingJoinUrl, existingPassword
        } = req.body;

        const tz = timezone || "Asia/Kolkata";
        let meeting_id, join_url, start_url, effectivePassword;

        if (useExistingLink) {
            meeting_id = (existingMeetingId || "0").replace(/\s+/g, "");
            join_url = existingJoinUrl || "";
            start_url = existingJoinUrl || "";
            effectivePassword = existingPassword || password || "";
        } else {
            const token = await generateZoomToken();

            const meetingData = {
                topic: topic || "New Live Class",
                type: isRecurring ? 8 : (type || 2),
                start_time: convertToUTC(start_time, tz),
                duration: duration || 60,
                timezone: tz,
                password: password || "123456",
                agenda: agenda || "Live session",
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: true,
                    mute_upon_entry: true,
                    meeting_authentication: false,
                    watermark: false,
                    use_pmi: false,
                    approval_type: 2,
                    audio: "both",
                    auto_recording: "cloud",
                },
            };

            if (isRecurring && recurrence) {
                meetingData.recurrence = {
                    type: recurrence.type || 2,
                    repeat_interval: recurrence.repeat_interval || 1,
                    weekly_days: recurrence.weekly_days,
                    end_date_time: recurrence.end_date_time
                        ? convertToUTC(recurrence.end_date_time, tz)
                        : undefined,
                    end_times: recurrence.end_times || undefined,
                };
            }

            const zoomHostId = process.env.ZOOM_ACCOUNT_EMAIL || process.env.ZOOM_ACCOUNT_ID;
            const response = await axios.post(
                `https://api.zoom.us/v2/users/${encodeURIComponent(zoomHostId)}/meetings`,
                meetingData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            meeting_id = response.data.id;
            join_url = response.data.join_url;
            start_url = response.data.start_url;
            effectivePassword = password || "";
        }

        const newMeeting = new ZoomMeeting({
            topic: topic || "New Live Class",
            type: isRecurring ? 8 : (type || 2),
            start_time: start_time,
            duration: duration || 60,
            timezone: tz,
            password: effectivePassword,
            agenda: agenda || "",
            meeting_id: String(meeting_id).replace(/\D/g, ''),
            join_url: join_url,
            start_url: start_url,
            createdBy: req.user?._id,
            courseId: courseId || null,
            isRecurring: !!isRecurring,
            recurrence: isRecurring ? (recurrence || {}) : undefined,
        });

        await newMeeting.save();

        res.status(201).json({
            success: true,
            message: "Zoom meeting created successfully",
            meeting: {
                id: newMeeting.meeting_id,
                topic: newMeeting.topic,
                start_time: newMeeting.start_time,
                duration: newMeeting.duration,
                timezone: newMeeting.timezone,
                password: newMeeting.password,
                join_url: newMeeting.join_url,
                courseId: newMeeting.courseId,
                isRecurring: newMeeting.isRecurring,
                recurrence: newMeeting.recurrence,
                _id: newMeeting._id,
                meeting_id: newMeeting.meeting_id,
            },
        });
    } catch (error) {
        console.error("Error creating Zoom meeting:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create Zoom meeting",
            error: error.response?.data || error.message,
        });
    }
};

/**
 * @desc    Get List of Meetings
 * @route   GET /zoom/meetings
 * @access  Private
 */
export const getMeetings = async (req, res) => {
    try {
        const { role, _id: userId } = req.user;
        const { courseId, type } = req.query;

        let query = {};

        if (courseId) {
            query.courseId = courseId;
        }

        if (role === 'student') {
            const enrollments = await CourseEnrollment.find({
                userId: userId,
                status: 'active'
            }).populate('courseBundleId');

            let enrolledCourseIds = enrollments
                .filter(e => e.courseId)
                .map(e => e.courseId.toString());

            for (const enrollment of enrollments) {
                if (enrollment.courseBundleId && enrollment.courseBundleId.courses) {
                    const bundleCourses = enrollment.courseBundleId.courses.map(id => id.toString());
                    enrolledCourseIds = [...new Set([...enrolledCourseIds, ...bundleCourses])];
                }
            }

            if (courseId) {
                const isEnrolled = enrolledCourseIds.includes(courseId.toString());
                if (!isEnrolled) {
                    return res.status(200).json({
                        success: true,
                        meetings: { meetings: [] }
                    });
                }
            } else {
                query.courseId = { $in: enrolledCourseIds };
            }
        }

        let meetings = await ZoomMeeting.find(query).sort({ start_time: -1 });

        const now = new Date();

        meetings = meetings.filter(m => {
            const startTime = new Date(m.start_time);
            const endTime = new Date(startTime.getTime() + (m.duration * 60 * 1000));

            if (m.isRecurring && m.recurrence) {
                const tz = m.timezone || "Asia/Kolkata";

                const nowLocal = new Date(now.toLocaleString("en-US", { timeZone: tz }));
                const startLocal = new Date(startTime.toLocaleString("en-US", { timeZone: tz }));

                const todayJS = nowLocal.getDay();
                const jsDay = todayJS === 0 ? 7 : todayJS;

                if (m.recurrence.weekly_days) {
                    const zoomDays = m.recurrence.weekly_days.split(",").map(Number);
                    if (!zoomDays.includes(jsDay)) {
                        return false;
                    }
                }

                if (m.recurrence.end_date_time) {
                    const endDate = new Date(m.recurrence.end_date_time);
                    if (now > endDate) {
                        return false;
                    }
                }

                if (m.recurrence.end_times) {
                    const weeksElapsed = Math.floor((nowLocal - startLocal) / (7 * 24 * 60 * 60 * 1000));
                    if (weeksElapsed >= m.recurrence.end_times) {
                        return false;
                    }
                }

                const startMinutes = startLocal.getHours() * 60 + startLocal.getMinutes();
                const nowMinutes = nowLocal.getHours() * 60 + nowLocal.getMinutes();
                const oneHourBefore = startMinutes - 60;
                if (nowMinutes < oneHourBefore || nowMinutes > startMinutes + m.duration) {
                    return false;
                }

                return true;
            }

            if (type === 'upcoming') {
                const oneHourBeforeStart = new Date(startTime.getTime() - (60 * 60 * 1000));
                return now >= oneHourBeforeStart && now < endTime;
            }

            return true;
        });

        res.status(200).json({
            success: true,
            meetings: {
                meetings: meetings.map(m => ({
                    id: m.meeting_id,
                    _id: m._id,
                    topic: m.topic,
                    start_time: m.start_time,
                    duration: m.duration,
                    timezone: m.timezone,
                    password: m.password,
                    join_url: m.join_url,
                    courseId: m.courseId,
                    isRecurring: m.isRecurring,
                    recurrence: m.recurrence,
                }))
            }
        });
    } catch (error) {
        console.error("Error fetching meetings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch meetings",
            error: error.message
        });
    }
}

/**
 * @desc    Get Meeting Details by ID
 * @route   GET /zoom/meetings/:id
 * @access  Private
 */
export const getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;
        const token = await generateZoomToken();

        const response = await axios.get(
            `https://api.zoom.us/v2/meetings/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        res.status(200).json({
            success: true,
            meeting: response.data,
        });
    } catch (error) {
        console.error("Error fetching Zoom meeting details:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch Zoom meeting details",
            error: error.response?.data || error.message,
        });
    }
};

/**
 * @desc    Delete a Zoom Meeting
 * @route   DELETE /zoom/meetings/:id
 * @access  Private
 */
export const deleteMeeting = async (req, res) => {
    try {
        const id = req.params.id.replace(/\s+/g, "");
        const token = await generateZoomToken();

        try {
            await axios.delete(
                `https://api.zoom.us/v2/meetings/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (zoomError) {
            // Zoom Error Codes:
            // 3001: Meeting does not exist
            const isNotFound = zoomError.response?.status === 404 || zoomError.response?.data?.code === 3001;

            if (!isNotFound) {
                throw zoomError;
            }
            console.log(`Zoom meeting ${id} already deleted or not found in Zoom. Cleaning up local DB.`);
        }

        // Delete ALL local records with this meeting_id
        await ZoomMeeting.deleteMany({ meeting_id: id });

        res.status(200).json({
            success: true,
            message: "Zoom meeting deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting Zoom meeting:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete Zoom meeting",
            error: error.response?.data || error.message,
        });
    }
};

/**
 * @desc    Get Meeting Participants (Reports)
 * @route   GET /zoom/meetings/:id/participants
 * @access  Private
 */
export const getMeetingParticipants = async (req, res) => {
    try {
        const uuid = req.query.uuid || req.params.id;

        let encodedUuid = encodeURIComponent(uuid);
        if (uuid.startsWith('/') || uuid.includes('//')) {
            encodedUuid = encodeURIComponent(encodedUuid);
        }

        const token = await generateZoomToken();

        let allParticipants = [];
        let nextPageToken = "";
        const pageSize = 300;

        do {
            const url = `https://api.zoom.us/v2/report/meetings/${encodedUuid}/participants?page_size=${pageSize}${nextPageToken ? `&next_page_token=${nextPageToken}` : ""}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            allParticipants = allParticipants.concat(data.participants || []);
            nextPageToken = data.next_page_token || "";

        } while (nextPageToken);

        res.status(200).json({
            success: true,
            participants: allParticipants,
            total_records: allParticipants.length,
        });
    } catch (error) {
        console.error("Error fetching Zoom participants:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch participants. Note: This only works for meetings that have ended.",
            error: error.response?.data || error.message,
        });
    }
};

/**
 * @desc    Get All Past Meetings Report
 * @route   GET /zoom/reports/meetings
 * @access  Private
 */
export const getPastMeetingsReport = async (req, res) => {
    try {
        const token = await generateZoomToken();
        const from = req.query.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const to = req.query.to || new Date().toISOString().split('T')[0];

        const zoomUserId = process.env.ZOOM_ACCOUNT_EMAIL || process.env.ZOOM_ACCOUNT_ID;
        if (!zoomUserId) throw new Error("ZOOM_ACCOUNT_EMAIL or ZOOM_ACCOUNT_ID must be set in environment variables.");

        const response = await axios.get(
            `https://api.zoom.us/v2/report/users/${encodeURIComponent(zoomUserId)}/meetings?from=${from}&to=${to}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        res.status(200).json({
            success: true,
            meetings: response.data.meetings,
        });
    } catch (error) {
        console.error("Error fetching Zoom report:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch past meetings report",
            error: error.response?.data || error.message,
        });
    }
};

/**
 * @desc    Generate Zoom SDK Signature for Web Embed
 * @route   POST /zoom/signature
 * @access  Private
 */
export const generateSignature = async (req, res) => {
    try {
        const { meetingNumber, role } = req.body;
        const iat = Math.round(new Date().getTime() / 1000) - 30;
        const exp = iat + 60 * 60 * 2;

        const sdkKey = process.env.ZOOM_SDK_KEY;
        const sdkSecret = process.env.ZOOM_SDK_SECRET;

        if (!sdkKey || !sdkSecret) {
            throw new Error('ZOOM_SDK_KEY and ZOOM_SDK_SECRET must be set in environment variables.');
        }

        // mn MUST be a string — large Zoom meeting IDs (10-11 digits) lose
        // precision when stored as a JS integer, causing Zoom's server-side
        // signature validator to reject them and show the "Sign In" prompt.
        const mn = String(meetingNumber).replace(/\D/g, '');
        const r = parseInt(role, 10) || 0;

        const oHeader = { alg: 'HS256', typ: 'JWT' };
        const oPayload = {
            sdkKey: sdkKey,
            mn: mn,
            role: r,
            iat: iat,
            exp: exp,
            tokenExp: exp
        };

        const sHeader = JSON.stringify(oHeader);
        const sPayload = JSON.stringify(oPayload);

        const base64Header = Buffer.from(sHeader).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        const base64Payload = Buffer.from(sPayload).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

        const signature = crypto
            .createHmac('sha256', sdkSecret)
            .update(`${base64Header}.${base64Payload}`)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const jwt = `${base64Header}.${base64Payload}.${signature}`;

        res.status(200).json({
            success: true,
            signature: jwt,
            sdkKey: sdkKey
        });
    } catch (error) {
        console.error("Error generating Zoom signature:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to generate Zoom signature",
            error: error.message,
        });
    }
};
