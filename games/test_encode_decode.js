const TESTS = [
  ["Hello World", 3, "0", "Khoor Zruog"],
  ["abc", 1, "0", "bcd"],
  ["xyz", 2, "0", "zab"],
  ["THE QUICK BROWN FOX", 5, "0", "YMJ VZNHR GWTBS KTC"],
  ["KeyIsZero", 0, "0", "KeyIsZero"],


  ["Khoor Zruog", 3, "1", "Hello World"],
  ["zab", 2, "1", "xyz"],
  ["r", 9, "1", "i"],
  ["KeyIsZero", 0, "1", "KeyIsZero"],


  ["123!@#$", 4, "0", "123!@#$"],
  ["mixed 123 symbols.", 7, "0", "tpehk 123 zftevmz."],
  ["", 5, "0", ""],
  [" ", 8, "1", " "]
]


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
  const words = sentence.toLowerCase().split(' ');
  const encodedWords = [];

  for (let index = 0; index < words.length; index++) {
    const word = words[index];
    encodedWords.push(encodeWord(word, code, alphabets));
  }

  return encodedWords.join(' ');
}

// const sentence = prompt('enter sentence: ');
// const code = parseInt(prompt('enter code: '));
// const typeOfCode = parseInt(prompt('encode(0)/decode(1): '));

function composeMessage(test, actual) {
  const symbol = (test[3] === actual) ? '✅' : '❌';
  const message = `${symbol} | 
    [${test[0]}, ${test[1]}] |
    ${test[2]} |
    expected: ${test[3]} |
    actual: ${actual}`;
    
  return message;
}

function testEncodeSentence(tests) {
  for (let test = 0; test < tests.length; test++) {
    let alphabets = ALPHABETS;

    if (test[2] === '1') {
      alphabets = REVERSED_ALPHABETS;
    }

    const actual = encodeSentence(tests[test][0], tests[test][1], alphabets);
    console.log(composeMessage(tests[test], actual));
  }
}

testEncodeSentence(TESTS);
// console.log(encodeSentence(sentence, code, alphabets));
