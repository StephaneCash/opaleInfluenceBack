const router = require("express").Router();
const influenceurController = require("../controllers/influenceurController");
const upload = require('../middleware/uploadImage')

router.get("/", influenceurController.getAllInfluenceurs);
router.post("/", upload, influenceurController.createInfluenceur);

router.get("/:id", influenceurController.getOneInfluenceur);
router.put("/:id", upload, influenceurController.updateInfluenceur);
router.delete("/:id", influenceurController.deleteInfluenceur);

module.exports = router;