const router = require("express").Router();
const videoController = require("../controllers/videoController");

router.get("/", videoController.getAllVideos);
router.post("/", videoController.createVideo);

router.get("/:id", videoController.getOneVideo);
router.put("/:id", videoController.VideoUpdated);
router.delete("/:id", videoController.deleteVideo);

module.exports = router;