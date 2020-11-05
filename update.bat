@echo off
title GIT快速提交工具

:: 当前git的版本
git --version
echo.
echo 当前目录：%cd%
goto start
:seturl
echo 请输入远程仓库地址:
set /p url=
::查看git对应的远程仓库地址
::echo 上次使用的git对应的远程仓库地址
::echo -----------------------[git message]-------------------------
::git remote -v
::echo -------------------------------------------------------------
::删除关联对应的远程仓库地址
git remote rm origin 
::查看是否删除成功，如果没有任何返回结果，表示OK
::git remote -v 
::重新关联git远程仓库地址  例如https://github.com/13531/test-git
git remote add origin %url%

:start
echo -------------------------------------------------------------
echo 当前git对应的远程仓库地址:
git remote -v 
echo -------------------------------------------------------------
echo 按键 [1] 进入下一步 
echo.
echo 按键 [9] 设置远程仓库地址. 
echo.
echo 按键 [C] 退出
echo;
choice /C 19c /n
if %errorlevel%==2   goto seturl
if %errorlevel%==3   goto end

echo 开始提交代码到本地仓库

echo -------------------------------------------------------------
::开始添加变更
git add -A .
echo -------------------------------------------------------------

:input
set /p var=请输入提交说明:
::去除所有空格进行验证
set "str=%var: =%"
if "%str%"=="" goto input
echo;
echo 提交说明为：  %var%
echo -----------------------[git message]-------------------------
git commit -m %var%
echo -------------------------------------------------------------
echo 将变更情况提交到远程git服务器
echo -----------------------[git message]-------------------------
git push origin master
echo -------------------------------------------------------------
echo 批处理执行完毕！
echo;
:menu
echo 如果出现错误,
echo.
echo 按键 [1] 执行git pull origin master 尝试解决问题
echo.
echo 按键 [C] 退出
echo;
choice /C 1c /n
if %errorlevel%==1   goto pull
if %errorlevel%==2   goto end
echo;
goto end
:pull
echo -----------------[git pull origin master]--------------------
git pull origin master
echo -------------------------------------------------------------
echo.
echo 按键 [1] 进入下一步git push origin master 
echo 按键 [C] 退出
echo;
choice /C 1c /n
if %errorlevel%==2   goto end
git push origin master
echo -------------------------------------------------------------
echo 批处理执行完毕！
pause
:end
