const WORDS = ['code','word','test','case','data','file','loop','read','find','done'];
const ALPHABETS = 'abcdefghijklmnopqrstuvwxyz';

function randomNumber(start = 0, end) {
  return start + Math.floor(Math.random() * (end - start));
}

function encodeWord(word, code, alphabets) {
  let encodedWord = '';

  for (let index = 0; index < word.length; index++) {
    const charPosition = getAlphabetPosition(word[index], alphabets);
    const encodedPosition = (charPosition + code) % ALPHABETS.length;
    encodedWord += getAlphabet(encodedPosition, alphabets);
  }

  return encodedWord;
}

function displayInstructions(powers, chances) {
  console.log(`Decode the Encoded`);
  console.log(`⚡️${powers} powers`);
  console.log(`${chances} chances`);
  console.log(`chances will decrease if you make wrong guess`);
  console.log(`powers will decrease if you take clue`);
}

function askForGuess() {
  return prompt('Guess the decoded word: ');
}

function askForClue() {
  return confirm('Do you want clue?');
}

function isEven(number) {
  return number % 2 === 0;
}

function giveClue(key) {
  const clue = isEven(key) ? 'even' : 'odd';
  return `key is an ${clue} number`;
}

function main() {
  const actualWord = WORDS[randomNumber(WORDS.length)];
  const key = randomNumber(1, 10);
  const encodedWord = encodeWord(actualWord, key, ALPHABETS);
  let powers = 3;
  let chances = 5;

  displayInstructions(powers, chances);
  const wantClue = askForClue();
  
  if (wantClue) {
    giveClue(key);
    powers--;
  }
  const guessedWord = askForGuess();
  
  console.log(`${powers} powers left`);


}
