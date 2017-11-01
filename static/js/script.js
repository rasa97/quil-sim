function myfunc(id, cls) {
    var bc = {'H':'#9dd7d4', '%u2295':'#be576a', 'Z':'#242b2a', 'M':'#d4dfe0', 'Y':'#93b08b', 'X':'#f18675'};
    var tc = {'H':'white', '%u2295':'#e8d4d7', 'Z':'#cf5237', 'M':'#85be7f', 'Y':'#c9ba70', 'X':'white'};
    if(cls === '%u2295'){
       target = prompt('Enter the target bit : ');
        if(target){
            document.getElementById(id).innerHTML = '&#8853;';
            document.getElementById('x'+target+id[2]).innerHTML = '&#10006;';
            document.getElementById(id).parentElement.style.color = tc[cls];
            document.getElementById(id).parentElement.style.backgroundColor = bc[cls];
            document.getElementById('x'+target+id[2]).parentElement.style.color = tc[cls];
            document.getElementById('x'+target+id[2]).parentElement.style.backgroundColor = bc[cls];
        }
    }

    else if(cls == 'CLR'){
        if(escape(document.getElementById(id).innerHTML) == '%u2295'){
            for(k=0; k<$("#container div").length ; k++){
                if(escape(document.getElementById('x' + k + id[2]).innerHTML) == '%u2716')
                    break;
            }
            document.getElementById('x' + k + id[2]).innerHTML = '&bull;';
            document.getElementById('x' + k + id[2]).parentElement.style.color = 'grey';
            document.getElementById('x' + k + id[2]).parentElement.style.backgroundColor = 'white';
        }
        document.getElementById(id).innerHTML = '&bull;';
        document.getElementById(id).parentElement.style.color = 'grey';
        document.getElementById(id).parentElement.style.backgroundColor = 'white';
    }

    else{
        document.getElementById(id).innerHTML = cls;
        document.getElementById(id).parentElement.style.color = tc[cls];
        document.getElementById(id).parentElement.style.backgroundColor = bc[cls];
    }
}

function submit(r,c) {
	y = "";
	for (i = 0; i < c; i++) {
		x = "";
		for (j = 0; j < r; j++) {
			op = escape(document.getElementById('x' + j + i).innerHTML);
			if (op !== '%u2022' && op!== '%u2716') {
				if (op == '%u2295') {
					op = 'CNOT';
                    for(k=0; k<r; k++){
                        if(escape(document.getElementById('x' + k + i).innerHTML) == '%u2716')
                            break;
                    }
					x = x + op + " " + j + " " + k + "\n";
				}
                else if (op == 'M') {
					op = 'MEASURE';
					x = x + op + " " + j + " [" + j + "]" + "\n";
				}
                else
                    x = x + op + " " + j + "\n";
			}
		}
		y = y + x + '`';
	}
	l = y.split("`");
	dispquil(l);
	return y;
}

function dispquil(codes) {
    document.getElementById("quilres").innerHTML="";
    document.getElementById("pyres").innerHTML="";
    qcode="\n";
	for (i = 0; i < codes.length; i++) {
          if(codes[i].length > 1)
		  qcode += codes[i] + '\n';
	}
    var para = document.createElement("P");
    var t = document.createTextNode(qcode);
    para.appendChild(t);
    document.getElementById("quilres").appendChild(para);
}

function successCallBack(returnData) {
    write="";
	for (key in returnData)
        write += 'State of Line ' + key + ' is : ' + returnData[key] + '\n\n';
    var para = document.createElement("P");
    var t = document.createTextNode(write);
    para.appendChild(t);
    document.getElementById("pyres").appendChild(para);
}

$(document).ready(function() {
    var r=2,c=3;

	$("#submit").click(function() {
        document.getElementById('quilcode').style.visibility = 'visible';
		str = submit(r,c);
        document.getElementById('result').style.visibility = 'visible';
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

    $("#reset").click(function() {
        for (i = 0; i < r; i++) {
		  for (j = 0; j < c; j++){
            document.getElementById('x'+i+j).innerHTML = '&bull;';
            document.getElementById('x'+i+j).parentElement.style.color = 'grey';
            document.getElementById('x'+i+j).parentElement.style.backgroundColor = 'white';
          }
	    }
        var qp=document.getElementById('quilres');
        qp.removeChild(qp.childNodes[0]);
        var pr=document.getElementById('pyres');
        pr.removeChild(pr.childNodes[0]);
    });




    $("#cols").click(function() {
        console.log("Cols function entered. Value of r : ", r, "  Value of c : ",c);
       for(index=0; index<r; index++){
           var structure = $("<li><a href=\"#\" class=\"box\"><span id=\"x" + (index) + (c) + "\" class=\"arrow\">&bull;</span></a><ul class=\"sub-menu\"><li><a onclick=\"myfunc('x" + (index) + (c) + "\', \'X\')\">X</a></li><li><a onclick=\"myfunc(\'x" +(index) + (c) + "\', \'Y\')\">Y</a></li><li><a onclick=\"myfunc(\'x" + (index) + (c) + "\', \'Z\')\">Z</a></li><li><a onclick=\"myfunc(\'x" + (index) + (c) + "\', \'H\')\">H</a></li><li><a onclick=\"myfunc(\'x" + (index) + (c) + "\', \'%u2295\')\">&#8853;</a></li><li><a onclick=\"myfunc(\'x" + (index) + (c) + "\', \'M\')\">M</a></li><li><a onclick=\"myfunc(\'x" + (index) + (c) + "\', \'CLR\')\">CLEAR</a></li></ul></li>");

           $('#r'+index).append(structure);
       }
        c=c+1;
        console.log("Value of c after adding a column : ", c);
    });

    $("#rows").click(function(){


       bd = "<div class=\"menu-wrap\"><nav class=\"menu\"><ul class=\"clearfix\" id=\"r" +(r) + "\"><p>Q" + (r) + "</p>";

        for (index=0; index<c; index++){
            bd=bd+ "<li><a href=\"#\" class=\"box\"><span id=\"x" + (r) + (index) + "\" class=\"arrow\">&bull;</span></a><ul class=\"sub-menu\"><li><a onclick=\"myfunc(\'x" + (r) + (index) + '\', \'X\')\">X</a></li><li><a onclick=\"myfunc(\'x' + (r) + (index) + '\', \'Y\')\">Y</a></li><li><a onclick=\"myfunc(\'x' + (r) + (index) + '\', \'Z\')\">Z</a></li><li><a onclick=\"myfunc(\'x' + (r) + (index) + '\', \'H\')\">H</a></li><li><a onclick=\"myfunc(\'x' + (r) + (index) + '\', \'%u2295\')\">&#8853;</a></li><li><a onclick=\"myfunc(\'x' + (r) + (index) + '\', \'M\')\">M</a></li><li><a onclick=\"myfunc(\'x' + (r) + (index) + '\', \'CLR\')\">CLEAR</a></li></ul></li>';
        }

        bd=bd+"</ul></nav></div><br><br><br><br><br>";

       var structure = $(bd);
       $('#container').append(structure);

        r=r+1;
        console.log("Value of r after adding a row : ", r);
    });
});
