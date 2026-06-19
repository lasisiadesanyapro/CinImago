import jwt from "jsonwebtoken";
import "dotenv/config";

export const validateToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const generateToken = ({
  id,
  email,
  role,
  passwordVersion,
  jwtVersion,
}) => {
  return jwt.sign(
    {
      id,
      email,
      role,
      passwordVersion,
      jwtVersion,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};
