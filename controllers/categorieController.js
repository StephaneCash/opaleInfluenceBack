const db = require('../models');
const { ValidationError, UniqueConstraintError, ValidationErrorItem } = require('sequelize');

const getAllCategorie = async (req, res) => {
    try {
        let categories = await db.categories.findAll(
            {
                include: [
                    {
                        model: db.influenceurs,
                        as: "influenceurs"
                    },
                ]
            }
        );
        let taille = categories.length;
        res.status(200).json({ message: "La liste de categories a été trouvée avec succès", data: categories, taille: taille });

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
};

const createCategorie = async (req, res) => {
    try {
        let newCategorie = await db.categories.create(req.body);
        res.status(201).json({ message: "Catégorie créée avec succès", data: newCategorie })
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
            return res.status(500).json({ message: err })
        }
    }
};

const getOneCategorie = async (req, res) => {
    try {
        let id = req.params.id;
        let categorieFind = await db.categories.findOne({ where: { id: id } });

        if (categorieFind) {
            res.status(200).json({ message: "Catégorie trouvée avec succès", data: categorieFind });
        } else {
            res.status(404).json({ message: "Catégorie non trouvée avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const CategorieUpdated = async (req, res) => {
    try {
        let id = req.params.id;
        let findCategorie = await db.categories.findOne({ where: { id: id } });

        if (findCategorie) {
            let UpdateCategorie = await findCategorie.update(req.body, {
                where: { id: id }
            });
            if (UpdateCategorie) {
                let findcat = await db.categories.findOne({ where: { id: id } });
                res.status(200).json({ message: "Catégorie a été modifiée avec succès", data: findcat });
            }
        } else {
            res.status(404).json({ message: "Catégorie non trouvée avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const deleteCategorie = async (req, res) => {
    try {
        let id = req.params.id;
        let findCategorie = await db.categories.findOne({ where: { id: id } });

        if (findCategorie) {
            let catDeleted = await db.categories.destroy({ where: { id: id } });
            if (catDeleted === 1) {
                res.status(200).json({ message: "Catégorie a été supprimée avec succès", data: findCategorie });
            }
        } else {
            res.status(404).json({ message: "Catégorie non trouvée avec l'id : " + id });
        }

    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

module.exports = {
    getAllCategorie,
    createCategorie,
    getOneCategorie,
    CategorieUpdated,
    deleteCategorie
}

