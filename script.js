const gameContainer = document.getElementById("game");
///-added two more colors because 12 cards look better
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow"
];

let CUSTOM_DECK = [];

function getRandomRGB(){
	let r = Math.floor(Math.random() * 255);
	let g = Math.floor(Math.random() * 255);
	let b = Math.floor(Math.random() * 255);	
	return `rgb(${r},${g},${b})`;
}

function buildDeck(pairs){
	let deck = [];
	for(let count = 0; count < pairs; count++){
		let randomRGB = getRandomRGB();
		deck.push(randomRGB);	
		deck.push(randomRGB);	
	}
	deck = shuffle(deck);
	return deck;
}
// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let lastSelected = false;
let clickBlocked = false;

///-for scoring
let totalAttempts = 0;
let possibleMatches = COLORS.length / 2;
let score = -1;

let shuffledColors = shuffle(COLORS);

let numberOfPairs = document.querySelector("#number-of-pairs");
numberOfPairs.value = 6;



function newGame(){
	lastSelected = false;
	clickBlocked = false;
	totalAttempts = 0;
	score = -1;
	let scoreBox = document.querySelector("#score-box");
	scoreBox.innerText = "";	
	gameContainer.innerHTML = "";
	
	//possibleMatches = COLORS.length / 2;
	//shuffledColors = shuffle(COLORS);
	
	let pairs = document.querySelector("#number-of-pairs").value;
	console.log(pairs);
	shuffledColors = buildDeck(pairs);
	possibleMatches = shuffledColors.length / 2;
	createDivsForColors(shuffledColors);	
	
}

function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement("div");

		// give it a class attribute for the value we are looping over
		//newDiv.classList.add(color);
		newDiv.style.backgroundColor = color;
		
		newDiv.setAttribute("bgColor",color);

		///-'cover' card 
		setCovered(newDiv,true);

		///-black border for unmatched card
		setMatched(newDiv,false);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener("click", handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
	flashAnswers();
}

function flashAnswers(){
	clickBlocked = true;
	let cards = document.querySelectorAll(".unmatched");
	for(let card of cards){
		setCovered(card,false);
	}
	setTimeout(function(){
		for(let card of cards){
			setCovered(card,true);
		}
		clickBlocked = false;
	},1000);
}

// TODO: Implement this function!
function handleCardClick(e) {
	// you can use event.target to see which element was clicked
	let selected = e.target;
	testMatch(selected);
}

function getColor(el){ ///-
	let color = window.getComputedStyle(el).backgroundColor;
	return color;
}

function checkGameOver(){
	///-query select all unmatched cards and get the length 
	///-of that list to determine if there are any left
	let totalUnmatched = document.querySelectorAll(".unmatched").length;
	if(totalUnmatched === 0){
		///-ALL matched - game over
		score = 100 * possibleMatches / totalAttempts; 
		score = Math.round(score);
		let scoreBox = document.querySelector("#score-box");
		scoreBox.innerText = `Completed after ${totalAttempts} attempts
		 for an accuracy of ${score}%
		 High Score: ${highScore()}%`;
	}
}

function highScore(){
	let lastHighScore = window.localStorage.getItem("high-score") || "NA";
	if(lastHighScore === "NA" || score > parseInt(lastHighScore)){
		window.localStorage.setItem("high-score",score);
	}
	return lastHighScore;
}

function getCurrentScore(){
	totalAttempts++;
	let scoreBox = document.querySelector("#score-box");
	scoreBox.innerText = `total attempts ${totalAttempts}`;
}

function testMatch(el){
	if(clickBlocked){
		return; ///-prevent user from selecting more than two
	}
	///-ignore clicks on already matched cards
	if(!el.classList.contains("matched")){
		///-uncover selected card
		setCovered(el,false);
		///-if a card is already selected
		if(lastSelected){
			///-ignore if same card
			if(lastSelected === el){
				return;
			}
			//totalAttempts++; //console.log(totalAttempts);
			getCurrentScore();
			///-check the next card for a match
			if( getColor(lastSelected) === getColor(el) ) { //console.log('color',getColor(el));
				///-is a match
				setMatched(el,true);
				setMatched(lastSelected,true);
				lastSelected = false;
			} else {
				///-is NOT a match
				clickBlocked = true;
				///-wait 2 seconds and cover both selections
				setTimeout(function(){
					setCovered(el,true);
					setCovered(lastSelected,true);
					lastSelected = false;
					clickBlocked = false;
				},1000);
			}
			///-reset lastselected to false for next pair
		} else {
			///-if no previous selection select first card
			lastSelected = el;
		}	
		checkGameOver();
	}
}

function setCovered(el, covered){ 
	if(covered){
		el.style.backgroundColor = "grey";
	} else {
		el.style.backgroundColor = el.getAttribute("bgColor");
	}
}

function setMatched(el, match){
	if(match){
		el.classList.remove("unmatched");
		el.classList.add("matched");
	} else {
		el.classList.remove("matched");
		el.classList.add("unmatched");		
	}
}

// when the DOM loads
newGame();

///-old code

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function x_createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
	
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
	
	///-'cover' card 
	setCovered(newDiv,true);
	
	///-black border for unmatched card
	setMatched(newDiv,false);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
  flashAnswers();
}

function x_getColor(el){ 
	///-return first class in list which will be color
	let color = el.classList.item(0);	
	return color;
}

function x_setCovered(el, covered){ ///-old version
	if(covered){
		el.classList.add("covered");
	} else {
		el.classList.remove("covered");	
	}
}


function x_newGame(){
	lastSelected = false;
	clickBlocked = false;
	totalAttempts = 0;
	possibleMatches = COLORS.length / 2;
	score = -1;
	shuffledColors = shuffle(COLORS);
	gameContainer.innerHTML = "";
	createDivsForColors(shuffledColors);
	let scoreBox = document.querySelector("#score-box");
	scoreBox.innerText = "";
}
