const router = require("express").Router();
const userController = require("../controllers/userController");
const upload = require('../middleware/uploadImage')

router.get("/", userController.getAllUsers);
router.post("/", upload, userController.createUser);
router.post("/authentification", upload, userController.loginUser);

router.get("/:id", userController.getOneUser);
router.put("/:id", upload, userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;