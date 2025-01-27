import { Request, Response } from "express";
import { UserModel } from "../../infra/libs/mongoose/models/UserModel";
import { Types, Schema } from "mongoose";
import {
  ActiveSchema,
  ActiveTypeSchema,
} from "../../infra/libs/mongoose/models/ActiveModel";
import { ActiveHistorySchema } from "../../infra/libs/mongoose/models/ActiveHistoryModel";

// TODO: Criar função para cadastro do histórico do ativo
// Essa função de calcular a variação do histórico em relação ao seu anterior (se tive)
// Essa função deve ser generica, para que a rota de criação/update do ativo possam receber o histórico

// TODO: Ajustar calculo do total do ativo baseando-se no histórico
// Esse valor deve ser calculado baseando-se no total de registros histórico do ativo
// Se for 0, considerar o valor do ativo

const getActiveTypeByString = (type: string): ActiveTypeSchema => {
  switch (type.toUpperCase()) {
    case "FFI":
      return ActiveTypeSchema.FFI;
    case "EFT":
      return ActiveTypeSchema.EFT;
    case "ACTION":
      return ActiveTypeSchema.ACTION;
    case "CRIPTO":
      return ActiveTypeSchema.CRIPTO;
    case "FIXED_INCOME":
      return ActiveTypeSchema.FIXED_INCOME;
    case "OTHER":
    default:
      return ActiveTypeSchema.OTHER;
  }
};

export const summary = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findOne({ username: req.headers.username });
    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    res.status(200).json(user.toJSON().actives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

export const deleteActive = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params?.["id"];

    if (!id) {
      res.status(400).json({
        error: "Id é  obrigatório para deletar a atividade.",
      });

      return;
    }

    const user = await UserModel.findOne({ username: req.headers.username });
    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    const activeIndex = user.actives.findIndex(
      (active) => active._id?.toString() === id
    );
    if (activeIndex === -1) {
      res.status(404).json({ error: "Ativo não encontrado." });
      return;
    }

    user.actives.splice(activeIndex, 1);
    user.markModified("actives");
    await user.save();

    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

export const updateActive = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params?.["id"];
    const { type, title, shares, value_per_share } = req.body;

    const user = await UserModel.findOne({ username: req.headers.username });
    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    if (!id) {
      res
        .status(400)
        .json({ error: "Id é obrigatório para atualizar o ativo." });
      return;
    }

    const activeIndex = user.actives.findIndex((active) => {
      return active?._id?.toString() === id;
    });

    if (activeIndex === -1) {
      res.status(404).json({ error: "Ativo não encontrado." });
      return;
    }

    user.actives[activeIndex].title = title;
    user.actives[activeIndex].type = getActiveTypeByString(type);
    user.actives[activeIndex].shares = shares;
    user.actives[activeIndex].balance = shares * value_per_share;
    user.actives[activeIndex].value_per_share = value_per_share;

    await user.save();
    user.markModified("actives");
    res.status(200).json(user.actives[activeIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

export const createActive = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, title, shares, value_per_share } = req.body;

    if (!type || !title || !shares || !value_per_share) {
      res.status(400).json({
        error: "Título, tipo, cotas e valor por cota são obrigatórios.",
      });
      return;
    }

    const user = await UserModel.findOne({ username: req.headers.username });
    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    const newActive = {
      _id: new Types.ObjectId().toString(),
      type: getActiveTypeByString(type),
      title: title as string,
      shares: shares as number,
      balance: shares * value_per_share,
      variation: 0,
      value_per_share: value_per_share as number,
      history: [] as Array<ActiveHistorySchema>,
    };

    user.actives.push(newActive);
    user.markModified("actives");
    await user.save();

    res.status(201).json(newActive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

export const createActiveHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activeId = req.params["id"];
    const { value, incomeDate } = req.body;

    if (!activeId) {
      res.status(400).json({
        error: "O id da atividade obrigatório.",
      });
      return;
    }

    if (!value || !incomeDate) {
      res.status(400).json({
        error: "O valor e data do histórico são obrigatórios.",
      });
      return;
    }

    const history = await upsertActiveHistory({
      username: req.headers.username as string,
      activeId: activeId,
      history: {
        value: value as number,
        variation: 0,
        incomeDate: new Date(incomeDate),
      },
    });

    res.status(201).json(history);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      res.status(500).json({ error: err });
      return;
    }

    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

export const updateActiveHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activeId = req.params["activeId"];
    const historyId = req.params["historyId"];
    const { value, incomeDate } = req.body;

    if (!activeId) {
      res.status(400).json({
        error: "O id da atividade obrigatório.",
      });
      return;
    }

    if (!historyId) {
      res.status(400).json({
        error: "O id do histório é obrigatório.",
      });
      return;
    }

    if (!value || !incomeDate) {
      res.status(400).json({
        error: "O valor e data do histórico são obrigatórios.",
      });
      return;
    }

    const history = await upsertActiveHistory({
      username: req.headers.username as string,
      activeId: activeId,
      history: {
        _id: historyId,
        value: value as number,
        variation: 0,
        incomeDate: new Date(incomeDate),
      },
    });

    res.status(201).json(history);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      res.status(500).json({ error: err });
      return;
    }

    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

export const deleteActiveHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activeId = req.params["activeId"];
    const historyId = req.params["historyId"];

    if (!activeId) {
      res.status(400).json({
        error: "O id da atividade obrigatório.",
      });
      return;
    }

    if (!historyId) {
      res.status(400).json({
        error: "O id do histório é obrigatório.",
      });
      return;
    }

    const user = await UserModel.findOne({ username: req.headers.username });

    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    const activeIndex = user.actives.findIndex(
      (active) => active._id?.toString() === activeId
    );

    if (activeIndex === -1) {
      res.status(404).json({ error: "Ativo não encontrado." });
      return;
    }

    const historyIndex = user.actives[activeIndex].history.findIndex(
      (history) => history._id?.toString() === historyId
    );

    if (historyIndex === -1) {
      res.status(404).json({ error: "Histórico não encontrado." });
      return;
    }

    user.actives[activeIndex].history.splice(historyIndex, 1);
    user.actives[activeIndex].history = reordenateAndRecalculateHistory(
      user.actives[activeIndex].history
    );

    user.markModified("actives");

    await user.save();
    res.status(200).send();
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      res.status(500).json({ error: err });
      return;
    }

    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

