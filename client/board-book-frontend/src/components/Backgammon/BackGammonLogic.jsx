const dropDice = (board,player)=>{
let Dice = GetDice()
let BoolCanFinish = canPlay(board,Dice,player)
return(Dice,BoolCanFinish)
}

//#region Dice
const isAvailableDice =(dice)=>{
    if (dice.number!==0&&dice.used===false)
    {
        return true
    }
    return false
}

//#endregion Dice

//#region Board
const enemyPlayer =(player)=>{
    if(player===1)
        return 0
    else
        return 1
}
const hasEnemyPieces = (board,player,dice,pieceIndex=-1) =>{
    if(isAvailableDice(dice))
    {
        pieceIndex += dice.number
        if(pieceIndex<=23)
        {
            pieceIndex = 23 - pieceIndex
            if(board[enemyPlayer(player)].data[pieceIndex]>1)
            {
                return true
            }
        }   
    }
    return false
}
const hasPiece = (board,player,index)=>{
    if(board[player].data[index])
        return true
    else
        return false
}
//#endregion Board

const canPlay = (board,dice,player) =>{

    if(board[player].eaten>0)
    {
        if(canReturnEatenPiece(board,dice,player))
        {
            return true
        }
        else
        {
            return false
        }
    }
    else
    {
        if(allPiecesInHome(board,player))
        {
            if(canMoveInHome(board,dice,player)||canTakeOutPiece(board,dice,player))
            {
               return true 
            }
            else
            {
                return false
            }
        }
        else
        {
            if(canMoveAnyPiece(board,dice,player))
            {
                return true
            }
            else
            {
                return false
            }
        }
    }
}

const canReturnEatenPiece = (board,dice,player)=>{

        for (let i = 0;i<4;i++)
        {
             if(!hasEnemyPieces(board,player,dice[i]))
                return true          
        }   
        return false
}

const allPiecesInHome = (board,player)=>{

        let counter = 0
        for (let i=18;i<24;i++)
        {
            counter+=board[player].data[i]
        }
        counter+=board[player].outside

        if(counter===24)
            return true
        else
            return false

}
const canMoveInHome = (board,dice,player)=>{

        for (let i = 0;i<4;i++)
        {
            for (let j = 18;j<23;j++)
            {
                if(hasPiece(board,player,j))
                {
                    if(!hasEnemyPieces(board,player,dice[i],j))
                    return true   
                }       
            }       
        }
        return false
}
const canTakeOutPiece = (board,dice,player)=>{
    for (let i = 0;i<4;i++)
    {
        if(hasPiece(board,player,24-dice[i].number)){
            return true
        }
        else
        {
            for(let j = dice[i].number; j <= 6;j++)
            {
                if(hasPiece(board,player,24-j)){
                    return false
            }
            }
            return true
        }
    }
}
const canMoveAnyPiece = (board,dice,player)=>{
    for (let i = 0;i<4;i++)
    {
        for (let j = 0;j<23;j++)
        {
            if(hasPiece(board,player,j))
            {
                if(!hasEnemyPieces(board,player,dice[i],j))
                return true  
            }         
        }       
    }
    return false

}
const GetDice = ()=>{
    let Dice=[{},{},{},{}]
        Dice[0] = {number:(Math.floor(Math.random() * 6)+1),used:false}
        Dice[1] = {number:(Math.floor(Math.random() * 6)+1),used:false}
        if(Dice[0].number===Dice[1].number)
        {
            Dice[2] = {number:Dice[0].number,used:false}
            Dice[3] = {number:Dice[0].number,used:false}
        }
        else
        {
            Dice[2] = {number:0,used:false}
            Dice[3] = {number:0,used:false}
        }
    return Dice
}
const GetBoard = ()=>{
    let Board = [{data:[2,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0],eaten:0,outside:0},{data:[2,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0],eaten:0,outside:0}]
    return Board
}  
//#region Actions
const Move = (board,player,indexStart,indexEnd)=>
{
    if(board[enemyPlayer(player)].data[23-indexEnd]===0)
    {
        board[player].data[indexStart]-=1
        board[player].data[indexEnd]+=1
    }   

    if(board[enemyPlayer(player)].data[23-indexEnd]===1)
    {
        board[player].data[indexStart]-=1
        board[player].data[indexEnd]+=1
        board[enemyPlayer(player)].data[23-indexEnd]=0
        board[enemyPlayer(player)].eaten+=1
    }
}










//#endregion Actions
export  {dropDice,Move,GetBoard}