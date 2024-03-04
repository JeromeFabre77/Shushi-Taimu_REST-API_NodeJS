import { PrismaClient, Prisma } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();
const app = express();

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
                        boisson: true,
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
                        boisson: true,
                    }
                }
            },
        });
    }
    const uniqueCom = result.map(b => {

        const uniqueBox = b.boxtocom.map(btc => {
            if (btc.box) {
                return {
                    id: btc.box.id,
                    nom: btc.box.nom,
                    pieces: btc.box.pieces
                }
            }
        })
        const uniqueBoisson = b.boxtocom.map(btc => {
            if (btc.boisson) {
                return {
                    id: btc.boisson.id,
                    nom: btc.boisson.nom,
                }
            }
        })
        const commandes = {
            id: b.id,
            date: b.date,
            prix: b.prix_t,
            box: uniqueBox,
            boisson: uniqueBoisson
        }

        return {
            commande: commandes,
        }
    })


    res.send(JSON.stringify(uniqueCom, null, 2));
};