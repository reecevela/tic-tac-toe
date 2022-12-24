/**
 * TIC TAC TOE by Reece Vela
 * 
 * Overall information flow:
 * 
 * Game - Creates the game board and holds the state of the tiles, 
 *        it interacts with the DOM (view)
 * 
 * GameController - Handles the logic of whether inputs are valid,
 *                  checks wins, and tells the display message to
 *                  update. Also creates the player characters.
 * 
 * Player - Just a pair of name and symbol, called by the GameController
 * 
 * 
 * Public Functions:
    * Game.placeTile( playerLetter, index );
    * Game.createBoard();
    * Game.tilePositions();
    * 
    * GameController.init();
    * GameController.handleClick(clickTarget);
 * 
 * Public Variables:
    * NONE
 * 
 * 
 */


// Can call these all the way at the top because of function hoisting!
 GameController.init();
 Game.createBoard('game-board-root');


const Game = (function() {

  // called by tilePositions and placeTile
  let tiles = [
    0,0,0,
    0,0,0,
    0,0,0
  ];

  const createBoard = (rootID) => {
    const root = document.getElementById(rootID);
    for (let i = 0; i < tiles.length; i++) {
      const tile = document.createElement('button');
      tile.id = i;
      tile.classList = 'tile';
      tile.textContent = ' ';
      // do not add the () at the end of GameController.handleClick
      // or else it immediately invokes it
      tile.addEventListener('click', GameController.handleClick);
      root.append(tile);
    }
  }

  // called by GameController's checkWin method
  const tilePositions = () => {
    console.log( tiles[0], tiles[1], tiles[2] );
    console.log( tiles[3], tiles[4], tiles[5] );
    console.log( tiles[6], tiles[7], tiles[8] );
    return tiles;
  }

  // called by the GameController's handeClick
  const placeTile = (playerLetter, index) => { 
    tiles[index] = playerLetter;
    const clickedTile = document.getElementById(index);
    if (clickedTile.textContent == " ") {
      clickedTile.textContent = playerLetter;
    }
  }

  // returns public functions to be called by other classes
  return {
    createBoard,
    placeTile,
    tilePositions
  }
})();


const GameController = (function() {
  
  let players = [];
  let winner = '';
  let turn = 0; // index in the players array of the current player
  
  const init = () => {
    // Determine player names and starting letters
    const numPlayers = prompt("Please enter the number of players: ", 2);
    let playersAdded = 0;
    while (playersAdded < numPlayers) {
      createPlayer();
      playersAdded++;
    }
    // randomize who is going first
    turn = randInt(numPlayers - 1);
    updateMessage('turn');
    
    function randInt(highest = 1) {
      return Math.round(Math.random() * highest);
    }
  }
  
  // PRIVATE FUNCTION called by init
  const createPlayer = () => {
    // Set player name
    const name = prompt("Enter your name: ");
    // set player letter
    const letter = prompt('Enter your letter', name[0]); // name[0] is the first letter of their input
    // Add them as an object into the players[] array
    players.push(Player(name, letter));
  }

  // called by event handlers on the buttons themselves
  const handleClick = (clickTarget) => {
    const clickedTile = document.getElementById(clickTarget.srcElement.id);
    const name = players[turn].name;
    const letter = players[turn].letter
    Game.placeTile(letter, clickedTile.getAttribute("id"));
    // change turn
    changeTurn();
    updateMessage('turn');
    checkWin(name);
  }

  // PRIVATE FUNCTION - use after internal events
  const updateMessage = (lastEvent) => {
    const message = document.getElementById('message');
    // turn, win
    switch (lastEvent) {
      case 'turn':
        message.textContent = `${players[turn].name}'s turn`
        break;
      case 'win':
        message.textContent = `${winner} has won!`
        break;
      case 'tie':
        message.textContent = `It's a tie!`;
        break;
    }
  }

  // PRIVATE FUNCTION called after a tile placement
  const checkWin = (name) => {
    const tiles = Game.tilePositions(); // returns tiles
    // IF the board is full and there is no winner
    if (tiles.find((element) => element != " ") == -1) {
      updateMessage('tie');
    } else if (
      // logic for a win
      checkSet(0, 1, 2) || // this shortcircuits at any point in here
      checkSet(3, 4, 5) || // unless there's actually a winner
      checkSet(6, 7, 8) ||
      checkSet(0, 3, 6) ||
      checkSet(1, 4, 7) ||
      checkSet(2, 5, 8) ||
      checkSet(0, 4, 8) ||
      checkSet(2, 4, 6) 
    ) { // end check for a real winner
      winner = name;
      updateMessage('win');
    }

    function checkSet(a, b, c) {
      // escape early if checking an empty set
      if (a == " ") {return false};
      // if the three given tiles match return true
      if (tiles[a] == tiles[b] && tiles[b] == tiles[c]) { // also short-circuits
        return true;
      }
      return false;
    }
  }

  // PRIVATE
  const changeTurn = () => {
    turn++;
    if (turn == players.length) {
      turn = 0;
    }
  }

  // only two of those functions are public
  return {
    handleClick,
    init
  }
})();

// created and inserted into the GameController's
// players array during the GameController.init phase
const Player = (name, letter) => {
  return {name, letter};
}