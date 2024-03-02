import { PrismaClient, Prisma } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());

export const readBox = async (req: Request, res: Response) => {
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
        res.status(500).send({ error: 'Erreur lors de la récupération des boîtes' });
    }
};

export const deleteBox = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deleteAlim = prisma.aliments.deleteMany({
            where: {
                boxId: Number(id),
            }
        });
        const deleteSav = prisma.saveurs.deleteMany({
            where: {
                boxId: Number(id),
            }
        });
        const deleteBox = prisma.box.delete({
            where: {
                id: Number(id),
            },

        });
        const transaction = await prisma.$transaction([deleteAlim, deleteSav, deleteBox])
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la box' });
    }
};

export const updateBox = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nom, pieces, prix, image } = req.body;

    // Vérifiez si tous les champs nécessaires sont présents
    if (!nom || !pieces || !prix || !image) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const box = await prisma.box.findUnique({
            where: {
                id: Number(id)
            }
        });

        // Vérifiez si la box existe
        if (!box) {
            return res.status(404).json({ error: `Aucune box trouvée avec l'id ${id}` });
        }

        const updatedBox = await prisma.box.update({
            where: {
                id: Number(id)
            },
            data:
            {
                nom: String(nom),
                pieces: Number(pieces),
                prix: Number(prix),
                image: String(image)
            },
        });

        res.json(updatedBox);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Une erreur est survenue lors de la modification de la box avec l'id ${id}` });
    }
}

export const createBox = async (req: Request, res: Response) => {
    const box = req.body;

    if (!box) {
        return res.json(`Tous les champs sont requis`);
    }

    try {
        const newBox = await prisma.box.createMany({
            data: box,
            skipDuplicates: true
        })
        res.send(newBox);
    } catch (error) {
        res.status(500).json({ error: `Une erreur est survenue lors de la création de votre box ${JSON.stringify(box)}` });
    }
}

export const createAlim = async (req: Request, res: Response) => {
    const aliments = req.body;

    if (!aliments) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const newAlim = await prisma.aliments.createMany({
            data: aliments,
            skipDuplicates: true
        })
        res.json(newAlim);
    } catch (error) {
        res.status(500).json({ error: `Une erreur est survenue lors de la création de votre aliment ${JSON.stringify(aliments)}` });
    }
}

export const updateAlim = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nom, quantite, boxId } = req.body;

    // Vérifiez si tous les champs nécessaires sont présents
    if (!nom || !quantite || !boxId) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const aliments = await prisma.aliments.findUnique({
            where: {
                id: Number(id)
            }
        });

        // Vérifiez si l'aliment existe
        if (!aliments) {
            return res.status(404).json({ error: `Aucun aliment trouvée avec l'id ${id}` });
        }

        const updatedAlim = await prisma.aliments.update({
            where: {
                id: Number(id)
            },
            data:
            {
                nom: String(nom),
                quantite: Number(quantite),
                boxId: Number(boxId)
            },
        });

        res.json(updatedAlim);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Une erreur est survenue lors de l'aliment de la box avec l'id ${id}` });
    }
}

export const readAlim = async (req: Request, res: Response) => {
    const id = req.body;
    if (JSON.stringify(id) != "{}") {
        var result = await prisma.aliments.findMany({
            where: {
                OR: id
            }
        });
    } else {
        var result = await prisma.aliments.findMany()
    }

    res.send(`<pre>${JSON.stringify(result, null, 2)}</pre>`);
}

export const deleteAlim = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deleteAlim = await prisma.aliments.delete({
            where: {
                id: Number(id),
            }
        });
        res.json(deleteAlim);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'aliment' });
    }
}

export const createSav = async (req: Request, res: Response) => {
    const saveurs = req.body;

    if (!saveurs) {
        return res.json(`Tous les champs sont requis`);
    }

    try {
        const newSav = await prisma.saveurs.createMany({
            data: saveurs,
            skipDuplicates: true
        })
        res.send(newSav);
    } catch (error) {
        res.status(500).json({ error: `Une erreur est survenue lors de la création de votre saveur ${JSON.stringify(saveurs)}` });
    }
}

export const updateSav = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nom, boxId } = req.body;

    // Vérifiez si tous les champs nécessaires sont présents
    if (!nom || !boxId) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const saveurs = await prisma.saveurs.findUnique({
            where: {
                id: Number(id)
            }
        });

        // Vérifiez si la saveur existe
        if (!saveurs) {
            return res.status(404).json({ error: `Aucune saveur trouvée avec l'id ${id}` });
        }

        const updatedSav = await prisma.saveurs.update({
            where: {
                id: Number(id)
            },
            data:
            {
                nom: String(nom),
                boxId: Number(boxId)
            },
        });

        res.json(updatedSav);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Une erreur est survenue lors de la modification de la saveur avec l'id ${id}` });
    }
}

export const readSav = async (req: Request, res: Response) => {
    const id = req.body;
    if (JSON.stringify(id) != "{}") {
        var result = await prisma.saveurs.findMany({
            where: {
                OR: id
            }
        });
    } else {
        var result = await prisma.saveurs.findMany()
    }

    res.send(`<pre>${JSON.stringify(result, null, 2)}</pre>`);
}

export const deleteSav = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deleteSav = await prisma.saveurs.delete({
            where: {
                id: Number(id),
            }
        });
        res.json(deleteSav);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la saveur' });
    }
}