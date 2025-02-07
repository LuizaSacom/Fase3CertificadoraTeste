import * as nodemailer from "nodemailer";
import generator from "generate-password";
import { Request, Response } from "express";
import { UserModel } from "../../infra/libs/mongoose/models/UserModel";
import * as argon2 from "argon2";
import { environments } from "../../constants/environments";
import Mail from "nodemailer/lib/mailer";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      res
        .status(400)
        .json({ error: "E-mail, username e senha são obrigatórios." });
      return;
    }

    const existingUserName = await UserModel.findOne({ username });
    const existingUserEmail = await UserModel.findOne({ email });
    if (existingUserName || existingUserEmail) {
      res
        .status(400)
        .json({ error: "O e-mail/nome de usuário já está em uso." });
      return;
    }

    const hashedPassword = await argon2.hash(password);
    await UserModel.create({
      email,
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

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        error: "É necessário e-mail para solicitar redefinição de senha.",
      });
      return;
    }

    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
      res
        .status(400)
        .json({ error: "O e-mail não está cadastrado em nossa base." });
      return;
    }

    const newPassword = generator.generate({
      length: 8,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      auth: {
        user: environments.NODEMAILER_USER,
        pass: environments.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions: Mail.Options = {
      to: email,
      from: environments.NODEMAILER_USER,
      subject: "Redefinição de senha",
      html: `
        <h3>Olá, ${userExists.username}!</h3>

        <p>Sua nova senha é: <strong>${newPassword}</strong> </p>
      `,
    };

    transporter.sendMail(mailOptions, async (err: any, info: any) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao alterar a senha do usuário." });
      } else {
        const hashedPassword = await argon2.hash(newPassword);
        await UserModel.updateOne(
          {
            email,
          },
          {
            password: newPassword,
            salt: hashedPassword,
          }
        );
        res.status(200).json({ message: "Redefinição efetuada com sucesso." });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao alterar a senha do usuário." });
  }
};