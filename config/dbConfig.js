module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB_NAME,
    DIALECT: process.env.DIALECT,

    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 1000
    }
}