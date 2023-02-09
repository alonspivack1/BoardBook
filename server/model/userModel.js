const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  avatarImage: {
    type: Number,
    default: 0,
  },
  contacts:
  {
    type:Object,
    default:{},
  },
  status:
  {
    type:String,
    default:"offline"
  },
  gameId:
  {
    type:String,
    default:""
  },
  score:
  {
    type:Number,
    default:0
  },
  currentChat:
  {
    type:String,
    default:""
  }
});

module.exports = mongoose.model("Users", userSchema);
