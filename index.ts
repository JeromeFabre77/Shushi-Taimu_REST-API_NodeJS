import express, { Request, Response } from 'express';
import { PrismaClient, Box, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

type BoxWithRelations = Prisma.BoxGetPayload<{
    include: { aliments: true; saveurs: true }
}>;

// app.post creer
app.put('/add-box', async (req: Request, res: Response) => {

})

app.delete('/delete-box/:id', async (req: Request, res: Response) => {
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
});

app.get('/box', async (req: Request, res: Response) => {
    const result = await prisma.box.findMany({
        include: {
            aliments: true,
            saveurs: true,
        },
    });

    const uniqueResult = (result as BoxWithRelations[]).map(box => {
        const uniqueAliments = Array.from(new Set(box.aliments.map(a => a.nom)))
            .map(nom => {
                const aliment = box.aliments.find(a => a.nom === nom);
                if (aliment) {
                    return {
                        nom: aliment.nom,
                        quantite: aliment.quantite,
                    };
                }
            })
            .filter(Boolean); // pour supprimer les valeurs undefined

        const uniqueSaveurs = Array.from(new Set(box.saveurs.map(s => s.nom)));

        return {
            ...box,
            aliments: uniqueAliments,
            saveurs: uniqueSaveurs,
        };
    });

    res.send(`<pre>${JSON.stringify(uniqueResult, null, 2)}</pre>`);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});