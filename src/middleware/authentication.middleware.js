import { validateToken } from "../utils/token.js";

export const isAuth = (req, res, next) => {
  const token = req.cookies?.accessToken;

  console.log("cookies", req.cookies?.accessToken);

  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  try {
    const payload = validateToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      passwordVersion: payload.passwordVersion,
      jwtVersion: payload.jwtVersion,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
