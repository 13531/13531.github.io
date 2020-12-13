/*

firefox 启用about:config
privacy.file_unique_origin
开启本地跨域
 */
var contentCtn = _('#contentCtn');
let cvs = document.getElementById("canvas");
var saveData = new Map();
function draw(o,nh) {
/*
    if (o.length == 0) {
        max_x = 0;
        tmp_max_x = 0;
        return;
    }
   
   var o = o.replace(/^./, '');
*/ var t = o.charAt(0);
if(!/\p{Unified_Ideograph}/u.test(t))return;
    if (saveData.has(t)) {
        testCanvas(saveData.get(t));
		if(!nh)_('#hanzi-history').ap('<]>',_('<a href="javascript:;">'+o+'</a>'));
		 _('#input').val('');
       // draw(o);
        return;
    }

    var i = new window.XMLHttpRequest;
    i.overrideMimeType && i.overrideMimeType("application/json"),
    i.open("GET", "https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/" + t + ".json", !0),
    i.onerror = function (t) {
        //r(i, t)
        alert('error:获取数据失败');
    },
    i.onreadystatechange = function () {
			
        if (4 === i.readyState && 200 === i.status) {
			
            var hzArr = JSON.parse(i.responseText);
            saveData.set(o, hzArr);
            //testCanvas(hzArr);
            draw(o);
			
        }

    },
    i.send(null);
}

function svgToCvs(p, N, ctx) {

    var s = p.trim().split(' ');
    var s1 = s[1],
    s2 = s[2],
    s3 = s[3],
    s4 = s[4],
    s5 = s[5],
    s6 = s[6];
    s2 = N * 900 - s2;
    s4 = N * 900 - s4;
    s6 = N * 900 - s6;
    switch (s[0]) {
    case 'M':
        ctx.moveTo(s1, s2);
        break;
    case 'L':
        ctx.lineTo(s1, s2);
        break;
    case 'H':
        ctx.lineTo(s1, s2);
        break;
    case 'V':
        ctx.lineTo(s1, s2);
        break;
    case 'C':
        ctx.bezierCurveTo(s1, s2, s3, s4, s5, s6);
        break;
    case 'S':
        ctx.quadraticCurveTo(s1, s2, s3, s4);
        break;
    case 'Q':
        ctx.quadraticCurveTo(s1, s2, s3, s4);
        break;
    case 'T':
        ctx.quadraticCurveTo(s1, s2, s3, s4);
        break;
    case 'A':
        //elliptical Arc
        ctx.quadraticCurveTo(s1, s2, s3, s4);
        break;
    case 'Z':
        //Z = closepath
        ctx.closePath();
        break;

    }
}
function strokeHanzi(x, N, ctx, color) {
    var o = x;
    ctx.beginPath();
    o = o.replace(/\d+/g, function (p) {
        return p * N;
    });
        ctx.strokeStyle = color;

    ctx.lineWidth = 1;

    o.replace(/[A-Z][^A-Z]+/g, function (p) {
        svgToCvs(p, N, ctx);
    });
    ctx.closePath();
    ctx.stroke();
}
var max_x = 0;
var tmp_max_x = 0;
var timer1;
var ctx = getCTX();
ctx.fillStyle = "black";
var testCanvas = function (hz) {
    cvs.width = cvs.width;
    console.log(hz);
    var N = contentCtn.width() / 2000; //字体百分比
    var arr1 = hz.strokes;
    var arr2 = hz.medians;
    var arr3 = [];
    var arr4 = [];
    var rad = {};
    if (hz.radStrokes) {
        for (var i of hz.radStrokes) {
            console.log(i);
            rad[i] = 1;
        }
    }
    if (JSON.stringify(rad) === '{}') {
        rad[0] = 1;
    }
    //這是SVG
    for (var i = 0; i < arr1.length; i++) {
        //字体描边
        //console.log(i);
        var o = arr1[i];

        o = o.replace(/\d+/g, function (p) {
            return p * N;
        })
            ctx.beginPath();
        if (rad[i]) {
            ctx.strokeStyle = 'gray';
            ctx.fillStyle = 'pink';          
        } else {
            ctx.strokeStyle = 'gray';
            ctx.fillStyle = 'lightblue';           
        }
        ctx.lineWidth = 1;
        //console.log(a);
       // ctx.stroke();
        o.replace(/[A-Z][^A-Z]+/g, function (p) {
            svgToCvs(p, N, ctx);
        });
        ctx.stroke();
        ctx.fill();

    }

    for (var i = 0; i < arr2.length; i++) {
        arr3.push('+' + i);
      //  arr4[i] = [];
        for (var j = 0; j < arr2[i].length; j++) {
            arr3.push([arr2[i][j][0] * N, N * 900 - arr2[i][j][1] * N]);           
           // arr4[i].push([arr2[i][j][0] * N, 900 - arr2[i][j][1] * N]);

        }

    }

    var x1,
    y1,
    x2,
    y2,
    a,
    b,
    dist,
    min,
    _x,
    _y,
    _k,
    nx,
    ny;
    var res = [];
    for (var i = 0; i < arr3.length; i++) {
        if (typeof arr3[i] === 'string') {

            res.push(arr3[i]);
            x1 = null;
            continue;
        }
        x2 = arr3[i][0],
        y2 = arr3[i][1];
        if (x1) {
            a = x2 - x1,
            b = y2 - y1;
            _k = b / a;
            dist = Math.sqrt(a * a + b * b);
            min = dist / 3;

            var len = parseInt(min) - 1;
            _x = a / len;
            _y = b / len;
            for (var f = 1; f < len; f++) {
                nx = x1 + _x * f,
                ny = y1 + _y * f;
                res.push([nx, ny]);

            }
            //	console.log(dist,'加点',len);

        }
        res.push(arr3[i]);
        x1 = x2,
        y1 = y2;
    }

    var flag = 0;
    var lastNum;

    clearTimeout(_.timer);
    clearTimeout(timer1);
    var strokeColor = 'rgba(0,0,255,0.3)';
    var shadowColor = 'hsla(181,77%,78%,0.5)';
    _.timerEach(res, 0, function (k, m) {
        var c;
        if (typeof k === 'string') {
            c = parseInt(k);
            //if(typeof lastNum==='number')strokeHanzi(arr1[lastNum],N,ctx,'#eee','green');
            //strokeHanzi(arr1[c],N,ctx,'red','blue');
            lastNum = c;
            flag = 1;
            ctx.lineCap = 'round';
            ctx.lineWidth = 2;
            ctx.strokeStyle = strokeColor;           
			 ctx.lineJoin = ctx.lineCap = 'round';
            ctx.shadowBlur = ctx.lineWidth+3;
            ctx.shadowColor = shadowColor;
            points.length = 0;
            count = 0;
			ctx.beginPath();
        } else {
            if (flag === 1) {
              //ctx.moveTo(k[0],k[1]);               
            }			
			//ctx.lineTo(k[0],k[1]);
			//ctx.lineWidth = 2;
           
           drawCurve(k[0], k[1]);
            ctx.stroke();
        }
        flag = 0;

    }, function () {
        strokeHanzi(arr1[lastNum], N, ctx, 'gray', 'green');
        timer1 = setTimeout(function () {

            testCanvas(hz);
        }, 5000);
    }, 140 - _('#range').val());
    var arr = hz.medians;

    max_x += tmp_max_x;
    //console.log(tmp_max_x);

}

