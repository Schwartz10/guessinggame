function generateWinningNumber(){
  return Math.floor(Math.random()*100) + 1;
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num){
  if (isNaN(num) || num < 1 || num > 100){
    throw "That is an invalid guess."
  } else {
    this.playersGuess = num;
    if (this.pastGuesses.indexOf(num) > -1 && this.pastGuesses.length <= 5){
      return "You have already guessed that number."
    } else {
      this.pastGuesses.push(num);
    }
  }

  return this.checkGuess();
}

Game.prototype.checkGuess = function(){
  if (this.playersGuess === this.winningNumber){
    return "You Win!";
  } else if (this.pastGuesses.length >= 5){
    return "You Lose."
  } else if (this.difference() < 10){
    return "You\'re burning up!";
  } else if (this.difference() < 25){
    return 'You\'re lukewarm.';
  } else if (this.difference() < 50){
    return 'You\'re a bit chilly.';
  } else if (this.difference() < 100){
    return 'You\'re ice cold!';
  }
}

function newGame(){
  return new Game;
}

Game.prototype.provideHint = function(){
  var hintArray = [];
  hintArray.push(this.winningNumber);
  hintArray.push(generateWinningNumber());
  hintArray.push(generateWinningNumber());

  hintArray = shuffle(hintArray);

  return hintArray;
}

Game.prototype.higherOrLower = function(){
  if (this.playersGuess > this.winningNumber){
    return 'Guess Lower';
  } else if (this.playersGuess < this.winningNumber){
    return 'Guess Higher';
  }
}

Game.prototype.didWin = function(){
  if (this.winningNumber == this.playersGuess) {
    return true;
  } else {
    return false;
  }
}

$(document).ready(function(){

  var gameInstance = newGame();
  setTimeout(function(){ alert("best of luck"); }, 100);

  function checkNum(){
    var guessVal = $('#player-input').val();
    $('#player-input').val('');
    return [guessVal, gameInstance.playersGuessSubmission(parseInt(guessVal,10))];
  }

  function editHTML(num, headerText, subheaderText){
    $('#topheader').text(headerText);

    var guessNumLength = gameInstance.pastGuesses.length;
    if (gameInstance.didWin()){
      $('#submit').attr('disabled', true);
      $('#btn-hint').attr('disabled', true);
      $('#subheader').text("Wowzers!");
    } else if (guessNumLength < 5){
      $('#guess' + guessNumLength).text(num);
      $('#subheader').text(subheaderText);
    } else if (guessNumLength === 5) {
      $('#guess' + guessNumLength).text(num);
      $('#submit').attr('disabled', true);
      $('#btn-hint').attr('disabled', true);
      $('#subheader').text("Your lucky number was " + gameInstance.winningNumber + "... Click reset to play again");
    }
  }

  function changeHTML(){
    var resultsArray = checkNum();
    var guess = resultsArray[0];
    var resultText = resultsArray[1];
    var subheaderText = gameInstance.higherOrLower();
    editHTML(guess, resultText, subheaderText)
  }

  $('#submit').click(function(e){
    changeHTML();
  });

  $('#main').keyup(function(e){
    if (e.which == 13){
      changeHTML();
    }
  });

  function hints(){
    var hintArray = gameInstance.provideHint();
    return function(){
      alert("Your number is one of: " + hintArray[0] + ", " + hintArray[1] + ", or " + hintArray[2]);
    }
  }

  var createHints = hints();

  $('#btn-hint').click(function(){
    createHints();
  });

  $('#btn-reset').click(function(){
    location.reload();
  })
})
