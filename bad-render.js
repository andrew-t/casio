// A bad renderer. Fix it or replace it.

var screenDiv,
	screenCells;

document.addEventListener('DOMContentLoaded', function () {
	screenDiv = document.getElementById('screen');
});

function render(digits) {
	if (!screenDiv) {
		return;
	}
	if (!screenCells) {
		screenCells = [];
		var table = document.createElement('table'),
			tr = document.createElement('tr');
		digits.forEach(function(digit) {
			var td = document.createElement('td'),
				pre = document.createElement('pre'),
				text = document.createTextNode('');
			screenCells.push(text);
			pre.appendChild(text);
			td.appendChild(pre);
			tr.appendChild(td);
		});
		table.appendChild(tr);
		screenDiv.appendChild(table);
	}
	digits.forEach(function(digit, i) {
		screenCells[i].textContent = ' ' +
			(digit.segments[0] ? '_' : ' ') + ' \n' +
			(digit.segments[1] ? '[' : ' ') +
			(digit.segments[3] ? '_' : ' ') +
			(digit.segments[2] ? ']' : ' ') + '\n' +
			(digit.segments[4] ? '[' : ' ') +
			(digit.segments[6] ? '_' : ' ') +
			(digit.segments[5] ? ']' : ' ');
	});
};