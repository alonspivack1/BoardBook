//userModel.js
const User = require("../model/userModel")
const bcrypt = require("bcrypt");

//#region register
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
  //#endregion register
 
 
 //#region Login
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
//#endregion login
