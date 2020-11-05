@echo off
title GIT提交批处理——魏小敏
echo *************************************************************
echo *                GIT 代码提交批处理                         *
echo *  Author: 魏小敏  13531@github                             *
echo *  Version: 1.1                                             *
echo *  Created: 2017/3/26                                       *
echo *  Last Updated: 2020/11/5                                  *
echo *  Last Updated by: 13531@github                            *
echo *************************************************************

::查看git对应的远程仓库地址
echo 上次使用的git对应的远程仓库地址
echo -----------------------[git message]-------------------------
git remote -v
echo -------------------------------------------------------------
::删除关联对应的远程仓库地址
git remote rm origin 
::查看是否删除成功，如果没有任何返回结果，表示OK
git remote -v 
::重新关联git远程仓库地址
git remote add origin https://github.com/13531/13531.github.io

echo 当前git对应的远程仓库地址已修改为
echo -----------------------[git message]-------------------------
git remote -v 
echo -------------------------------------------------------------
echo;
echo 开始提交代码到本地仓库
echo 当前目录是：%cd%
echo;
pause
echo;
echo 当前git的版本
echo -----------------------[git message]-------------------------
git --version
echo -------------------------------------------------------------
echo 开始添加变更
echo -----------------------[git message]-------------------------
git add -A .
echo -------------------------------------------------------------
echo 执行结束！
echo 提交变更到本地仓库
@echo off
:input
set /p var=请输入提交说明:
::去除所有空格进行验证
set "str=%var: =%"
if "%str%"=="" goto input
echo;
echo 您输入的提交说明为：  %var%
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
echo 如果出现错误,可输入y执行git pull origin master
set /p var=
echo;
if "%var%"=="y" goto pull
goto end
:pull
echo -----------------[git pull origin master]--------------------
git pull origin master
echo -------------------------------------------------------------
pause
echo -----------------[git push origin master]----------------------
git push origin master
echo -------------------------------------------------------------
echo 批处理执行完毕！
:end
pause