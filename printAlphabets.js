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

function encodeSentence(sentence, code) {
  const words = sentence.split(' ');
  const encodedWords = [];
  
  for (let index = 0; index < words.length; index++) {
    const word = words[index];
    encodedWords.push(encodeWord(word, code));
  }

  return encodedWords.join(' ');
}

const sentence = prompt('enter sentence: ');
const code = parseInt(prompt('enter code'));

console.log(encodeSentence(sentence, code));
