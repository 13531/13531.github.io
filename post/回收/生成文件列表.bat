@echo off
setlocal enabledelayedexpansion
:: �ж�����·���ǲ����ļ��У�����ǣ����ȡ�ļ����µ������ļ���(�������ļ����µ�)
:: code by ZHEN CMD@XP 2009-04-07
set filename=post-list.js
if exist %filename% del %filename% /q
:input
cls
set input=%~dp0
::set /p input=Please input path:
::set "input=%input:"=%"
:: �������Ϊ�ж�%input%���Ƿ�������ţ������޳���
::if "%input%"==":" goto input
::if not exist "%input%" goto input
for %%i in ("%input%") do if /i "%%~di"==%%i goto input
pushd %cd%
cd /d "%input%">nul 2>nul || exit
set cur_dir=%cd%
popd

echo ["">>%filename%
:: %%~nxiֻ��ʾ�ļ���,%%i��ʾ��·�����ļ���Ϣ
::set RelativePath=!FullPath:%ParentPath%=.!
::set RelativePath=%%%i:%cd%=.%
for /f "delims=" %%i in ('dir /b /a-d /s "%input%"') do ( 
set full=%%i
::��ȡ���·��
:: !�ļ�����·��:%��ǰĿ¼%=! �滻Ϊ��
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


