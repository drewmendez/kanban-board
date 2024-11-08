import jwt from "jsonwebtoken";

export const verifyAuthCookie = (req, res, next) => {
  const token = req.cookies.access_token;

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    return res.status(401).clearCookie("access_token").json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
};
