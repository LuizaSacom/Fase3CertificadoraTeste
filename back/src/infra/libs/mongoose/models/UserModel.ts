import { ActiveSchema, activeSchema } from "./ActiveModel";
import mongoose, { Document, Schema } from "mongoose";

export type UserSchema = {
  id: Schema.Types.ObjectId;
  salt: string;
  actives: ActiveSchema[];
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  resetPasswordToken?: string; // Novo campo para o token de recuperação de senha
  resetPasswordTokenExpiration?: number; // Novo campo para a validade do token
} & Document;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    actives: {
      type: [activeSchema],
      default: [],
      required: true,
    },
    resetPasswordToken: {
      type: String,
      default: null, // Por padrão, nenhum token estará associado ao usuário
    },
    resetPasswordTokenExpiration: {
      type: Number,
      default: null, // Inicialmente, sem validade definida
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform(__: any, ret: any) {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;

    // Transformando ativos e histórico
    ret.actives = ret.actives.map((active: any) => {
      active.id = active._id;
      delete active._id;

      active.history = active.history.map((h: any) => {
        h.id = h._id;
        delete h._id;

        return h;
      });

      return active;
    });

    return ret;
  },
});

export const UserModel = mongoose.connection.model<UserSchema>(
  "user",
  userSchema
);
