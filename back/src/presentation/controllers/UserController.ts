import { Request, Response } from "express";
import { UserModel } from "../../infra/libs/mongoose/models/UserModel";
import * as argon2 from "argon2";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username e senha são obrigatórios." });
      return;
    }

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: "O nome de usuário já está em uso." });
      return;
    }

    const hashedPassword = await argon2.hash(password);
    await UserModel.create({
      username,
      password: password,
      salt: hashedPassword,
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar o usuário." });
  }
};
