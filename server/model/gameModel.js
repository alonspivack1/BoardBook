const mongoose = require("mongoose");

const GameSchema = mongoose.Schema(
  {
    users: Array,
    turn: {
      type: Boolean,
      required: true,
      default: true,
    },
    score:{
        type:Number,
        required:true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GameRoom", GameSchema);