const calculatePercentil = (value: number, lastValue: number): number => {
  return Number(((value / lastValue) * 100 - 100).toFixed(2));
};

const reordenateAndRecalculateHistory = (
  history: Array<ActiveHistorySchema>
): Array<ActiveHistorySchema> => {
  history = history.sort(
    (a, b) =>
      new Date(a.incomeDate).getTime() - new Date(b.incomeDate).getTime()
  );

  for (let i = 0; i < history.length; i++) {
    const lastValue = history?.[i - 1]?.value;
    const value = history?.[i]?.value;

    history[i].variation =
      lastValue == undefined || value == undefined
        ? 0
        : calculatePercentil(value, lastValue);
  }

  return history;
};

const upsertActiveHistory = async ({
  username,
  activeId,
  history,
}: {
  username: string;
  activeId: string;
  history: ActiveHistorySchema;
}): Promise<ActiveHistorySchema> => {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) throw new Error("Usuário não encontrado.");

    const activeIndex = user.actives.findIndex(
      (active) => active._id?.toString() === activeId
    );

    if (activeIndex === -1) throw new Error("Ativo não encontrado.");

    const active = user.actives[activeIndex];
    const isUpdate = history._id !== undefined;
    const historyIndex = active.history.findIndex(
      (h) => h._id?.toString() === history._id
    );

    if (isUpdate && historyIndex === -1)
      throw new Error("Histórico não encontrado.");

    if (isUpdate) {
      active.history[historyIndex].value = history.value;
      active.history[historyIndex].incomeDate = history.incomeDate;
      user.actives[activeIndex] = active;
    } else {
      history._id = new Types.ObjectId().toString();
      active.history.push(history);
    }

    active.history = reordenateAndRecalculateHistory(active.history);
    user.markModified("actives");
    await user.save();

    const updatedHistory = active.history.find(
      (h) => h._id?.toString() === history._id
    );

    return updatedHistory ?? history;
  } catch (err) {
    console.error(err);
    throw new Error("Erro no servidor.");
  }
};
