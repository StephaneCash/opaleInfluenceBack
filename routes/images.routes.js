const router = require("express").Router();
const imageController = require("../controllers/imageController");

router.get("/", imageController.getAllImages);
router.post("/", imageController.createImage);

router.get("/:id", imageController.getOneImage);
router.put("/:id", imageController.ImageUpdated);
router.delete("/:id", imageController.deleteImage);

module.exports = router;