var display = new SegmentDisplay("screen");
display.cornerType      = 2;
display.segmentCount    = 7;
display.displayAngle    = 9;
display.digitHeight     = 40;
display.digitWidth      = 24;
display.digitDistance   = 2;
display.segmentWidth    = 5;
display.segmentDistance = 0.5;
display.colorOn         = "rgba(0, 0, 0, 0.9)";
display.colorOff        = "rgba(0, 0, 0, 0.1)";

function render(digits) {
	var displayDigits = [];
	display.pattern = '';
	digits.forEach(function(digit) {
		displayDigits.push(digit);
		displayDigits.push(' ');
		display.pattern += '#.';
	});
	display.setDigits(displayDigits);
}