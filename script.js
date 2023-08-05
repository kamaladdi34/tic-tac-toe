const gameBoard = (()=>{
    let board = new Array(3).fill('').map(()=> new Array(3).fill(''));
    const logBoard = ()=>{
        console.log('_________________');
        console.log(board[0]);
        console.log(board[1]);
        console.log(board[2]);
        console.log('_________________');
    }
    const checkForWinner = (mark)=>{
        let won = checkForDiagonal(mark) || checkForVertical(mark) || checkForHorizontal(mark);
        won? console.log(`${mark} has won`) : console.log(`No one won`);
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
    const placeX = (x,y)=>{
        board[x][y] = 'X';
        logBoard();
        checkForWinner('X');
    }
    const placeY = (x,y)=>{
        board[x][y] = 'Y';
        logBoard();
        checkForWinner('Y');
    }
    return {placeX,placeY};
})();
gameBoard.placeX(1,0);
gameBoard.placeX(1,1);
gameBoard.placeX(2,2);
