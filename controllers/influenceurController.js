const db = require('../models');
const { ValidationError, UniqueConstraintError, ValidationErrorItem } = require('sequelize');

const getAllInfluenceurs = async (req, res) => {
    try {
        let influeceurs = await db.influenceurs.findAll(
            {
                include: [
                    {
                        model: db.images,
                        as: "images"
                    },
                    {
                        model: db.videos,
                        as: "videos"
                    },
                    {
                        model: db.categories,
                        as: "categorie"
                    }
                ]
            }
        );
        let taille = influeceurs.length;
        res.status(200).json({ message: "La liste d'influenceurs a été trouvée avec succès", data: influeceurs, taille: taille });

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
};

const createInfluenceur = async (req, res) => {
    try {
        const { nom, postnom, prenom, pseudo, categorieId, textDetaillle, detail } = req.body;
        if (req.file) {
            let newInfluenceur = await db.influenceurs.create({
                nom: nom,
                postnom: postnom,
                prenom: prenom,
                textDetaillle: textDetaillle,
                detail: detail,
                categorieId: categorieId,
                pseudo: pseudo,
                textDetaillle: textDetaillle,
                url: `api/${req.file.path}`
            });
            res.status(201).json({ message: "Influenceur créé avec succès", data: newInfluenceur });
        } else {
            let newInfluenceur = await db.influenceurs.create(req.body);
            res.status(201).json({ message: "Influenceur créé avec succès", data: newInfluenceur });
        }
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({
                message: err && err.errors ? err.errors.map(e => e.message) : err
            });
        }
        else if (err instanceof UniqueConstraintError) {
            return res.status(400).json({
                message: err && err.errors ? err.errors.map(e => e.message) : err
            });
        }
        else if (err instanceof ValidationErrorItem) {
            return res.status(400).json({
                message: err && err.errors ? err.errors.map(e => e.message) : err
            });
        }
        else {
            return res.status(500).json({ message: err });
        }
    }
};

const getOneInfluenceur = async (req, res) => {
    try {
        let id = req.params.id;
        let influenceurFind = await db.influenceurs.findOne({ where: { id: id } });

        if (influenceurFind) {
            res.status(200).json({ message: "Influenceur trouvé avec succès", data: influenceurFind });
        } else {
            res.status(404).json({ message: "Influenceur non trouvé avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const updateInfluenceur = async (req, res) => {
    try {
        let id = req.params.id;
        const { nom, postnom, prenom, pseudo, categorieId, textDetaillle, detail } = req.body;

        let findInfluenceur = await db.influenceurs.findOne({ where: { id: id } });

        if (findInfluenceur) {
            if (req.file) {
                let updatedInfluenceur = await findInfluenceur.update({
                    nom: nom,
                    postnom: postnom,
                    prenom: prenom,
                    textDetaillle: textDetaillle,
                    detail: detail,
                    categorieId: categorieId,
                    pseudo: pseudo,
                    textDetaillle: textDetaillle,
                    url: `api/${req.file.path}`
                }, {
                    where: { id: id }
                });
                if (updatedInfluenceur) {
                    let findInfluenceurInAll = await db.influenceurs.findOne({ where: { id: id } });
                    res.status(200).json({ message: "Influenceur a été modifié avec succès", data: findInfluenceurInAll });
                }
            } else {
                let updatedInfluenceur = await findInfluenceur.update(req.body, {
                    where: { id: id }
                });
                if (updatedInfluenceur) {
                    let findInfluenceurInAll = await db.influenceurs.findOne({ where: { id: id } });
                    res.status(200).json({ message: "Influenceur a été modifié avec succès", data: findInfluenceurInAll });
                }
            }
        } else {
            res.status(404).json({ message: "Influenceur non trouvé avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const deleteInfluenceur = async (req, res) => {
    try {
        let id = req.params.id;
        let findInfluenceur = await db.influenceurs.findOne({ where: { id: id } });

        if (findInfluenceur) {
            let influeceurDeleted = await db.influenceurs.destroy({ where: { id: id } });
            if (influeceurDeleted === 1) {
                res.status(200).json({ message: "Influenceur a été supprimé avec succès", data: findInfluenceur });
            }
        } else {
            res.status(404).json({ message: "Influenceur non trouvé avec l'id : " + id });
        }

    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

module.exports = {
    getAllInfluenceurs,
    createInfluenceur,
    getOneInfluenceur,
    updateInfluenceur,
    deleteInfluenceur,
}

