const router = require("express").Router();
const articleController = require("../controllers/articleController");
const upload = require("../middleware/uploadImage");

router.get("/", articleController.getAllArticles);
router.post("/", upload, articleController.createArticle);

router.get("/:id", articleController.getOneArticle);
router.put("/:id", upload, articleController.articleUpdated);
router.delete("/:id", articleController.deleteArticle);

module.exports = router;