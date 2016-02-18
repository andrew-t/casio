var digits,
	next,
	ticker,
	score,
	attempts,
	faller = null;

document.addEventListener('DOMContentLoaded', function () {
	init();
	document.body.addEventListener('keydown', function(e) {
		switch(e.keyCode) {
			case 38: moveUp(); break;
			case 40: moveDown(); break;
			case 37: spinLeft(); break;
			case 39: spinRight(); break;
			default:
				console.log(e.keyCode);
				return;
		}
		draw();
		e.preventDefault();
	});
});

function init() {
	if (ticker)
		clearInterval(ticker);
	score = 0;
	attempts = 0;
	digits = [];
	for (var i = 0; i < 10; ++i)
		digits.push(new Digit());
	addNumber();
	pickNext();
	ticker = setInterval(tick, 500);
}

function tick() {
	if (faller !== null) {
		if (digits[faller - 1].isBlank()) {
			digits[faller - 1] = digits[faller];
			digits[faller] = new Digit();
			--faller;
		} else {
			// Collision!
			var fallingDigit = digits[faller];
			// The faller has landed. Destroy it.
			digits[faller] = new Digit();
			// Toggle all the bits that match the faller.
			fallingDigit.segments.forEach(function(on, i) {
				if (on)
					digits[faller - 1].segments[i] =
						!digits[faller - 1].segments[i];
			});
			// Have we cleared the digit?
			if (digits[faller - 1].isBlank()) {
				// Hooray! Do something?
				++score;
				attempts = 0;
				if (faller == 1)
					// We just destroyed the last digit, so add one now rather than waiting.
					addNumber();
			} else {
				// You only get (TODO) 5 goes at each digit.
				if (++attempts >= 5)
					addNumber();
			}
			faller = null;
		}
	} else if (digits[digits.length - 1].isBlank()) {
		faller = digits.length - 1;
		digits[faller] = next;
		pickNext();
	} else gameOver();
	draw();
}

// Currently, adds an 8 after your last existing digit.
function addNumber() {
	attempts = 0;
	for (var i = 0; i < 10; ++i)
		if (digits[i].isBlank()) {
			digits[i] = display.getDigit(Math.floor(
				Math.random() * 10).toString());
			draw();
			return;
		}
	gameOver();
}

function pickNext() {
	next = new Digit();
	var offset = (Math.random() < 0.5) ? 0 : 3,
		toLight = -~(Math.random() * 3);
	while (toLight) {
		var n = ~~(Math.random() * 4) + offset;
		if (!next.segments[n]) {
			next.segments[n] = true;
			--toLight;
		}
	}
}

function gameOver() {

}

function draw() {
	render(digits.concat([
		new Digit(),
		next]));
}

function moveUp() {
	var i, fallingDigit = digits[faller];
	if (!fallingDigit)
		return;
	for (i = 0; i < 3; ++i)
		if (fallingDigit.segments[i])
			return;
	for (i = 0; i < 4; ++i)
		fallingDigit.segments[i] = fallingDigit.segments[i + 3];
	for (i = 4; i < 7; ++i)
		fallingDigit.segments[i] = false;
}

function moveDown() {
	var i, fallingDigit = digits[faller];
	if (!fallingDigit)
		return;
	for (i = 4; i < 7; ++i)
		if (fallingDigit.segments[i])
			return;
	for (i = 6; i >= 3; --i)
		fallingDigit.segments[i] = fallingDigit.segments[i - 3];
	for (i = 0; i < 3; ++i)
		fallingDigit.segments[i] = false;
}

function spinLeft() {
	var offset = 0,
		fallingDigit = digits[faller];
	if (!fallingDigit)
		return;
	for (i = 4; i < 7; ++i)
		if (fallingDigit.segments[i]) {
			offset = 3;
			break;
		}
	var top = fallingDigit.segments[offset];
	fallingDigit.segments[offset] = fallingDigit.segments[offset + 2];
	fallingDigit.segments[offset + 2] = fallingDigit.segments[offset + 3];
	fallingDigit.segments[offset + 3] = fallingDigit.segments[offset + 1];
	fallingDigit.segments[offset + 1] = top;
}

function spinRight() {
	// CBA
	for (var i = 0; i < 3; ++i)
		spinLeft();
}