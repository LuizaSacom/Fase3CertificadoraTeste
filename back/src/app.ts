import express from "express";
import mongoose from "mongoose";
import { environments } from "./constants/environments";
import { login } from "./presentation/controllers/AuthController";
import {
  register,
  resetPassword,
} from "./presentation/controllers/UserController";
import { activeRoutes } from "./presentation/routes/ActiveRoutes";

const cors = require('cors');
const app = express();

app.use(cors());

mongoose
  .connect(environments.MONGO_URL, {
    dbName: environments.DB_NAME,
  })
  .then(() => {
    console.log("Conectado ao MongoDB!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });

app.use(express.json());
app.post("/users", register);
app.post("/users/reset-password", resetPassword);
app.post("/login", login);
app.use("/actives", activeRoutes);

app.listen(environments.PORT, () => {
  console.log(`Example app listening on port ${environments.PORT}`);
});