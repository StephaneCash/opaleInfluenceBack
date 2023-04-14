module.exports = (sequelize, DataTypes) => {
    const Categorie = sequelize.define("categorie", {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: { msg: "Le nom catégorie ne peut être vide." }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: { msg: "La description catégorie ne peut être vide." }
            }
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    return Categorie;
}