function getRow(columns, char = '*') {
	if (columns < 0) {
		columns = 0
	}
	return char.repeat(columns);
}

function triangle(size, char) {
	const pattern = [];

	for (let row = 1; row <= (size) / 2; row++) {
		const spaceCount = size - (row + row);
		const spaces = getRow(spaceCount, ' ');
		const stars = getRow(row - 2, char);
    
		pattern.push(spaces + stars + getRow(size - (spaceCount + row), ' ') + getRow(row + 2, ' ') + stars);
	}
	return pattern.join('\n');
}
