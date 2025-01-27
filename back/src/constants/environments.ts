import * as dotenv from "dotenv";
dotenv.config();

export const environments = {
  PORT: `${process.env.PORT}`,
  DB_NAME: `${process.env.DB_NAME ?? "teste"}`,
  MONGO_URL: `${process.env.MONGO_URL}`,
  JWT_SECRET: `${process.env.JWT_SECRET}`,
};
