import { Schema, Types } from "mongoose";
import { ActiveHistorySchema, activeHistorySchema } from "./ActiveHistoryModel";

export enum ActiveTypeSchema {
  FFI = "FFI",
  EFT = "EFT",
  OTHER = "OTHER",
  ACTION = "ACTION",
  CRIPTO = "CRIPTO",
  FIXED_INCOME = "FIXED_INCOME",
}

export type ActiveSchema = {
  _id?: string; // ID usado para requisições de update e delete
  type: ActiveTypeSchema; // Tipo de ativo, podendo ser FFI, EFT, ACTION, CRIPTO, FIXED_INCOME ou OTHER
  title: string; // Titulo
  shares: number; // Cotas do ativo
  balance: number; // Cotas do ativo * valor da cota
  value_per_share: number; // Valor da cota
  history: ActiveHistorySchema[]; // Histório
};

export const activeSchema = new Schema<ActiveSchema>(
  {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    shares: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    value_per_share: {
      type: Number,
      required: true,
    },
    history: {
      type: [activeHistorySchema],
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);
