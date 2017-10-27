function myfunc(id, cls) {
	document.getElementById(id).innerHTML = cls;
}

function reset() {
	for (i = 0; i < 2; i++) {
		for (j = 0; j < 5; j++) {
			document.getElementById('x' + i + j).innerHTML = '&bull;';
		}
	}
}

function submit() {
	y = "";
	for (i = 0; i < 5; i++) {
		x = "";
		for (j = 0; j < 2; j++) {
			op = escape(document.getElementById('x' + j + i).innerHTML);
			if (op !== '%u2022') {
				if (op == '%u2295') {
					op = 'CNOT';
					x = x + op + " " + j + " " + Number(!j) + "\n";
				} else if (op == 'M') {
					op = 'MEASURE';
					x = x + op + " " + j + " [" + j + "]" + "\n";
				} else x = x + op + " " + j + "\n";
			}
		}
		y = y + x + '`';
	}
	l = y.split("`");
	dispquil(l);
	return y;
}

function dispquil(codes) {
	document.getElementById('quilcode').innerHTML = 'QUIL PROGRAM : <br/><br/>';
	for (i = 0; i < codes.length; i++) {
		document.getElementById('quilcode').innerHTML += codes[i] + '<br />';
	}
}

function successCallBack(returnData) {
	write = 'STATE OF LINE : ' + '<br/><br/>';
	for (key in returnData) write += 'State of Line ' + key + ' is : ' + returnData[key] + '<br/><br/>';
	document.getElementById("result").innerHTML = write;
}

$(document).ready(function() {
	$("#submit").click(function() {
		str = submit();
		var response = {};
		response['ins'] = str;
		data = JSON.stringify(response);
		console.log(window.location.href);
		var result = {};
		$.ajax({
			type: 'POST',
			url: window.location.href,
			data: JSON.stringify(response),
			contentType: 'application/json;charset=UTF-8',
			success: successCallBack
		});
	});
});