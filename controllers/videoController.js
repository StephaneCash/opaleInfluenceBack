const db = require('../models');
const { ValidationError, UniqueConstraintError, ValidationErrorItem } = require('sequelize');

const getAllVideos = async (req, res) => {
    try {
        let videos = await db.videos.findAll();
        let taille = videos.length;
        res.status(200).json({ message: "La liste des videos a été trouvée avec succès", data: videos, taille: taille });

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
};

const createVideo = async (req, res) => {
    try {
        let newVideo = await db.videos.create(req.body);
        res.status(201).json({ message: "Video créée avec succès", data: newVideo })
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

const getOneVideo = async (req, res) => {
    try {
        let id = req.params.id;
        let VideoFind = await db.videos.findOne({ where: { id: id } });

        if (VideoFind) {
            res.status(200).json({ message: "Video trouvée avec succès", data: VideoFind });
        } else {
            res.status(404).json({ message: "Video non trouvée avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const VideoUpdated = async (req, res) => {
    try {
        let id = req.params.id;
        let findVideo = await db.videos.findOne({ where: { id: id } });

        if (findVideo) {
            let UpdateVideo = await findVideo.update(req.body, {
                where: { id: id }
            });
            if (UpdateVideo) {
                let findVideo = await db.videos.findOne({ where: { id: id } });
                res.status(200).json({ message: "Video a été modifiée avec succès", data: findVideo });
            }
        } else {
            res.status(404).json({ message: "Video non trouvée avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const deleteVideo = async (req, res) => {
    try {
        let id = req.params.id;
        let findVideo = await db.videos.findOne({ where: { id: id } });

        if (findVideo) {
            let videoDeletd = await db.videos.destroy({ where: { id: id } });
            if (videoDeletd === 1) {
                res.status(200).json({ message: "Video a été supprimée avec succès", data: findVideo });
            }
        } else {
            res.status(404).json({ message: "Video non trouvée avec l'id : " + id });
        }

    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

module.exports = {
    getAllVideos,
    createVideo,
    getOneVideo,
    VideoUpdated,
    deleteVideo
}

