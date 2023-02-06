const Game = require("../model/gameModel");

module.exports.addGameRoom = async (req, res, next) => {
  try {
    const { users } = req.body;
    const data = await Game.create({
      users: users,
      score: 0,
    });
  


    if (data) return res.json({roomId:`${data.id.toString()}` ,sentSuccessfully:true});
    else return res.json({ sentSuccessfully: false});
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
    
