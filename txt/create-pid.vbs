


Set ws=WScript.CreateObject("wscript.shell")
ww=ws.CurrentDirectory
ws.run "cmd /c if not exist pid md pid >nul" , vbhide


Set oFso = CreateObject("Scripting.FileSystemObject")

dim a
dim pid_log
dim max_pid
dim tmp_pid
max_pid=0
a=""
pid_log="pid_log.txt"
treeIt(ww)
treeItCreatePid(ww)
set f=ofso.opentextfile(pid_log,2,true)
'a=a & "';"
'a=RP(a)
f.write a
f.close

'Set ws = CreateObject("Wscript.Shell")
'ws.run "cmd /c anit_to_utf8.vbs "&posts_list&" "&posts_list&".utf8&&move /y "&posts_list&".utf8 "&posts_list&">nul",vbhide

' s = MsgBox("是否确定运行", vbOKCancel) 
 
'If s = 1 Then  ws.run "cmd /c start cmd",vbhide'确定运行
'MsgBox max_pid

Function TreeIt(sPath)
on error resume next
Set oFso = CreateObject("Scripting.FileSystemObject")
Set oFolder = oFso.GetFolder(sPath)
Set oSubFolders = oFolder.Subfolders
Set oFiles = oFolder.Files
For Each oFile In oFiles
IF StrComp(LCase(oFso.GetExtensionName(oFile)),"pid")=0 Then 
	tmp_pid=RP(oFso.GetFileName(ofile),"\.pid","" )
	a=a & tmp_pid& "|"
	if tmp_pid>max_pid then max_pid=tmp_pid	
end if	
Next
For Each oSubFolder In oSubFolders
TreeIt(oSubFolder.Path)
Next
End Function 


Function TreeItCreatePid(sPath)
on error resume next
Set oFso = CreateObject("Scripting.FileSystemObject")
Set oFolder = oFso.GetFolder(sPath)
Set oSubFolders = oFolder.Subfolders
Set oFiles = oFolder.Files
For Each oFile In oFiles
IF StrComp(LCase(oFso.GetExtensionName(oFile)),"html")=0 Then 
dim ipos
ipos=InStrRev(ofile.path,"\")
pathRemove=Left(ofile.path,ipos)
dim pid
pid=hasPid(pathRemove)
dim filePath
	if pid>0 then
		 filePath=pathRemove & pid & ".pid"
			
	else
		max_pid=max_pid+1
		filePath=pathRemove & max_pid & ".pid"			
	end if
set f=ofso.opentextfile(filePath,2,true)	

ipos=InStrRev(ww,"\")
pathRemove=Left(ww,ipos)
f.write "<?xml version=""1.0"" encoding=""UTF-8""?><url>"&RP(Replace(ofile.path,pathRemove,""),"\\","/")&"</url>"
'f.write RP(Replace(ofile.path,pathRemove,""),"\\","/")
f.close


ws.run "cmd /c anit_to_utf8.vbs " & filePath & " " & filePath & ".utf8&&move /y  "& filePath & ".utf8 " &filePath & "&&copy /y " & filePath & " pid >nul" , vbhide
	
end if	
Next
For Each oSubFolder In oSubFolders
TreeItCreatePid(oSubFolder.Path)
Next
End Function 



Function hasPid(spath)
on error resume next
Set oFso = CreateObject("Scripting.FileSystemObject")
Set oFolder = oFso.GetFolder(sPath)
Set oSubFolders = oFolder.Subfolders
Set oFiles = oFolder.Files
For Each oFile In oFiles
IF StrComp(LCase(oFso.GetExtensionName(oFile)),"pid")=0 Then 
hasPid=RP(oFso.GetFileName(ofile),"\.pid","" )
end if	
Next
For Each oSubFolder In oSubFolders
hasPid(oSubFolder.Path)
Next
End Function 


Function RP(strSrc,reg,str) 'Function 表示这是一个函数
 
 Dim objReg   '定义一个正则变量
 
 Set objReg = New RegExp '给正则变量赋值
 
 With objReg  '引用正则变量
 
  .Global = True '全局匹配
 
  .Pattern = reg '正则模式
 
  RP = .Replace(strSrc, str) '替换
 
 End With
 
End Function '函数体结束
