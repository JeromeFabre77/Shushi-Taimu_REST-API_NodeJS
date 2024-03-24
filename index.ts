import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import { readBox, deleteBox, updateBox, createBox, createAlim, updateAlim, readAlim, deleteAlim, createSav, updateSav, readSav, deleteSav } from './controllers/boxControllers';

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

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