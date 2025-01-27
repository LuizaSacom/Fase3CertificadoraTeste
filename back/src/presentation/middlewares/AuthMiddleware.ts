import { decoteToken } from "../../utils/JwtUtil";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido" });
    next();
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = decoteToken(token);

    Object.assign(req.headers, {
      userId: decoded.userId,
      username: decoded.username,
    });

    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido ou expirado" });
    next();
  }
};
