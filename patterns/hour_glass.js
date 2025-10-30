function getRow(columns, char = '*') {
	if (columns < 0) {
		columns = 0
	}
	return char.repeat(columns);
}

function invertedPyramid(size) {
	const pattern = [];

	for (let row = 0; row <= size / 2; row++) {
		const spaces = getRow(row, ' ');
		const stars = getRow(size - (row + row));
    
		pattern.push(spaces + stars);
	}
	return pattern.join('\n');
}

function pyramid(size) {
	const pattern = [];

	for (let row = Math.floor(size / 2); row >= 0; row--) {
		const spaces = getRow(row, ' ');
		const stars = getRow(size - (row + row));
    
		pattern.push(spaces + stars)
	}
	return pattern.join('\n');
}

function hourGlass(size) {
	if (size % 2 === 0) {
		size = size - 1;
	}
	return invertedPyramid(size) + '\n' + pyramid(size);
}
