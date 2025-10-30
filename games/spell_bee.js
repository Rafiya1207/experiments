function isItem(items, item) {
	for (let index = 0; index < items.length; index++) {
		const currentItem = items[index];

		if (currentItem === item) {
			return true;
		}
	}
	return false;
}

function getWord() {
	return prompt('Enter word: ');
}
