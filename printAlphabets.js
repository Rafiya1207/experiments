function getAlphabet(n) {
  const alphabets = 'abcdefghijklmnopqrstuvwxyz';

  return alphabets[n - 1];
}

const n = parseInt(prompt('enter number'));

console.log(getAlphabet(n));
