const ALPHABETS = 'abcdefghijklmnopqrstuvwxyz';
const REVERSED_ALPHABETS = ALPHABETS.split('').reverse();

function getAlphabet(n, alphabets) {
  return alphabets[n];
}

function getAlphabetPosition(alphabet, alphabets) {
  return alphabets.indexOf(alphabet);
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

function encodeSentence(sentence, code, alphabets) {
  const words = sentence.split(' ');
  const encodedWords = [];
  
  for (let index = 0; index < words.length; index++) {
    const word = words[index];
    encodedWords.push(encodeWord(word, code, alphabets));
  }

  return encodedWords.join(' ');
}

const sentence = prompt('enter sentence: ');
const code = parseInt(prompt('enter code: '));
const typeOfCode = parseInt(prompt('encode(0)/decode(1): '));

let alphabets = ALPHABETS;

if (typeOfCode === 1) {
  alphabets = REVERSED_ALPHABETS;
}

console.log(encodeSentence(sentence, code, alphabets));
