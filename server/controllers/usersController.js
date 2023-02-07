//userModel.js
const mongoose = require('mongoose');
const User = require("../model/userModel")
const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;

//module. is mean export just 1 function
module.exports.register = async (req,res,next) =>{
  try
  {
    const{username,password,email} = req.body;
    const usernameCheck = await User.findOne({username});
    if(usernameCheck)
        return res.json({msg:"Username already used", status:false})
    const emailCheck = await User.findOne({email});
    if (emailCheck)
        return res.json({msg:"Email already used",status:false});
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        username,
        password: hashedPassword,
        email
    });
    //* delete password because we sent hashedPassword and we don't want to save sensitive data in front
    delete user.password;
    return res.json({status:true,user})
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
    return res.json({msg:"Incorrect username or password",status:false});
  const isPasswordValid = await bcrypt.compare(password,user.password)
  if(!isPasswordValid)
    return res.json({msg:"Incorrect username or password",status:false});

  //* delete password because we sent hashedPassword and we don't want to save sensitive data in front
  delete user.password;
  return res.json({status:true,user})
}catch(ex){
  // ! HELP!
  next(ex);
}
  };

module.exports.getAllUsers = async (req,res,next) =>{

  
  try{
    //! find? ne? HELP
    const users = await User.find({_id:{$ne:req.params.id}}).select([
      "email","username","avatarImage","_id",
    ])
    return res.json(users);

  }
  catch(ex){}
}
  
 module.exports.getAllContacts = async(req,res,next) =>
 {
  try {
    const contacts = await User.find({_id:{$eq:req.params.id}}).select(["contacts"]);
    const contactsFirstDict = (contacts[0].contacts[0])
    const contactsList=[]
    for (const key in contactsFirstDict) {
      console.log(`key: ${key}, value: ${contactsFirstDict[key]}`);
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
 
  let ID =id.slice(1,-1)
  const objectId = new ObjectId(ID);
  let contact = await User.find({_id:{$eq:objectId}}).select([
    "email","username","avatarImage","_id",
  ])
  let newContact =
  {
    _id:contact[0]._id,
    username:contact[0].username,
    email:contact[0].email,
    avatarImage:contact[0].avatarImage,
    Notification:bool,
  } 
  return newContact
}
 


module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};