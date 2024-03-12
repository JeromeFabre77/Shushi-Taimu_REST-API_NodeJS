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

    res.send(JSON.stringify(result, null, 2));
}

export const createBoi = async (req: Request, res: Response) => {
    const boissons = req.body;

    if (!boissons) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const newBoi = await prisma.boisson.createMany({
            data: boissons,
            skipDuplicates: true
        })
        res.json(newBoi);
    } catch (error) {
        res.status(500).json({ error: `Une erreur est survenue lors de la création de votre boisson ${JSON.stringify(boissons)}` });
    }
}

export const updateBoi = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nom, prix } = req.body;

    // Vérifiez si tous les champs nécessaires sont présents
    if (!nom || !prix) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const boissons = await prisma.boisson.findUnique({
            where: {
                id: Number(id)
            }
        });

        // Vérifiez si l'aliment existe
        if (!boissons) {
            return res.status(404).json({ error: `Aucun aliment trouvée avec l'id ${id}` });
        }

        const updatedBoi = await prisma.boisson.update({
            where: {
                id: Number(id)
            },
            data:
            {
                nom: String(nom),
                prix: Number(prix)
            },
        });

        res.json(updatedBoi);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Une erreur est survenue lors de l'aliment de la box avec l'id ${id}` });
    }
}

export const deleteBoi = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deleteBoi = await prisma.aliments.delete({
            where: {
                id: Number(id),
            }
        });
        res.json(deleteBoi);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la boisson' });
    }
}