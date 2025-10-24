function sqr(n) {
	return n * n;
}

function drawCircle(r) {
	const diameter = r * 2;
	const circle = [];

	for (let x = 0; x <= diameter; x++) {
		let line = '';

		for (let y = 0; y <= diameter; y++) {
			const eq = Math.round(Math.sqrt(sqr(x - r) + sqr(y - r)));
			line += (eq === r) ? '0 ' : '  ';
		}
		circle.push(line);
	}
	console.log(circle.join('\n'));
}

drawCircle(20);
