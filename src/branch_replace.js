/*
 *@{text} 原始文本
 *@{reArr} 正则数组 例如 [[/\d+/g,function(p){return '<b>'+p+'</b>'} ],[/\w+/,'test']]
 * 正则匹配过的字符将被隐藏, 例如 使用了/..\d+/ 前面两点匹配的字符会被隐藏,后面的/123/数字正则无效!
 *只适合正则前后是固定字符的规则
 *return string
 *
 *
 */
function branchReplace(text, reArr) {
    //var resCtn=_('<div></div>');
    var resCtn = {
        nodes: []
    };
    var reArrIndex = 0;
    var leng = reArr.length;

    var _branchReplace = function (str, reArrItem, ctn) {
        if (reArrIndex < leng) {}
        else {
            return;
        }
        var tmpResIndex = 0;
        var tmpLastIndex = 0;
        var originalStr;
        var newStr;   
        var result;
		var rep=reArrItem[1];
		
        reArrIndex++; //分支索引,进入
        while ((result = reArrItem[0].exec(str)) != null) {
            originalStr = str.substring(tmpLastIndex, result.index);

            //进入分支匹配
            _branchReplace(originalStr, reArr[reArrIndex], {
                nodes: []
            });
           // newStr = reArrItem[1](result[0], result[1], result[2], result[3]);
            ctn.nodes.push(originalStr);
            ctn.nodes.push(rep(result[0], result[1], result[2], result[3]));
            //tmpResIndex=result.index ,
            tmpLastIndex = reArrItem[0].lastIndex;

        }
        originalStr = str.substring(tmpLastIndex, str.length);
        _branchReplace(originalStr, reArr[reArrIndex], ctn)
        if (reArrIndex === reArr.length) {
            //分支最终无匹配
            ctn.nodes.push(originalStr);
        }
        reArrIndex--; //分支索引 ,后退
    }

    _branchReplace(text, reArr[reArrIndex], resCtn);

    var res = [],str='';
    function objFunc(obj) {
        for (var i in obj) {
            if (typeof obj[i] === 'object') {
                objFunc(obj[i])
            } else /*	if(typeof obj[i]==='string')*/ {
                res.push(obj[i]);
            }
        }
    }
    objFunc(resCtn);
	str=res.join('');
    return str;
}
