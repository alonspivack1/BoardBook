const Game = require("../model/gameModel");
const User = require("../model/userModel")

module.exports.addGameRoom = async (req, res, next) => {
  try {
    const { users } = req.body;
    const currentUser = await User.findById(users[0]);
    const opponentUser  = await User.findById(users[1]);

    if(opponentUser.status===process.env.STATUS_OFFLINE)
    {return res.json({gameCreateSuccessfully:false,msg:"Cant start game with offline user"});}
    
    if(opponentUser.status===process.env.STATUS_INGAME)
    {return res.json({gameCreateSuccessfully:false,msg:"It is not possible to start a new game with a user who is currently playing"});}

    if(currentUser.status===process.env.STATUS_INGAME)
    {return res.json({gameCreateSuccessfully:false,msg:"You cannot start a new game until you have finished the existing game"});}

    const data = await Game.create({
      users: users,
      score: 0,
    });
    if (data)
    {
      currentUser.status = process.env.STATUS_INGAME
      await currentUser.save();
      return res.json({roomId:`${data.id.toString()}`,gameCreateSuccessfully:true});
    }
    else return res.json({ gameCreateSuccessfully: false,msg:"Error while creating the game room"});
  } catch (ex) {
    next(ex);
  }
};


module.exports.updateGame  = async (req, res, next) => {
  try {
    const { roomId, score,turn} = req.body;
    const updated = await Game.findByIdAndUpdate(roomId, {
    $inc: { score },
    $set:{turn}
    });
    if (updated) return res.json({ updateSuccessful: true, updated });
    else return res.json({ updateSuccessful: false });
      }
   catch (ex) {
    next(ex);
    }
  };
  module.exports.getGameRoom = async (req, res, next) => {
    try {
    const { roomId } = req.params;
    const room = await Game.findById(roomId);
    if (room) return res.json({ room });
    else return res.json({ error: 'Room not found' });
    } catch (ex) {
    next(ex);
    }
    };
    
