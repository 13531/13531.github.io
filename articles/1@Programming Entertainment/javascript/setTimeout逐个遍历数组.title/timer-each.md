<pre><code>
var timerEach = function (arr, n, callback, finishFunc,t) {    
    setTimeout(function () {
		callback(arr[n],n);
        arr[++n] ? timerEach(arr, n, callback,finishFunc,t) : finishFunc();
    }, t);
}
var a = ['11', '22', '33', '44'];
timerEach(a, 0,
    function (o,n) {
    console.log(o,n);
},
    function () {
    console.log('完成');
},1000);
</code></pre>