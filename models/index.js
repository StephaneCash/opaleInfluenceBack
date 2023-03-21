const dbConfig = require('../config/dbConfig');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.DIALECT,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        }
    }
);
sequelize.authenticate()
    .then(() => {
        console.log("Connexion à la base de données a été effectuée avec succès");
    })
    .catch(err => {
        console.log(err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel")(sequelize, DataTypes);
db.categories = require("./categorieModel")(sequelize, DataTypes);
db.articles = require("./articleModel")(sequelize, DataTypes);
db.images = require("./imageModel")(sequelize, DataTypes);
db.videos = require("./videoModel")(sequelize, DataTypes);
db.influenceurs = require("./influenceurModel")(sequelize, DataTypes);

// RELATION 1-N CATEGORIE-INFLUENCEUR
db.categories.hasMany(db.influenceurs, {
    as: 'influenceurs',
});

db.influenceurs.belongsTo(db.categories, {
    foreignKey: "categorieId",
    as: 'categorie'
});

// RELATION 1-N ARTICLES-IMAGES
db.articles.hasMany(db.images, {
    as: "images"
});

db.images.belongsTo(db.articles, {
    foreignKey: "articleId",
    as: "articles"
});

// RELATION 1-N INFLUENCEURS-IMAGES
db.influenceurs.hasMany(db.images, {
    as: "images",
});

db.images.belongsTo(db.influenceurs, {
    foreignKey: "influenceurId",
    as: "influenceurs",
});

// RELATION 1-N INFLUENCEURS-VIDEOS
db.influenceurs.hasMany(db.videos, {
    as: "videos",
});

db.videos.belongsTo(db.influenceurs, {
    foreignKey: "influenceurId",
    as: "influenceurs",
});

//RELATION 1-N ARTICLES-VIDEOS
db.articles.hasMany(db.videos, {
    as: "videos",
});

db.videos.belongsTo(db.articles, {
    foreignKey: "articleId",
    as: "articles"
});


db.sequelize.sync({ force: false })
    .then(() => {
        console.log("DB SYNCHRONISEE AVEC SUCCES",)
    })
    .catch(err => {
        console.log("ERREURS DE SYNCHRONISATION DE BD : ", err);
    });

module.exports = db;
