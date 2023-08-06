const gameBoard = (()=>{
    let board = new Array(3).fill('').map(()=> new Array(3).fill(''));
    const getBoard = ()=> board;
    const checkForWinner = (mark)=>{
        let won = checkForDiagonal(mark) || checkForVertical(mark) || checkForHorizontal(mark);
        won? console.log(`${mark} has won`) : console.log(`No one won`);
        return won;
    }
    const checkForHorizontal = (mark)=>{
        let won = false;
        for (let i = 0; i < board.length; i++) {
            if(board[i][0] == mark && board[i][1] == mark && board[i][2] == mark){
                won =  true
            }
        }
        return won;
    }
    const checkForVertical = (mark)=>{
        let won = false;
        for (let i = 0; i < board.length; i++) {
            if(board[0][i] == mark && board[1][i] == mark && board[2][i] == mark){
                won =  true
            }
        }
        return won;
    }
    const checkForDiagonal = (mark)=>{
        let firstDiagonal = board[0][0] == mark && board[1][1] == mark && board[2][2] == mark;
        let secondDiagonal = board[2][0] == mark && board[1][1] == mark && board[0][2] == mark;
        return firstDiagonal || secondDiagonal;
    }
    const checkCoordinates = (x,y) =>  (x >= 0 && x <= 3 ) && (y >= 0 && y <= 3 );
    const placeX = (x,y)=>{
        if(!checkCoordinates(x,y)){
            console.log(`Wrong cell coordinates {${x},${y}}`);
            return;
        }
        board[x][y] = 'X';
        return checkForWinner('X');
    }
    const placeY = (x,y)=>{
        if(!checkCoordinates(x,y)){
            console.log(`Wrong cell coordinates {${x},${y}}`);
            return;
        }
        board[x][y] = 'Y';
        return checkForWinner('Y');
    }
    return {placeX, placeY, getBoard, checkCoordinates};
})();
const gameManager = (()=>{
    const player = (mark, isComputer) =>({mark, isPlayerTurn: false, score: 0, isComputer});
    const game = (player1, player2) =>{
        const gameStarted = false;
        const gameEnded = false;
        const gameOngoing = false;
        player1.isPlayerTurn = true;
        const passTurn = ()=>{
            player1.isPlayerTurn = !player1.isPlayerTurn;
            player2.isPlayerTurn = !player2.isPlayerTurn;
            console.log('Turn passed');
        }
        const getCurrentPlayer = ()=> player1.isPlayerTurn? player1 : player2; 
        const startGame = ()=> {
            gameStarted = true;
            gameOngoing = true;
        }
        const endGame = ()=> {
            gameStarted = true;
            gameOngoing = false;
        }
        const getGameStatus = ()=>{
            return {gameStarted, gameEnded}
        }
        return {passTurn, getCurrentPlayer, startGame, endGame}
    };
    let player1  = null;
    let player2  = null;
    let currentGame = null;
    const newGame = (player1Mark, vsComputer)=>{
        player1 = player(player1Mark,false);
        player2 = player(player1Mark == 'X'? 'Y': 'X',vsComputer);
        currentGame = game(player1, player2);
        currentGame.startGame();
        console.log(player1, player2);
    }
    const placeMark = (x,y)=>{
        if(!currentGame || !currentGame.getGameStatus().gameOngoing || !gameBoard.checkCoordinates(x,y)) return;
        let player = currentGame.getCurrentPlayer();
        let result = player.mark == 'X'? gameBoard.placeX(x,y) : gameBoard.placeY(x,y);
        currentGame.passTurn();
        console.log(player1);
        console.log(result? `${player.mark} won`:`game still going...`);
    }
    return {newGame, placeMark}
})();
gameManager.newGame('X',false);
gameManager.placeMark(2,3);
const displayManager = (()=>{
    const cells = document.querySelectorAll('[data-coordinates]');
    cells.forEach(cell =>{
        cell.addEventListener('click', event =>{
            console.log(cell.getAttribute('data-coordinates'));
        })
    })
})();