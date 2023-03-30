const db = require('../models');
const { ValidationError, UniqueConstraintError, ValidationErrorItem } = require('sequelize');

const getAllContacts = async (req, res) => {
    try {
        let contacts = await db.contacts.findAll();
        res.status(200).json(contacts);

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
};

const createContact = async (req, res) => {
    try {
        let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
        if (req.body.email.match(pattern)) {
            let newContact = await db.contacts.create(req.body);
            res.status(201).json(newContact);
        } else {
            return res.status(400).json({ message: "Adresse email non valide" });
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

const getOneContact = async (req, res) => {
    try {
        let id = req.params.id;
        let contactFind = await db.contacts.findOne({ where: { id: id } });

        if (contactFind) {
            res.status(200).json(contactFind);
        } else {
            res.status(404).json({ message: "Contact non trouvée avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const contactUpdated = async (req, res) => {
    try {
        let id = req.params.id;
        let findContact = await db.contacts.findOne({ where: { id: id } });

        if (findContact) {
            let updateContact = await findContact.update(req.body, {
                where: { id: id }
            });
            if (updateContact) {
                let find = await db.contacts.findOne({ where: { id: id } });
                res.status(200).json(find);
            }
        } else {
            res.status(404).json({ message: "Contact non trouvée avec l'id : " + id });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const deleteContact = async (req, res) => {
    try {
        let id = req.params.id;
        let findContact = await db.contacts.findOne({ where: { id: id } });

        if (findContact) {
            let contactDeletd = await db.contacts.destroy({ where: { id: id } });
            if (contactDeletd === 1) {
                res.status(200).json(findContact);
            }
        } else {
            res.status(404).json({ message: "Contact non trouvée avec l'id : " + id });
        }

    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

module.exports = {
    getAllContacts,
    createContact,
    getOneContact,
    contactUpdated,
    deleteContact
}

