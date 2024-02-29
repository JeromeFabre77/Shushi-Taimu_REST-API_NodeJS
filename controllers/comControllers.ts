import { PrismaClient, Prisma } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());

export const readCom = async (req: Request, res: Response) => {
    const id = req.body;
    if (JSON.stringify(id) != "{}") {
        var result = await prisma.commandes.findMany({
            where: {
                OR: id
            },
            include: {
                boxtocom: {
                    include: {
                        box: true,
                    }
                }
            },
        });
    } else {
        var result = await prisma.commandes.findMany({
            include: {
                boxtocom: {
                    include: {
                        box: true,
                    }
                }
            },
        });
    }
    const uniqueCom = result.map(b => {

        const uniqueBox = b.boxtocom.map(btc => {
            return {
                id: btc.box.id,
                nom: btc.box.nom,
                pieces: btc.box.pieces
            }
        })
        const commandes = {
            id: b.id,
            date: b.date,
            prix: b.prix_t,
            box: uniqueBox
        }

        return commandes

    })


    res.send(`<pre>${JSON.stringify(uniqueCom, null, 2)}</pre>`);
};