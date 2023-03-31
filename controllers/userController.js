
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const primaryKey = require('../auth/privateKey');
const { ValidationError, UniqueConstraintError, ValidationErrorItem } = require('sequelize');

const getAllUsers = (req, res) => {
    db.users.findAll({
        attributes: ['pseudo', 'email', 'role', 'createdAt', 'updatedAt', "id", 'isActive']
    })
        .then(resp => {
            let taille = resp.length;
            const message = "La liste des utilisateurs a été bien trouvée.";
            res.status(200).json(resp);
        })
        .catch(err => {
            return res.status(500).json('Erreurs: ' + err);
        });
};

const createUser = async (req, res) => {
    const { pseudo, email, role, } = req.body;

    try {
        if (req.body.password) {
            let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            const password = await bcrypt.hash(req.body.password, 10);

            if (pattern.test(email)) {
                db.users.findOne({
                    where: { email: email }
                }).then(user => {
                    if (user) {
                        return res.status(404).json({ message: `L'adresse email existe déjà, veuillez entrer une autre` });
                    } else {
                        let dataUser = {};

                        dataUser.pseudo = pseudo;
                        dataUser.email = email;
                        dataUser.password = password;
                        dataUser.role = role;

                        db.users.create(dataUser).then(value => {
                            let message = `Utilisateur créé avec succès`;
                            res.status(201).json({ message: message, data: value });
                        }).catch(err => {
                            if (err instanceof ValidationError) {
                                return res.status(400).json({
                                    message: err.message.split(",\n")
                                });
                            };

                            if (err instanceof UniqueConstraintError) {
                                return res.status(400).json({
                                    message: err.message
                                });
                            };
                        });
                    };
                }).catch(err => {
                    return res.status(500).json({ message: `Erreur du serveur  ${err}` });
                });
            } else {
                return res.status(400).json({ message: `Adresse email non valide` });
            }
        } else {
            return res.status(400).json({ message: "Mot de passe vide, veuillez le fournir" })
        }
    }
    catch (err) {
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
            console.log(err)
            return res.status(500).json({ message: err });

        }
    }
};

const loginUser = (req, res) => {
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (req.body.email) {
        if (req.body.email.match(pattern)) {
            db.users.findOne({
                where: { email: req.body.email }
            })
                .then((user => {
                    if (!user) {
                        const message = 'L\'utilisateur demandé n\'existe pas';
                        return res.status(404).json({ message })
                    }
                    bcrypt.compare(req.body.password, user.password)
                        .then(isPasswordValid => {
                            if (!isPasswordValid) {
                                const message = 'Le mot de passe est incorrect';
                                return res.status(401).json({ message })
                            }

                            let id = user.id;

                            // Création du jéton pour chaque user avec jwt
                            const jeton = jwt.sign(
                                { id: user.id },
                                primaryKey,
                                { expiresIn: "5h" }
                            );

                            const message = `L'utilisateur a été connecté avec succès`;
                            res.json({ message, jeton, id, });

                        });
                }))
                .catch(err => {
                    const message = `L'utilisateur n'a pas pu être connecté`;
                    return res.status(401).json({ message, data: err })
                });
        } else {
            const message = "Adresse email non valide.";
            return res.status(400).json({ message });
        }
    } else {
        const message = "Adresse email vide.";
        return res.status(400).json({ message });
    }
}

const getOneUser = async (req, res) => {
    try {
        let id = req.params.id;
        let user = await db.users.findOne({ where: { id: id }, attributes: ['pseudo', 'email', 'role', 'createdAt', 'updatedAt', "id", "isActive"] });

        if (user === null) {
            return res.status(404).json({ message: 'Aucun utilisateur n\'a été trouvé' });
        }
        res.status(200).json({ message: 'L\'utilisateur ' + id + ' a été trouvé avec succès', data: user });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updateUser = (req, res) => {
    const { pseudo, email, role, password, isActive } = req.body;
    let id = req.params.id;
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    db.users.findOne({ where: { id: id } })
        .then(response => {
            if (response) {
                if (email.match(pattern)) {
                    db.users.update({ pseudo, email, role, password, isActive }, { where: { id: id } })
                        .then(async resp => {
                            let getUserUpdated = await db.users.findOne({ where: { id: id }, attributes: ['pseudo', 'email', 'role', 'createdAt', 'updatedAt', "id", "isActive"] })
                            res.status(200).json({ message: 'L\'utilisateur ' + id + ' a été modifié avec succès', data: getUserUpdated });
                        })
                        .catch(err => {
                            return res.status(500).json({ message: `L'utilisateur n'a pas été modifié`, err });
                        });
                } else {
                    return res.status(400).json({ message: `Adresse email non valide.` });
                }
            } else {
                return res.status(404).json({ message: `L'utilisateur à modifier n'existe avec l'id ${id}` });
            }
        })
        .catch(err => {
            return res.status(400).json({ message: `L'utilisateur n'existe pas avec l'id : ${id}`, err: err });
        });
};

const deleteUser = (req, res) => {
    let id = req.params.id;
    db.users.findOne({ where: { id: id } })
        .then(resp => {
            if (resp) {
                db.users.destroy({ where: { id: id } })
                    .then(response => {
                        res.status(200).json({ message: 'L\'utilisateur ' + id + ' a été supprimé avec succès', data: resp });
                    })
            } else {
                res.status(404).json({ message: `L'utilisateur à supprimé n'existe pas` });
            }
        })
        .catch(err => {
            res.status(404).json({ message: `L'utilisateur à supprimé n'existe pas`, err: err });
        });
};

module.exports = {
    createUser,
    getOneUser,
    loginUser,
    deleteUser,
    updateUser,
    getAllUsers
}
