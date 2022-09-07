import { Request, Response } from "express";
import prisma from "../db/client";

export const getBatch = async (req: Request, res: Response) => {
  const getBatches: Object[] = await prisma.batch.findMany({
    select: {
      id: true,
      destinationIp: true,
      destinationAdres: true,
      hops: true,
      createdAt: true,
    },
  });
  return res.json({"data":getBatches});
};

export const getResults = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const getResults: Object[] = await prisma.result.findMany({
    where: {
      batchId: id,
    },
    select: {
      id: true,
      hop: true,
      ip: true,
      date: true,
    },
  });
  return res.json({"data":getResults});
};
