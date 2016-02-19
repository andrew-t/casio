var digits,
	next,
	ticker,
	gameOn = false,
	gameIsOver = false,
	score,
	attempts,
	fastFalling,
	faller = null;

document.addEventListener('DOMContentLoaded', function () {
	show('0161tr15');
	document.body.addEventListener('keydown', function(e) {
		switch(e.keyCode) {
			case 32:
				if (gameOn)
					fastFalling = true;
				else if (gameIsOver) {
					gameIsOver = false;
					show(score);
				} else init();
				break;
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
	stopTick();
	gameOn = true;
	fastFalling = false;
	score = 0;
	attempts = 0;
	digits = [];
	for (var i = 0; i < 8; ++i)
		digits.push(new Digit());
	addNumber();
	pickNext();
	tick();
}

function stopTick() {
	if (ticker)
		clearTimeout(ticker);
}

function tick() {
	ticker = setTimeout(tick, fastFalling ? 100 : 500);
	if (faller !== null) {
		if (digits[faller - 1].isBlank()) {
			digits[faller - 1] = digits[faller];
			digits[faller] = new Digit();
			--faller;
		} else {
			// Collision!
			fastFalling = false;
			var fallingDigit = digits[faller],
				targetDigit = digits[faller - 1],
				segmentCount = 0,
				loneSegmentIsHorizontal = null;
			// The faller has landed. Destroy it.
			digits[faller] = new Digit();

			if (fallingDigit.segmentCount() == 1) {
				var segment = fallingDigit.loneSegment(),
					isVertical = !!(segment % 3);
				// A single vertical segment is side-agnostic
				if (isVertical) {
					if (segment < 3) {
						if (targetDigit.segments[2])
							targetDigit.segments[2] = false;
						else if (targetDigit.segments[1])
							targetDigit.segments[1] = false;
						else handleCollision(fallingDigit);
					} else {
						if (targetDigit.segments[5])
							targetDigit.segments[5] = false;
						else if (targetDigit.segments[4])
							targetDigit.segments[4] = false;
						else handleCollision(fallingDigit);
					}
				} else handleCollision(fallingDigit);
			} else handleCollision(fallingDigit);

			if (targetDigit.isBlank()) {
				// Hooray! Do something?
				++score;
				attempts = 0;
				if (faller == 1)
					// We just destroyed the last digit, so add one now rather than waiting.
					addNumber();
			} else
				// You only get (TODO) 5 goes at each digit.
				if (++attempts >= 5)
					addNumber();
			faller = null;
		}
	} else if (digits[digits.length - 1].isBlank()) {
		faller = digits.length - 1;
		digits[faller] = next;
		pickNext();
	} else gameOver();
	draw();
}

function handleCollision(fallingDigit) {
	var targetDigit = digits[faller - 1];
	fallingDigit.segments.forEach(function(on, i) {
		if (on)
			targetDigit.segments[i] =
				!targetDigit.segments[i];
	});
}

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
	gameOn = false;
	gameIsOver = true;
	stopTick();
}

function draw() {
	render(digits, next);
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
	fallingDigit.segments[offset] = fallingDigit.segments[offset + 1];
	fallingDigit.segments[offset + 1] = fallingDigit.segments[offset + 3];
	fallingDigit.segments[offset + 3] = fallingDigit.segments[offset + 2];
	fallingDigit.segments[offset + 2] = top;
}