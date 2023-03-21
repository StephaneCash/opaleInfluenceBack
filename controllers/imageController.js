const db = require('../models');
const { ValidationError, UniqueConstraintError, ValidationErrorItem } = require('sequelize');

const getAllImages = async (req, res) => {
    try {
        let images = await db.images.findAll();
        let taille = images.length;
        res.status(200).json({ message: "La liste des images a été trouvée avec succès", data: images, taille: taille });

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
};

const createImage = async (req, res) => {
    try {
        const { nom, description } = req.body;
        if (req.file) {
            let newImage = await db.images.create({
                nom: nom,
                description: description,
                url: `api/${req.file.path}`
            });
            res.status(201).json({ message: "Image créée avec succès", data: newImage })
        } else {
            let newImage = await db.images.create(req.body);
            res.status(201).json({ message: "Image créée avec succès", data: newImage })
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

const getOneImage = async (req, res) => {
    try {
        let id = req.params.id;
        let ImageFind = await db.images.findOne({ where: { id: id } });

        if (ImageFind) {
            res.status(200).json({ message: "Image trouvée avec succès", data: ImageFind });
        } else {
            res.status(404).json({ message: "Image non trouvée avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const ImageUpdated = async (req, res) => {
    try {
        let id = req.params.id;
        let findImage = await db.images.findOne({ where: { id: id } });

        if (findImage) {
            let UpdateImage = await findImage.update(req.body, {
                where: { id: id }
            });
            if (UpdateImage) {
                let findImage = await db.images.findOne({ where: { id: id } });
                res.status(200).json({ message: "Image a été modifiée avec succès", data: findImage });
            }
        } else {
            res.status(404).json({ message: "Image non trouvée avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const deleteImage = async (req, res) => {
    try {
        let id = req.params.id;
        let findImage = await db.images.findOne({ where: { id: id } });

        if (findImage) {
            let catDeleted = await db.images.destroy({ where: { id: id } });
            if (catDeleted === 1) {
                res.status(200).json({ message: "Image a été supprimée avec succès", data: findImage });
            }
        } else {
            res.status(404).json({ message: "Image non trouvée avec l'id : " + id });
        }

    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

module.exports = {
    getAllImages,
    createImage,
    getOneImage,
    ImageUpdated,
    deleteImage
}

