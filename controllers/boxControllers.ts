import { PrismaClient, Prisma } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());

exports.getAllBox = async (req: Request, res: Response) => {
    const id = req.body;
    try {
        if (JSON.stringify(id) != "{}") {
            var result = await prisma.box.findMany({
                where: {
                    OR: id
                },
                include: {
                    aliments: true,
                    saveurs: true,
                },
            });
        } else {
            var result = await prisma.box.findMany({
                include: {
                    aliments: true,
                    saveurs: true,
                },
            });
        }

        const uniqueResult = result.map((box) => {
            const uniqueAliments = box.aliments.map((alim) => {
                if (alim) {
                    return {
                        nom: alim.nom,
                        quantity: alim.quantite,
                    };
                }
            });
            const uniqueSaveurs = box.saveurs.map((sav) => {
                if (sav) {
                    return {
                        nom: sav.nom,
                    };
                }
            });
            return {
                ...box,
                aliments: uniqueAliments,
                saveurs: uniqueSaveurs,
            };
        });

        res.send(`<pre>${JSON.stringify(uniqueResult, null, 2)}</pre>`);
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des boîtes");
    }
};