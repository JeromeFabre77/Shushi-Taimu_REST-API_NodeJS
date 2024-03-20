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
            statut: b.statut,
            box: uniqueBox,
            boisson: uniqueBoisson
        }

        return {
            commande: commandes,
        }
    })


    res.send(JSON.stringify(uniqueCom, null, 2));
};

export const createCom = async (req: Request, res: Response) => {
    const { prix_t } = req.body;

    if (!prix_t) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {

        const newCom = await prisma.commandes.create({
            data: {
                prix_t: Number(prix_t)
            }
        })

        res.json(newCom);

    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la création de votre commandes' });
    }
}

export const createBtc = async (req: Request, res: Response) => {
    const commandes = req.body;

    if (!commandes) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const newBtc = await prisma.boxtocom.createMany({
            data: commandes,
            skipDuplicates: true
        })

        res.json(newBtc);

    } catch (error) {
        res.status(500).json({ error: `Une erreur est survenue lors de la création de votre commandes ${JSON.stringify(commandes)}` });
    }
}

export const updateCom = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { statut } = req.body;

    // Vérifiez si tous les champs nécessaires sont présents
    if (!statut) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {

        const updatedBox = await prisma.commandes.update({
            where: {
                id: Number(id)
            },
            data:
            {
                statut: Number(statut)
            },
        });

        res.json(updatedBox);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Une erreur est survenue lors de la modification de la commande avec l'id ${id}` });
    }
}