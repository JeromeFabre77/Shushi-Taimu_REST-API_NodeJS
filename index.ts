import express, { Request, Response } from 'express';
import { PrismaClient, Box, Prisma } from '@prisma/client';
import bodyParser from 'body-parser';




const prisma = new PrismaClient();
const app = express();
const port = 3000;
app.use(bodyParser.json());

type BoxWithRelations = Prisma.BoxGetPayload<{
    include: { aliments: true; saveurs: true }
}>;

app.post('/creer-box', async (req: Request, res: Response) => {
    const { nom, pieces, prix, image } = req.body;

    try {
        const newBox = await prisma.box.create({
            data: {
                nom: String(nom),
                pieces: Number(pieces),
                prix: Number(prix),
                image: String(image),
            },
        });
        res.json(newBox);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la création de la box' });
    }

});


app.put('/modif-box/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nom, pieces, prix, image } = req.body;

    // Vérifiez si tous les champs nécessaires sont présents
    if (!nom || !pieces || !prix || !image) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const box = await prisma.box.findUnique({ where: { id: Number(id) } });

        // Vérifiez si la box existe
        if (!box) {
            return res.status(404).json({ error: `Aucune box trouvée avec l'id ${id}` });
        }

        const updatedBox = await prisma.box.update({
            where: { id: Number(id) },
            data: { nom, pieces: Number(pieces), prix: Number(prix), image },
        });

        res.json(updatedBox);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Une erreur est survenue lors de la modification de la box avec l'id ${id}` });
    }
});

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