@echo off
setlocal enabledelayedexpansion
:: 判断输入路径是不是文件夹，如果是，则获取文件夹下的所有文件名(包括子文件夹下的)
:: code by ZHEN CMD@XP 2009-04-07
set filename=post-list.js
if exist %filename% del %filename% /q
:input
cls
set input=%~dp0
::set /p input=Please input path:
::set "input=%input:"=%"
:: 上面这句为判断%input%中是否存在引号，有则剔除。
::if "%input%"==":" goto input
::if not exist "%input%" goto input
for %%i in ("%input%") do if /i "%%~di"==%%i goto input
pushd %cd%
cd /d "%input%">nul 2>nul || exit
set cur_dir=%cd%
popd

echo ["">>%filename%
:: %%~nxi只显示文件名,%%i显示带路径的文件信息
::set RelativePath=!FullPath:%ParentPath%=.!
::set RelativePath=%%%i:%cd%=.%
for /f "delims=" %%i in ('dir /b /a-d /s "%input%"') do ( 
set full=%%i
::获取相对路径
:: !文件绝对路径:%当前目录%=! 替换为空
set str=!full:%cd%=!
set src=!str:\=/!
echo ,"!src!">>%filename%
)
echo ]>>%filename%
if not exist %filename% goto no_file
anit_to_utf8.vbs "%filename%" "%filename%.utf8"
move /y "%filename%.utf8" "%filename%">nul


::start list.txt
exit

:no_file
cls
echo %cur_dir% Folder does not have a separate document
pause