function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgba(" + r + "," + g + "," + b + ",0.5)";
}

function getCTX() {

    //alert(contentCtn.height());

    cvs.width = contentCtn.width();
    cvs.height = cvs.width;
    let ctx = cvs.getContext("2d");
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    return ctx;
}

var points = [];

var isDrawing; //标记是否要绘制

function drawCurve(mousex, mousey, cls) {

    points.push({
        x: mousex,
        y: mousey
    });
    if (points.length < 3)
        return;
    //ctx.beginPath();

    let x = (points[points.length - 2].x + points[points.length - 1].x) / 2,
    y = (points[points.length - 2].y + points[points.length - 1].y) / 2;
    if (points.length == 2) {
        ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
        ctx.lineTo(x, y);
    } else {
        let lastX = (points[points.length - 3].x + points[points.length - 2].x) / 2,
        lastY = (points[points.length - 3].y + points[points.length - 2].y) / 2;
        ctx.moveTo(lastX, lastY);
        ctx.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, x, y);
    }

    points.slice(0, 1);
    //ctx.stroke();


}

_('#button').on('click', function () {
    var val = _('#input').val();
	
    draw(val);

});
_('#range').on('change', function (e) {

    _.timerEachDelay = 140 - _('#range').val();
});
_('#button').on('click');
_('#input').on('keyup',function(e){
	
	if(e.keyCode===13){
		_('#button').on('click');
	}
});
_('#hanzi-history').on('click','a',function(e){
	draw(e.target.textContent,true);
	
});
