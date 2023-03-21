const db = require('../models');
const { ValidationError, UniqueConstraintError, ValidationErrorItem } = require('sequelize');

const getAllArticles = async (req, res) => {
    try {
        let articles = await db.articles.findAll({
            include: [
                {
                    model: db.images,
                    as: "images"
                },
                {
                    model: db.videos,
                    as: "videos"
                },
            ]
        });
        let taille = articles.length;
        res.status(200).json({ message: "La liste des articles a été trouvée avec succès", data: articles, taille: taille });

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
};

const createArticle = async (req, res) => {
    try {
        let newArticle = await db.articles.create(req.body);
        res.status(201).json({ message: "Article créé avec succès", data: newArticle })
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

const getOneArticle = async (req, res) => {
    try {
        let id = req.params.id;
        let articleFind = await db.articles.findOne({ where: { id: id } });

        if (articleFind) {
            res.status(200).json({ message: "Article trouvé avec succès", data: articleFind });
        } else {
            res.status(404).json({ message: "Article non trouvé avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const articleUpdated = async (req, res) => {
    try {
        let id = req.params.id;
        let findArticle = await db.articles.findOne({ where: { id: id } });

        if (findArticle) {
            let updateArticle = await findArticle.update(req.body, {
                where: { id: id }
            });
            if (updateArticle) {
                let findArticle = await db.articles.findOne({ where: { id: id } });
                res.status(200).json({ message: "Article a été modifiée avec succès", data: findArticle });
            }
        } else {
            res.status(404).json({ message: "Article non trouvée avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const deleteArticle = async (req, res) => {
    try {
        let id = req.params.id;
        let findArticle = await db.articles.findOne({ where: { id: id } });

        if (findArticle) {
            let articleDel = await db.articles.destroy({ where: { id: id } });
            if (articleDel === 1) {
                res.status(200).json({ message: "Article a été supprimée avec succès", data: findArticle });
            }
        } else {
            res.status(404).json({ message: "Article non trouvée avec l'id : " + id });
        }

    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

module.exports = {
    getAllArticles,
    createArticle,
    getOneArticle,
    articleUpdated,
    deleteArticle
}

