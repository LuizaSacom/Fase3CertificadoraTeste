import { Schema } from "mongoose";

export type ActiveHistorySchema = {
  _id?: string; // ID usado para update/delete
  value: number; // Valor da movimentação do histórico
  variation: number; // Variação em relação ao histórico anterior
  incomeDate: Date; // Data da variação
};

export const activeHistorySchema = new Schema<ActiveHistorySchema>({
  value: {
    type: Number,
    required: true,
  },
  variation: {
    type: Number,
    required: true,
  },
  incomeDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
