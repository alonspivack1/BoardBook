const mongoose = require("mongoose");

const GameSchema = mongoose.Schema(
  {
    users: Array,
    turn: {
      type: Boolean,
      required: true,
      default: true,
    },
    board:{
        type:Array,
        required:true,
    },
    dice:{
      type:Array,
      required:true,
  },
  undo:{
    type:Array,
    required:true,
},
  canDropDice:{
    type:Boolean,
    required:true,
  },
  canFinish:{
    type:Boolean,
    required:true,
  }
  },
  {
    timestamps: true,
  }
  
);

module.exports = mongoose.model("GameRoom", GameSchema);