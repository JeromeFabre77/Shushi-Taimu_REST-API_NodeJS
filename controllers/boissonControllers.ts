import { PrismaClient, Prisma } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());

export const readBoisson = async (req: Request, res: Response) => {
    const id = req.body;
    if (JSON.stringify(id) != "{}") {
        var result = await prisma.boisson.findMany({
            where: {
                OR: id
            }
        });
    } else {
        var result = await prisma.boisson.findMany()
    }

    res.send(`<pre>${JSON.stringify(result, null, 2)}</pre>`);
}