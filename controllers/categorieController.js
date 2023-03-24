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
        res.status(200).json(categories);

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
};

const createCategorie = async (req, res) => {
    console.log(req.file)
    try {
        if (req.file) {
            const { nom, description } = req.body;

            let newCategorie = await db.categories.create({
                nom: nom,
                description: description,
                url: `api/${req.file.path}`
            });
            res.status(201).json(newCategorie);
        } else {
            let newCategorie = await db.categories.create(req.body);
            res.status(201).json(newCategorie)
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

const categorieUpdated = async (req, res) => {
    try {
        let id = req.params.id;
        let findCategorie = await db.categories.findOne({ where: { id: id } });

        if (findCategorie) {
            if (req.file) {
                const { nom, description } = req.body;
                let UpdateCategorie = await findCategorie.update({
                    nom: nom,
                    description: description,
                    url: `api/${req.file.path}`
                }, {
                    where: { id: id }
                });
                if (UpdateCategorie) {
                    let findcat = await db.categories.findOne({ where: { id: id } });
                    res.status(200).json(findcat);
                }
            } else {
                let UpdateCategorie = await findCategorie.update(req.body, {
                    where: { id: id }
                });
                if (UpdateCategorie) {
                    let findcat = await db.categories.findOne({ where: { id: id } });
                    res.status(200).json(findcat);
                }
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
    categorieUpdated,
    deleteCategorie
}

