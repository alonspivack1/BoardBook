//userController.js
const { register,login, getAllUsers,
    logOut, getAllContacts,getUserByToken,
    changeChat, getAllSearchUsers, addContact,
    deleteContact,gameIdToUser} = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register",register)
router.post("/login",login)
router.post("/changechat",changeChat)
router.post("/addcontact",addContact)
router.post("/deletecontact",deleteContact)
router.post("/gameidtouser",gameIdToUser)
router.get(`/allusers/:id`,getAllUsers)
router.get(`/searchusers/:value/:username`,getAllSearchUsers)
router.get(`/allcontacts/:id`,getAllContacts)
router.get(`/getuserbytoken/:token`,getUserByToken)
router.get(`/logout/:id`, logOut);

module.exports = router;