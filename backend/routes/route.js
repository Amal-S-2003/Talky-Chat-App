const express = require("express");
const userController=require('../controllers/userController')
const messageController=require('../controllers/messageController')
const groupController=require('../controllers/groupController')
const {protectRoute}=require('../middleware/protectRoute')
const router=express.Router()

router.post('/register',userController.register)
router.post('/login',userController.login)
router.post("/logout", userController.logout);
router.put('/edit-profile',protectRoute,userController.editProfile)
router.get("/check",protectRoute, userController.checkAuth);


router.get("/messages/users",protectRoute,messageController.getUserForSidebar)
router.get("/messages/:id",protectRoute,messageController.getMessages)
// router.post("/messages/send/:id",protectRoute,messageController.sendMessage)


router.post('/messages/:userId', protectRoute, messageController.sendMessage);
router.post('/group/:groupId', protectRoute, messageController.sendMessage);


router.get("/group/:id", protectRoute,groupController. getGroupMessages);
router.get("/get-groups", protectRoute,groupController. getGroups);
router.post("/create-group", protectRoute,groupController. createGroup);
router.put("/edit-group/:groupId", protectRoute,groupController. editGroup);
router.delete("/edit-group/:groupId", protectRoute,groupController. deleteGroup);
router.put("/edit-group/:groupId/add", protectRoute,groupController. addMember);
router.put("/edit-group/:groupId/remove", protectRoute,groupController. removeMember);

module.exports=router;  
  


