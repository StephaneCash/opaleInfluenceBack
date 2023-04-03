const router = require("express").Router();
const categorieController = require("../controllers/categorieController");
const upload = require('../middleware/uploadImage');

router.get("/", categorieController.getAllCategorie);
router.post("/", upload, categorieController.createCategorie);

router.get("/:id", categorieController.getOneCategorie);
router.put("/:id", upload, categorieController.categorieUpdated);
router.delete("/:id", categorieController.deleteCategorie);

module.exports = router;