import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const createAccessToken = (payload) => {
  return jwt.sign(
    payload,
    JWT_SECRET, 
    { expiresIn: "7d" }
  );
};