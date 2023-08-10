const gameBoard = (()=>{
    let board = new Array(3).fill('').map(()=> new Array(3).fill(''));
    const getBoard = ()=> board;
    const checkForWinner = (board,mark)=>{
        let won = false;
        won = checkForDiagonal(board,mark) || checkForVertical(board,mark) || checkForHorizontal(board,mark);
        return won;
    }
    const resetBoard = ()=>{
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = '';
            }
        }
    }
    const checkForHorizontal = (board,mark)=>{
        let won = false;
        for (let i = 0; i < board.length; i++) {
            if(board[i][0] == mark && board[i][1] == mark && board[i][2] == mark){
                won =  true
            }
        }
        return won;
    }
    const checkForVertical = (board,mark)=>{
        let won = false;
        for (let i = 0; i < board.length; i++) {
            if(board[0][i] == mark && board[1][i] == mark && board[2][i] == mark){
                won =  true
            }
        }
        return won;
    }
    const checkForDiagonal = (board,mark)=>{
        let firstDiagonal = board[0][0] == mark && board[1][1] == mark && board[2][2] == mark;
        let secondDiagonal = board[2][0] == mark && board[1][1] == mark && board[0][2] == mark;
        return firstDiagonal || secondDiagonal;
    }
    const checkCoordinates = (x,y) =>  (x >= 0 && x <= 3 ) && (y >= 0 && y <= 3 );
    const placeX = (x,y)=>{
        if(board[x][y] != ''){
            console.log(board[x][y]);
            return {won:false, error:`cell {${x},${y}} is not empty`};
        }
        if(!checkCoordinates(x,y)){
            return {won:false, error:`Wrong cell coordinates {${x},${y}}`};
        }
        board[x][y] = 'X';
        displayManager.setCell(x,y,'🥖');
        console.log(`X placed in {${x},${y}}`);
        return {won:checkForWinner(board,'X'), error:null};
    }
    const placeO = (x,y)=>{
        if(board[x][y] != ''){
            console.log(board[x][y]);
            return {won:false, error:`cell {${x},${y}} is not empty`};
        }
        if(!checkCoordinates(x,y)){
            return {won:false, error:`Wrong cell coordinates {${x},${y}}`};
        }
        board[x][y] = 'O';
        displayManager.setCell(x,y,'🍩');
        console.log(`O placed in {${x},${y}}`);
        return {won:checkForWinner(board,'O') , error:null};
    }
    const copyBoard = (board)=>{
        let newBoard = new Array(3);
        for (var i = 0; i < board.length; i++){
            newBoard[i] = board[i].slice();
        }
        return newBoard;
    }
    const checkForDraw= (board)=> board.every(row => row.every(cell => cell !== ''));

    const getOptimalComputerChoice = (board,mark)=>{
        let minimax = (currentMark, isPlayerTurn, depth)=>{
            // Check for terminal states and evaluate the leaf node
            if(checkForWinner(board,mark)){
                return 100 - depth;
            }else if(checkForWinner(board,mark == 'X' ? 'O' : 'X')){
                return -100 + depth;
            }
            if(checkForDraw(board)){
                return 0;
            }
            if (isPlayerTurn) {
                let bestScore = -Infinity;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] == '') {
                            board[i][j] = currentMark;
                            let result = minimax(currentMark == 'X' ? 'O' : 'X', false, depth++);
                            board[i][j] = '';
                            bestScore = Math.max(result, bestScore);
                        }
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] == '') {
                            board[i][j] = currentMark;
                            let result = minimax(currentMark == 'X' ? 'O' : 'X', true, depth++);
                            board[i][j] = '';
                            bestScore = Math.min(result, bestScore);
                        }
                    }
                }
                return bestScore;
            }
        }
        let bestMove;
        bestScore = -Infinity;
        let moves = []
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = mark;
                    let result = minimax(mark == 'X' ? 'O' : 'X', false,0);
                    board[i][j] = '';
                    // if (result > bestScore) {
                    //     bestScore = result;
                    //     bestMove = { x: i, y: j };
                    // }
                    moves.push({score: result, coords: {x:i,y:j}})
                }
            }
        }
        let sortedMoves = moves.sort(()=> Math.floor((Math.random()*3)) -1);
        for (let i = 0; i < sortedMoves.length; i++) {
            if ( sortedMoves[i].score > bestScore) {
                bestScore = sortedMoves[i].score;
                bestMove = sortedMoves[i].coords;
            }
        }
        return bestMove;
    }
    return {placeX, placeO, getBoard, checkCoordinates, resetBoard, getOptimalComputerChoice,checkForDraw};
})();
const displayManager = (()=>{
    const cells = document.querySelectorAll('[data-coordinates]');
    const newGameButton = document.querySelector('.new-game-btn');
    const info = document.querySelector('.info');
    const playerOneType = document.querySelector('.player.one');
    const playerTwoType = document.querySelector('.player.two');
    const markChoiceSelect = document.querySelector('#mark-select');
    const getChosenMark = ()=>{
        return markChoiceSelect.value;
    }
    const getPlayerOneType = ()=>{
        return playerOneType.value == 'human'? false: true;
    }
    const getPlayerTwoType = ()=>{
        return playerTwoType.value == 'human'? false: true;
    }
    const setInfo = (content)=>{
        info.textContent = content;
    }
    setInfo('Set settings and start a new game.');
    newGameButton.addEventListener('click',event=>{
        resetCells();
        gameManager.newGame(getChosenMark());
    })
    let cellsBoard = new Array(3).fill('').map(()=> new Array(3).fill(''));
    cells.forEach(cell =>{
        let coordinates = cell.getAttribute('data-coordinates').split(',');
        cellsBoard[coordinates[0]][coordinates[1]] = cell;
        cell.addEventListener('click', event =>{
            if(!gameManager.getCurrentGame().getCurrentPlayer().isComputer){
                gameManager.placeMark(coordinates[0], coordinates[1]);
            }
        })
    })
    const setCell = (x, y, mark)=>{
        console.log(`setting cell {${x},${y}} to ${mark}`);
        cellsBoard[x][y].textContent = mark;
    }
    const resetCells = ()=>{
        cells.forEach(cell=>{
            cell.textContent = '';
        })
    }
    return {setCell, resetCells, setInfo, getPlayerOneType, getPlayerTwoType}
})();
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const gameManager = (()=>{
    const player = (mark, isComputer) =>({mark, isPlayerTurn: false, score: 0, isComputer});
    const game = (player1, player2) =>{
        let gameStarted = false;
        let gameEnded = false;
        let gameOngoing = false;
        player1.isPlayerTurn = true;
        const passTurn = ()=>{
            player1.isPlayerTurn = !player1.isPlayerTurn;
            player2.isPlayerTurn = !player2.isPlayerTurn;
            console.log('Turn passed');
        }
        const getCurrentPlayer = ()=> player1.isPlayerTurn? player1 : player2; 
        const startGame = ()=> {
            console.log('game started');
            gameStarted = true;
            gameOngoing = true;
        }
        const endGame = ()=> {
            console.log('game ended');
            gameStarted = true;
            gameOngoing = false;
        }
        const getGameStatus = ()=>{
            return {gameStarted, gameEnded,gameOngoing}
        }
        return {passTurn, getCurrentPlayer, startGame, endGame, getGameStatus}
    };
    let player1  = null;
    let player2  = null;
    let currentGame = null;
    const newGame = (player1Mark)=>{
        gameBoard.resetBoard();
        player1 = player(player1Mark,displayManager.getPlayerOneType());
        player2 = player(player1Mark == 'X'? 'O': 'X',displayManager.getPlayerTwoType());
        currentGame = game(player1, player2);
        currentGame.startGame();
        console.log(player1, player2);
        if(player1.isPlayerTurn){
            displayManager.setInfo(`It's ${player1.mark == 'X'?'🥖':'🍩'}'s turn`);
        }else{
            displayManager.setInfo(`It's ${player1.mark == 'X'?'🍩':'🥖'}''s turn`);
        }
        if(currentGame.getCurrentPlayer().isComputer){
            let coordinates = gameBoard.getOptimalComputerChoice(gameBoard.getBoard(),currentGame.getCurrentPlayer().mark);
            placeMark(coordinates.x,coordinates.y);
        }
    }
    const getCurrentGame = ()=> currentGame;
    const placeMark = (x,y)=>{
        if(!currentGame){
            console.log('There is no game instance');
            return;
        }
        if(!currentGame.getGameStatus().gameOngoing){
            console.log('Game not started or ended');
            return;
        }
        if(!gameBoard.checkCoordinates(x,y)){
            console.log('Wrong coordinates');
            return;
        }
        let player = currentGame.getCurrentPlayer();
        let result = player.mark == 'X'? gameBoard.placeX(x,y) : gameBoard.placeO(x,y);
        if(result.won){
            console.log(player.mark + ' won');
            displayManager.setInfo(`${player.mark == 'X'?'🥖':'🍩'} won the game!`)
            currentGame.endGame();
        }
        if(gameBoard.checkForDraw(gameBoard.getBoard())){
            displayManager.setInfo(`It's a draw!`)
            currentGame.endGame();
        }
        if(!result.error && !result.won && currentGame.getGameStatus().gameOngoing){
            currentGame.passTurn();
            if(player1.isPlayerTurn){
                displayManager.setInfo(`It's ${player1.mark == 'X'?'🥖':'🍩'}'s turn`);
            }else{
                displayManager.setInfo(`It's ${player1.mark == 'X'?'🍩':'🥖'}''s turn`);
            }
            if(currentGame.getCurrentPlayer().isComputer){
                let coordinates = gameBoard.getOptimalComputerChoice(gameBoard.getBoard(),currentGame.getCurrentPlayer().mark);
                placeMark(coordinates.x,coordinates.y);
            }
        }else if(result.error){
            console.log(result.error);
        }
    }
    return {newGame, placeMark, getCurrentGame}
})();