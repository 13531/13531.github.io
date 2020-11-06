@echo off
setlocal enabledelayedexpansion
set filename=post-list.js
if exist %filename% del %filename% /q

echo ["">>%filename%
for /r %%i in (*.txt) do (	 
set full=%%i
::获取相对路径
:: !文件绝对路径:%当前目录%=! 替换为空
set str=!full:%cd%=!
set src=!str:\=/!
echo ,"!src!">>%filename%
)
echo ]>>%filename%
anit_to_utf8.vbs "%filename%" "%filename%.utf8"
move /y "%filename%.utf8" "%filename%">nul