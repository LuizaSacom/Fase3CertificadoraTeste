import * as argon2 from "argon2";
import { Request, Response } from "express";
import { UserModel } from "../../infra/libs/mongoose/models/UserModel";
import { generetaToken } from "../../utils/JwtUtil";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username e senha são obrigatórios." });
      return;
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(401).json({ error: "Credenciais inválidas." });
      return;
    }

    const isPasswordValid = await argon2.verify(user.salt, password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Credenciais inválidas." });
      return;
    }

    const token = generetaToken({ userId: user.id, username: user.username });
    res.status(200).json({ token });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
    return;
  }
};
