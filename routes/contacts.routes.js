const router = require("express").Router();
const contactController = require("../controllers/contactController");

router.get("/", contactController.getAllContacts);
router.post("/", contactController.createContact);

router.get("/:id", contactController.getOneContact);
router.put("/:id", contactController.contactUpdated);
router.delete("/:id", contactController.deleteContact);

module.exports = router;