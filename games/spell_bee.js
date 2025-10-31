const prompt = require('./node_modules/prompt-sync')({sigint: true});

const ANAGRAM_GROUPS = [
	[['A', 'D', 'E', 'L', 'S'], ['DEALS', 'LEADS', 'SLADE']],
	[['A', 'E', 'R', 'S', 'T'], ['STARE', 'RATES', 'TEARS']],
	[['R', 'T', 'E', 'H', 'A'], ['EARTH', 'HEART']],
	[['A', 'P', 'E', 'R', 'S'], ['SPARE', 'PARSE']],
];

function isItem(items, item) {
	for (let index = 0; index < items.length; index++) {
		const currentItem = items[index];

		if (currentItem === item) {
			return true;
		}
	}
	return false;
}

function random(range) {
	return Math.floor(Math.random() * range);
}

function getWord() {
	return prompt('Enter a word: ');
}

function displayInstructions() {
	console.log('Guess words(5 letter) from the letters given');
}

function displayLetters(groupIndex) {
	console.log(`letters: [${ANAGRAM_GROUPS[groupIndex][0]}]`);
}

function spellBee(correctWords, groupIndex) {
	displayLetters(groupIndex);
	
	const userWord = getWord();
	
	console.clear();
	if (isItem(ANAGRAM_GROUPS[groupIndex][1], userWord)) {
		correctWords.push(userWord);
	}

	if (ANAGRAM_GROUPS[groupIndex][1].length === correctWords.length) {
		console.log('🎉 You have guessed All correct 🎉');
		console.log(`words: ${correctWords}`);
		return;
	}
	
	const wordsLeft = ANAGRAM_GROUPS[groupIndex][1].length - correctWords.length;
	console.log('You got it right 🎉');
	console.log(`${wordsLeft} words left to guess`);
	
	spellBee(correctWords, groupIndex);
}

function main() {
	const correctWords = [];
	const groupIndex = random(ANAGRAM_GROUPS.length);

	console.clear();
	displayInstructions();
	spellBee(correctWords, groupIndex)
}

main();
