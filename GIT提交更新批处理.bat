@echo off
::开启该项后 %var%  !var!显示的值不同
setlocal enabledelayedexpansion
::setlocal disabledelayedexpansion
title GIT提交更新批处理--13531@github

call:menuChoice

goto:eof
::---------------------------------------------------------------------
::--内部定義区
::---------------------------------------------------------------------

:showMenu
echo [1]提交更新
echo [2] 
echo [3]显示/设置 用户名和邮箱
echo [4]显示/设置 Git关联的远程仓库地址
echo [5]
echo [6]
echo [7]
echo [8] 
echo [9]切换到cmd命令行
echo [C]退出
echo -------------------------------------------------------------
goto:eof


:menuChoice
cls
call:showMenu
echo -------------------------------------------------------------
choice /C 123456789c /n /m "请选择:"
cls
echo.
if !errorlevel!==1 (
cls
call:updata
call:gobackToMenu
)
if !errorlevel!==2 (

call:gobackToMenu
)

if !errorlevel!==3 (
	::显示/设置 user.name user.email
	echo 当前用户名:
	git config user.name
	echo 当前邮箱:
	git config user.email
	echo.
	echo 按键[S]设置用户名和邮箱 
	echo 按键[C]返回主菜单
	choice /C sc /n /m ""
	if !errorlevel!==2 goto menuChoice
	set /p name=输入用户名:
	git config user.name !name!
	set /p email=输入邮箱:
	git config user.email !email!
	echo.
	echo 设置完成!
	echo.
	echo 当前用户名:&&git config user.name
	echo 当前邮箱:&&git config user.email
	echo.
	call:gobackToMenu
)
if !errorlevel!==4  (
::显示/设置 git关联的远程仓库地址 .远程仓库地址 例如 https://github.com/13531/test-git
	echo 当前git关联的远程仓库地址:
	echo.
	git remote -v 
	echo.
	echo 按键[S]设置远程仓库地址 
	echo 按键[C]返回
	choice /C sc /n /m ""
	if !errorlevel!==2 goto menuChoice
	set /p url=输入远程仓库地址:
	git remote rm origin
	git remote add origin !url!
	echo.
	echo 设置完成!
	echo.
	echo 当前git关联的远程仓库地址是
	git remote -v 
	echo.
	call:gobackToMenu
)
if !errorlevel!==5   (
call:gobackToMenu

)
if !errorlevel!==6  (

call:gobackToMenu
)
if !errorlevel!==7 (

call:gobackToMenu
)
if !errorlevel!==8  (

call:gobackToMenu
)
if !errorlevel!==9  (

cmd
)
if !errorlevel!==10  (

exit 0
)

goto:eof

:gobackToMenu
echo.
choice /C c /n /m "按键[C]返回主菜单"

if !errorlevel!==1   goto menuChoice
goto:eof

:updata
echo git关联的远程仓库地址:
git remote -v 
echo.
echo 当前目录：%cd%
echo.
echo 用户名:
git config user.name
echo 邮箱:
git config user.email
echo.
set mode_1=add -A .
set mode_2=add .
set mode_3=add -U .

echo 请选择更新模式:
echo 按键[1] git !mode_1!    
echo 按键[3] git !mode_2! 
echo 按键[5] git !mode_3!   
echo 按键[c] 返回主菜单
choice /C 12345c /m "" /n
echo.

echo 开始提交代码到本地仓库
if !errorlevel!==1  (
git !mode_1!  
)
if !errorlevel!==3  (
git !mode_2! 
)
if !errorlevel!==5  (
git !mode_3!   
)
if !errorlevel!==6  (
goto menuChoice
)

:inputcommit
set /p var=请输入提交说明:
::去除所有空格进行验证
set "str=!var: =!"
if "!str!"=="" goto inputcommit

echo;
echo 提交说明为：  !var!
echo -----------------------[git message]-------------------------
git commit -m !var!
echo -------------------------------------------------------------
echo 将变更情况提交到远程git服务器
echo -----------------------[git message]-------------------------
git push origin master
echo -------------------------------------------------------------
echo.
echo (如果出现错误, 按键 [1] 执行git pull origin master 尝试解决问题)
echo.
echo 批处理执行完毕！
echo.
echo.
echo 按键 [C] 返回主菜单
echo;
choice /C 1c /n
if !errorlevel!==1 (
	echo -----------------[git pull origin master]--------------------
	git pull origin master
	echo -------------------------------------------------------------
	echo.
	echo 按键 [1] 进入下一步git push origin master 
	echo 按键 [C] 返回主菜单
	echo;
	choice /C 1c /n
	if !errorlevel!==1 (
		git push origin master
		echo -------------------------------------------------------------
		echo 批处理执行完毕！
		call:gobackToMenu
	)	
	if !errorlevel!==2 (
		 goto menuChoice
	)
	
	call:gobackToMenu

)
if !errorlevel!==2  (
 goto menuChoice
) 

call:gobackToMenu
goto:eof
