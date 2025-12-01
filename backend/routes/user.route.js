const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users.controller");
const { authen } = require("../middlewares/authentication.middleware");
const { authorize } = require("../middlewares/authorization.middleware");

router.get("/", authen, authorize(["admin"]), UserController.getAllUsers);
router.get("/:id", authen, UserController.getUserById);
router.put("/:id", authen, UserController.updateUser);
router.delete("/:id", authen, authorize(["admin"]), UserController.deleteUser);

module.exports = router;
