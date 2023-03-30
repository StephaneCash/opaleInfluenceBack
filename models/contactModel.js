module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define("contact", {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        numTel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pays: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mentionInsta: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    return Contact;
}