import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient, Box, Prisma } from '@prisma/client';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();
const app = express();
const port = 3000;
app.use(bodyParser.json());
type BoxWithRelations = Prisma.BoxGetPayload<{
    include: { aliments: true; saveurs: true }
}>;

//-----------------------------------------------------------------------------------------------------------------------------------------------
//Box

//Delete une saveur par id
app.delete('/box/saveurs/:id', async (req: Request, res: Response) => {
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
});

//Affichage de toutes les saveurs si le body est vide sinon affiche par id
app.get('/box/saveurs', async (req: Request, res: Response) => {
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
});

//Modification d'une saveur à partir de son id
app.put('/box/saveurs/:id', async (req: Request, res: Response) => {
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
});

//Création de saveurs dans une box
app.post('/box/saveurs', async (req: Request, res: Response) => {
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
})

//Delete un aliment par id
app.delete('/box/aliments/:id', async (req: Request, res: Response) => {
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
});

//Affichage de toutes les aliments si le body est vide sinon affiche par id
app.get('/box/aliments', async (req: Request, res: Response) => {
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
});

//Modification d'un aliments à partir de son id
app.put('/box/aliments/:id', async (req: Request, res: Response) => {
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
});

//Création d'aliments dans une box
app.post('/box/aliments', async (req: Request, res: Response) => {
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
        res.status(500).json({ error: `Une erreur est survenue lors de la création de votre saveur ${JSON.stringify(aliments)}` });
    }
})

//Création de box
app.post('/box', async (req: Request, res: Response) => {
    const { nom, pieces, prix, image } = req.body;

    // Vérifiez si tous les champs nécessaires sont présents
    if (!nom || !pieces || !prix || !image) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

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

//Modification d'une box par id
app.put('/box/:id', async (req: Request, res: Response) => {
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
});

//Delete une box par id
app.delete('/box/:id', async (req: Request, res: Response) => {
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

//Affichage de toutes les box si le body est vide sinon affiche par id
app.get('/box', async (req: Request, res: Response) => {
    const id = req.body;
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
    console.log(`Le serveur est lancé à l'adresse http://localhost:${port}`);
});