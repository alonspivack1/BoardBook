const dropDice = (board,player)=>{
let Dice = GetDice()
let BoolCanFinish = canPlay(board,Dice,player)
return {Dice: Dice, BoolCanFinish: !BoolCanFinish};
}

//#region Dice
const isAvailableDice =(dice)=>{
    if (dice.number!==0&&dice.used===false)
    {
        return true
    }
    return false
}

const updateDice =(dice,number)=>{
    for (let i = 0;i<4;i++)
    {
         if(dice[i].number===number&&dice[i].used===false)
         {
            dice[i].used=true
            break
         }        
    }   
    return dice
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
        else
        {
            return true
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

    console.log("board",board)
    console.log("player",player)
    console.log("0")

    if(board[player].eaten>0)
    {
        if(canReturnEatenPiece(board,dice,player))
        {
            console.log("1")
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
                console.log("2canMoveInHome ",canMoveInHome(board,dice,player))
                console.log("2canTakeOutPiece ",canTakeOutPiece(board,dice,player))

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
                console.log("3")
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

        if(board[player].eaten===0)
        {
            return false
        }

        for (let i = 0;i<4;i++)
        {
            if(isAvailableDice(dice[i]))
            {
                if(!hasEnemyPieces(board,player,dice[i]))
                return true  
            }
                     
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
            if(isAvailableDice(dice[i]))
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
                
        }
        return false
}
const canTakeOutPiece = (board,dice,player)=>{
    for (let i = 0;i<4;i++)
    {
        if(isAvailableDice(dice[i]))
        {
            if(hasPiece(board,player,24-dice[i])){
                return true
            }
            else
            {
                let DiceIsOk=true
                for(let j = 24-dice[i].number; j >= 18;j--)
                {
                    if(hasPiece(board,player,j)){
                        DiceIsOk=false
                }
                if(DiceIsOk)
                    return true
                }    
            }
        }
        }
    return false
}
const canTakeOutSpecificPiece = (board,index,player,dice)=>{
  
   
    for (let i = 0;i<4;i++)
    {
        if(isAvailableDice(dice[i]))
        {
            if(hasPiece(board,player,index)&&24-dice[i].number===index){
                return true
            }
            else
            {
                if(24-dice[i]<index)
                {
                    let DiceIsOk=true
                    for(let j = 24-dice[i].number; j < index;j++)
                    {
                        if(hasPiece(board,player,j)){
                            DiceIsOk=false
                    }
                    if(DiceIsOk)
                        return true
                    }
                }
            }
        }
        }
    return false
    
}
const canMoveAnyPiece = (board,dice,player)=>{
    for (let i = 0;i<4;i++)
    {
        if(isAvailableDice(dice[i]))
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
            
    }
    return false

}

const canMovePiece = (board,dice,player,index)=>{
    if(dice&&board[player].eaten===0)
    {
        
        for (let i = 0;i<4;i++)
        {

            if(isAvailableDice(dice[i]))
            {
                if(hasPiece(board,player,index))
                {
                    if(!hasEnemyPieces(board,player,dice[i],index))
                    return true  
                }     
            }
                   
                  
        }
    }

    return false

}
const canPlaceIndexes = (board,dice,player,index)=>{
    let indexes =[]
    if(dice)
    {
        for (let i = 0;i<4;i++)
        {

            if(isAvailableDice(dice[i]))
            {
                if(hasPiece(board,player,index)||index===-1)
                {
                    if(!hasEnemyPieces(board,player,dice[i],index))
                    {
                        if(player===0)
                        { indexes.push((index+dice[i].number))}
                        else{ indexes.push(23-(index+dice[i].number))}
                    }
                   
                }     
            } 
        }
    }
    return indexes
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
            Dice[2] = {number:0,used:true}
            Dice[3] = {number:0,used:true}
        }
    return Dice
}
const GetBoard = ()=>{
    let Board = [{data:[2,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0],eaten:0,outside:0},
                 {data:[2,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0],eaten:0,outside:0}]
    return Board
}  
//#region Actions
const Move = (board,player,indexStart,indexEnd)=>
{
    console.log("MOVE!")
    console.log("player",player)
    console.log("indexStart",indexStart)
    console.log("indexEnd",indexEnd)

    if(indexEnd===24)
    {
        board[player].data[indexStart]-=1
        board[player].outside+=1
    }
    else
    {
        if (indexStart!==-1)
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
        else{
            if(board[enemyPlayer(player)].data[23-indexEnd]===0)
            {
                board[player].eaten-=1
                board[player].data[indexEnd]+=1
            }   
        
            if(board[enemyPlayer(player)].data[23-indexEnd]===1)
            {
                board[player].eaten-=1
                board[player].data[indexEnd]+=1
                board[enemyPlayer(player)].data[23-indexEnd]=0
                board[enemyPlayer(player)].eaten+=1
            }
        }
    }
    
    return board

}


//#endregion Actions
export  {dropDice,Move,GetBoard,canMovePiece,canPlaceIndexes,updateDice,canPlay,canReturnEatenPiece,canTakeOutSpecificPiece,allPiecesInHome}