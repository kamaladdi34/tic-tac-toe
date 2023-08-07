const gameBoard = (()=>{
    let board = new Array(3).fill('').map(()=> new Array(3).fill(''));
    const getBoard = ()=> board;
    const checkForWinner = (mark)=>{
        let won = false;
        won = checkForDiagonal(mark) || checkForVertical(mark) || checkForHorizontal(mark);
        return won;
    }
    const resetBoard = ()=>{
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = '';
            }
        }
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
        return {won:checkForWinner('X'), error:null};
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
        return {won:checkForWinner('O') , error:null};
    }
    return {placeX, placeO, getBoard, checkCoordinates,resetBoard};
})();
const displayManager = (()=>{
    const cells = document.querySelectorAll('[data-coordinates]');
    const newGameButton = document.querySelector('.new-game-btn');
    const info = document.querySelector('.info')
    const Xmark = document.querySelector('.X');
    const Omark = document.querySelector('.O');
    Xmark.addEventListener('click', event=>{
        Xmark.classList.add('chosen');
        Omark.classList.remove('chosen');
    })
    Omark.addEventListener('click', event=>{
        Omark.classList.add('chosen');
        Xmark.classList.remove('chosen');
    })
    const getChosenMark = ()=>{
        if(Xmark.classList.contains('chosen')){
            return 'X';
        }else{
            return 'O';
        }
    }
    const setInfo = (content)=>{
        info.textContent = content;
    }
    setInfo('Set settings and start a new game.');
    newGameButton.addEventListener('click',event=>{
        gameManager.newGame(getChosenMark(),false);
        resetCells();
    })
    let cellsBoard = new Array(3).fill('').map(()=> new Array(3).fill(''));
    cells.forEach(cell =>{
        let coordinates = cell.getAttribute('data-coordinates').split(',');
        cellsBoard[coordinates[0]][coordinates[1]] = cell;
        cell.addEventListener('click', event =>{
            gameManager.placeMark(coordinates[0], coordinates[1]);
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
    return {setCell, resetCells, setInfo}
})();
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
    const newGame = (player1Mark, vsComputer)=>{
        gameBoard.resetBoard();
        player1 = player(player1Mark,false);
        player2 = player(player1Mark == 'X'? 'O': 'X',vsComputer);
        currentGame = game(player1, player2);
        currentGame.startGame();
        console.log(player1, player2);
        if(player1.isPlayerTurn){
            displayManager.setInfo(`It's ${player1.mark == 'X'?'🥖':'🍩'}'s turn`);
        }else{
            displayManager.setInfo(`It's ${player1.mark == 'X'?'🍩':'🥖'}''s turn`);
        }
    }
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
        if(!result.error && !result.won){
            currentGame.passTurn();
            if(player1.isPlayerTurn){
                displayManager.setInfo(`It's ${player1.mark == 'X'?'🥖':'🍩'}'s turn`);
            }else{
                displayManager.setInfo(`It's ${player1.mark == 'X'?'🍩':'🥖'}''s turn`);
            }
        }else if(result.error){
            console.log(result.error);
        }
    }
    return {newGame, placeMark}
})();