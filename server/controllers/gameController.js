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
      board: [{data:[2,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0],eaten:0,outside:0},
      {data:[2,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0],eaten:0,outside:0}],
      dice:[{number:6,used:true},{number:5,used:true},{number:0,used:true},{number:0,used:true}],
      canDropDice:true,
      canFinish:false
    });
    if (data)
    {
      currentUser.status = process.env.STATUS_INGAME
      currentUser.gameId = data.id.toString()
      await currentUser.save();
      return res.json({roomId:`${data.id.toString()}`,gameCreateSuccessfully:true});
    }
    else return res.json({ gameCreateSuccessfully: false,msg:"Error while creating the game room"});
  } catch (ex) {
    next(ex);
  }
};


module.exports.updateGame = async (req, res, next) => {
  try {
    const { roomId, board,turn,dice,canDropDice,canFinish } = req.body;
    const update = { $set: { board } };
    if (turn !== undefined) {
      update.$set.turn = turn;
    }
    if (dice !== undefined) {
      update.$set.dice = dice;
    }
    if (canDropDice !== undefined) {
      update.$set.canDropDice = canDropDice;
    }
    if (canFinish !== undefined) {
      update.$set.canFinish = canFinish;
    }
    
    const updated = await Game.findByIdAndUpdate(roomId, update);
    if (updated) return res.json({ updateSuccessful: true, updated });
    else return res.json({ updateSuccessful: false });
  } catch (ex) {
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
    
