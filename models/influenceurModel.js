module.exports = (sequelize, DataTypes) => {
    const Influenceur = sequelize.define("influenceur", {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        postnom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pseudo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        textDetaillle: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        detail: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    return Influenceur;
}