const Messages = require("../model/messageModel");
const User = require("../model/userModel")

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: { 
        $all: [from, to],
        $size: 2 
      } 
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    const user = await User.findById(to);
    if(user.currentChat!==from)
    {
      await User.updateOne({ _id: to }, { $set: { [`contacts.${from}`]: true } });
    }

    await user.save();
    

    if (data) return res.json({ sentSuccessfully:true});
    else return res.json({ sentSuccessfully: false});
  } catch (ex) {
    next(ex);
  }
};