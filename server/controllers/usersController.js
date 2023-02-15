//userModel.js
const mongoose = require('mongoose');
const User = require("../model/userModel")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;

//! WHAT IS catch(ex){next(ex)}


//module. is mean export just 1 function
module.exports.register = async (req,res,next) =>{
  try
  {
    const{username,password,email,AvatarImage} = req.body;
    const usernameCheck = await User.findOne({username});
    if(usernameCheck)
        return res.json({msg:"Username already used", status:false})
    const emailCheck = await User.findOne({email});
    if (emailCheck)
        return res.json({msg:"Email already used",status:false});
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        username:username,
        password: hashedPassword,
        email:email,
        avatarImage:(AvatarImage-1)
    });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return res.json({status:true,token})
  }catch(ex){
    // ! HELP!
    next(ex);
  }
    };
 
module.exports.login = async (req,res,next) =>{
try
{
  const{username,password} = req.body;
  const user = await User.findOne({username});
  if (!user)
  {return res.json({msg:"Incorrect username or password",status:false});}  const isPasswordValid = await bcrypt.compare(password,user.password)
  if(!isPasswordValid)
  {return res.json({msg:"Incorrect username or password",status:false});}
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);



  return res.json({status:true,token})
}catch(ex){
  // ! HELP!
  next(ex);
}
  };

module.exports.getAllUsers = async (req,res,next) =>{  
  try{
    //! find? ne? HELP
    const users = await User.find({_id:{$ne:req.params.id}}).select([
      "username","avatarImage","_id",
    ])
    return res.json(users);

  }
  catch(ex){}
}
  
 module.exports.getAllContacts = async(req,res,next) =>
 {
  try {
    const contacts = await User.find({_id:{$eq:req.params.id}}).select(["contacts"]);
    const contactsFirstDict = (contacts[0].contacts)
    const contactsList=[]
    for (const key in contactsFirstDict) {
      let tempContact = await GetContactData(key,contactsFirstDict[key])
      contactsList.push(tempContact);
    }
    return res.json(contactsList);
  } catch (ex) {
    return res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};
const GetContactData = async (id,bool)=>
{

  try{

  let ID =id

  const objectId = new ObjectId(ID);

  let contact = await User.find({_id:{$eq:objectId}}).select([
    "username","avatarImage","_id","status"
  ])

  let newContact =
  {
    _id:contact[0]._id,
    username:contact[0].username,
    avatarImage:contact[0].avatarImage,
    status:contact[0].status,
    Notification:bool,
  } 
  return newContact
}
catch(ex){}
}

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.token) return res.json({ msg: "token is required " });
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUserByToken =async (req,res,next)=>
{
  try{
    const id = verifyUser(req.params.token)
    if(!id)
    return res.json(undefined)
    const objectId = new ObjectId(id);
    const user = await User.find({_id:{$eq:objectId}}).select([
      "username","avatarImage","_id","status"
    ])
    return res.json(user);
  }
  catch(ex){}
}
const verifyUser =(userToken)=>
{
  try{
  const token = userToken
  const decoded = jwt.verify(token.slice(1,-1), process.env.JWT_SECRET);  
  if(!decoded)
  {
    const userId = undefined
    return userId}
    const userId = decoded._id  
    return userId
}
catch(ex){}
}

module.exports.changeChat  = async (req, res, next) => {
  try {
    const { UserId, ContactID} = req.body;
    const user = await User.findById(UserId);
    await User.updateOne({ _id: UserId }, { $set: { [`contacts.${ContactID}`]: false } });
    user.currentChat = ContactID;

    const updated = await user.save();
    res.status(200).json({ message: "Notification changed successfully", updated });
  } catch (error) {
    res.status(400).json({ message: "Error updating notification", error });
  }
  };

  module.exports.changeStatus = async (id,status,returnContactsList,deleteGameID=false) =>  
  {
  try{
      const user = await User.findById(id);
      if((user.status===process.env.STATUS_INGAME)&&(status===process.env.STATUS_ONLINE))
      {
        if(user.gameId!="")
        return undefined
      }

      if (status===process.env.STATUS_ONLINE===user.status)
      {user.currentChat = "";}
      user.status = status;
      if(deleteGameID===true)
      {user.gameId=""}
      await user.save();     
      if(returnContactsList===true)
      {
        const contacts = user.contacts
        const contactsList=[]
        for (const key in contacts)
        {contactsList.push(key);}
        return contactsList
      }
      else
      {
        return undefined
      }
  
  }
  catch(ex){}
  }

  module.exports.getAllSearchUsers = async(req,res,next) =>
  {
   try {
    const userContacts = await User.find({username:{$eq:req.params.username}}).select(["contacts"]);
    const contactsData = (userContacts[0].contacts)
    const contactsList=[]
    for (const key in contactsData)
    {
       contactsList.push(key);
    }
     const contacts = await User.find({username:{$regex: new RegExp(`${req.params.value}`, "i"),$ne: req.params.username
    },_id: { $nin: contactsList}}).select(["_id","username","avatarImage","status"]);
     return res.json(contacts);
   } catch (ex) {
     return res.status(500).json({
       success: false,
       error: "Server Error"
     });
   }
 };
 
 module.exports.addContact = async(req,res,next) =>
 {
  try{
    const { firstID, secondID} = req.body;
    await User.updateOne({ _id: firstID }, { $set: { [`contacts.${secondID}`]: false } });
    await User.updateOne({ _id: secondID }, { $set: { [`contacts.${firstID}`]: false } });

    return res.status(200).json({ success: true});
  }
  catch(ex){
    return res.json({
      success: false});
  }
 }
 module.exports.deleteContact = async(req, res, next) => {
  try {
    const { firstID, secondID } = req.body;

    await User.updateOne({ _id: firstID }, { $unset: { [`contacts.${secondID}`]: 1 } });
    await User.updateOne({ _id: secondID }, { $unset: { [`contacts.${firstID}`]: 1 } });

    return res.status(200).json({ success: true });
  } catch (ex) {
    console.error(ex);
    return res.json({
      success: false
    });
  }
};
 