import jwt from "jsonwebtoken";
import { environments } from "../constants/environments";

const EXPIRES_IN = "1h";

export type JwtPayload = {
  username: string;
  userId: string;
};

export const decoteToken = (token: string): JwtPayload => {
  const decodedToken = jwt.verify(token, environments.JWT_SECRET);

  if (typeof decodedToken === "object") {
    const username = decodedToken.username;
    const userId = decodedToken.userId;
    return { userId, username };
  }

  return JSON.parse(decodedToken) as JwtPayload;
};

export const generetaToken = ({ userId, username }: JwtPayload): string => {
  return jwt.sign({ userId, username }, environments.JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });
};
