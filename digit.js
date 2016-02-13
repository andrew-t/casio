function Digit() {
	this.segments = [];
	for (var j = 0; j < 7; ++j)
		this.segments.push(false);
}

Digit.prototype.isBlank = function isBlank() {
	for (var j = 0; j < 7; ++j)
		if (this.segments[j])
			return false;
	return true;
};

Digit.eight = function eight() {
	var d = new Digit();
	for (var i = 0; i < 7; ++i)
		d.segments[i] = true;
	return d;
};