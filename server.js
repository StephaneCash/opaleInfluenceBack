const express = require('express');
const app = express();
require('dotenv').config({ path: './config/.env' });
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const influeceursRoutes = require("./routes/influenceurs.routes");
const caregoriesRoutes = require("./routes/categories.routes");
const imagesRoutes = require("./routes/images.routes");
const videosRoutes = require("./routes/videos.routes");
const articlesRoutes = require("./routes/articles.routes");
const userRoutes = require("./routes/users.routes");
const contactsRouter = require("./routes/contacts.routes");

app.use("/api/influenceurs", influeceursRoutes);
app.use("/api/categories", caregoriesRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactsRouter);

app.use("/api/uploads", express.static('./uploads'));

app.listen(process.env.PORT, () => {
    console.log("Le serveur tourne sur le port ", + process.env.PORT);
});
