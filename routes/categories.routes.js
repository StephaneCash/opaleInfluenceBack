const router = require("express").Router();
const categorieController = require("../controllers/categorieController");

router.get("/", categorieController.getAllCategorie);
router.post("/", categorieController.createCategorie);

router.get("/:id", categorieController.getOneCategorie);
router.put("/:id", categorieController.CategorieUpdated);
router.delete("/:id", categorieController.deleteCategorie);

module.exports = router;