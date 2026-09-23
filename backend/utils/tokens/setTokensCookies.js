const setTokensCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  // Trust proxy allows res.req.secure to be true on Render
  const isSecure = isProd || res.req?.secure || res.req?.protocol === 'https' || false;
  // If secure, always use "none" for cross-domain compatibility between Vercel and Render
  const sameSiteMode = isSecure ? "none" : "lax";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSiteMode,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSiteMode,
  });

  res.cookie("is_auth", true, {
    httpOnly: false,
    secure: isSecure,
    sameSite: sameSiteMode,
  });
};

export { setTokensCookies };