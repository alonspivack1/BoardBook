const { addGameRoom, updateGame,getGameRoom } = require("../controllers/gameController");
const router = require("express").Router();

router.post("/addgameroom/", addGameRoom);
router.post("/updategame/", updateGame);
router.get("/gameroom/:roomId", getGameRoom);


module.exports = router;