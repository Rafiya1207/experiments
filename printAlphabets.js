const ALPHABETS = 'abcdefghijklmnopqrstuvwxyz';

function getAlphabet(n) {
  return ALPHABETS[n - 1];
}

function getAlphabetPosition(alphabet) {
  return ALPHABETS.indexOf(alphabet) + 1;
}

function encodeWord(word, code) {
  let encodedWord = '';

  for (let index = 0; index < word.length; index++) {
    const charPosition = getAlphabetPosition(word[index]);
    const encodedPosition = (charPosition + code) % ALPHABETS.length;
    encodedWord += getAlphabet(encodedPosition);
  }

  return encodedWord;
}

const word = prompt('enter word');
const code = parseInt(prompt('enter code'));

console.log(encodeWord(word, code));
