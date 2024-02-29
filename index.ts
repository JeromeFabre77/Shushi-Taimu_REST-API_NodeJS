import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { readBox, deleteBox, updateBox, createBox, createAlim, updateAlim, readAlim, deleteAlim, createSav, updateSav, readSav, deleteSav } from './controllers/boxControllers';
import { readBoisson } from './controllers/boissonControllers';

const app = express();
const port = 3000;

// type BoxWithRelations = Prisma.BoxGetPayload<{
//     include: { aliments: true; saveurs: true }
// }>;

//-----------------------------------------------------------------------------------------------------------------------------------------------
//Commande

//Affichage de toutes les commandes si le body est vide sinon affiche par id
// app.get('/commandes', async (req: Request, res: Response) => {
//     const id = req.body;
//     if (JSON.stringify(id) != "{}") {
//         var result = await prisma.boxToCom.findMany({
//             where: {
//                 OR: id
//             },
//             include: {
//                 box: true,
//                 commandes: true
//             },
//         });
//     } else {
//         var result = await prisma.boxToCom.findMany({
//             include: {
//                 box: true,
//                 commandes: true
//             },
//         });
//     }
// 
// const uniqueResult = (result as ComWithRelations[]).map(com => {
//     const commandes = com.commandes
//     const box = com.box

//     const uniqueBox =
//     {
//         id: box.id,
//         nom: box.nom,
//         prix: box.prix,
//     };

//     return {
//         ...commandes,
//         box: uniqueBox,
//     };
// })
// res.send(`<pre>${JSON.stringify(uniqueResult, null, 1)}</pre>`);
//     const uniqueResult = (result as ComWithRelations[]).map(com => {
//         const commandes = com.commandes
//         const uniqueBox = Array.from(new Set(com.box.map(b => b.nom)))
//             .map(nom => {
//                 const box = com.box.find(b => b.nom === nom);
//                 if (box) {
//                     return {
//                         id: box.id,
//                         nom: box.nom,
//                         prix: box.prix,
//                     };
//                 }
//             })
//             .filter(Boolean); // pour supprimer les valeurs undefined

//         return {
//             ...commandes,
//             box: com.box,
//         };
//     });

//     res.send(`<pre>${JSON.stringify(uniqueResult, null, 2)}</pre>`);
// });

//-----------------------------------------------------------------------------------------------------------------------------------------------
//Boisson

//Affichage de toutes les boissons si le body est vide sinon affiche par id
app.get('/boissons', readBoisson)

//-----------------------------------------------------------------------------------------------------------------------------------------------
//Box

//Delete une saveur par id
app.delete('/box/saveurs/:id', deleteSav)

//Affichage de toutes les saveurs si le body est vide sinon affiche par id
app.get('/box/saveurs', readSav)

//Modification d'une saveur à partir de son id
app.put('/box/saveurs/:id', updateSav)

//Création de saveurs dans une box
app.post('/box/saveurs', createSav)

//Delete un aliment par id
app.delete('/box/aliments/:id', deleteAlim)

//Affichage de toutes les aliments si le body est vide sinon affiche par id
app.get('/box/aliments', readAlim)

//Modification d'un aliments à partir de son id
app.put('/box/aliments/:id', updateAlim)

//Création d'aliments dans une box
app.post('/box/aliments', createAlim)

//Création de box
app.post('/box', createBox)

//Modification d'une box par id
app.put('/box/:id', updateBox)

//Delete une box par id
app.delete('/box/:id', deleteBox)

//Affichage de toutes les box si le body est vide sinon affiche par id
app.get('/box', readBox)

app.listen(port, () => {
    console.log(`Le serveur est lancé à l'adresse http://localhost:${port}`);
});