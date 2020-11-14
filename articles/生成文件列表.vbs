


Set ws=WScript.CreateObject("wscript.shell")
ww=ws.CurrentDirectory


Set oFso = CreateObject("Scripting.FileSystemObject")

dim a
a="var txt_list='"
dim posts_list
posts_list="txt-list.js"
treeIt(ww)
set f=ofso.opentextfile(posts_list,2,true)
a=a & "';"
a=RP(a)
f.write a
f.close

Set ws = CreateObject("Wscript.Shell")
ws.run "cmd /c anit_to_utf8.vbs "&posts_list&" "&posts_list&".utf8&&move /y "&posts_list&".utf8 "&posts_list&">nul",vbhide

' s = MsgBox("是否确定运行", vbOKCancel) 
 
'If s = 1 Then  ws.run "cmd /c start cmd",vbhide'确定运行


Function TreeIt(sPath)
on error resume next
Set oFso = CreateObject("Scripting.FileSystemObject")
Set oFolder = oFso.GetFolder(sPath)
Set oSubFolders = oFolder.Subfolders
Set oFiles = oFolder.Files
For Each oFile In oFiles
rem 获取指定格式文件信息. 文件路径 和最后更新时间
IF StrComp(LCase(oFso.GetExtensionName(oFile)),"html")=0 Then 
	a=a & Replace(ofile.path,ww,"") & "|"
	Set objFile=oFso.GetFile(ofile.path)
	a=a & objFile.DateLastModified & "|"
end if	
Next
For Each oSubFolder In oSubFolders
TreeIt(oSubFolder.Path)
Next
End Function 

Function RP(strSrc) 'Function 表示这是一个函数
 
 Dim objReg   '定义一个正则变量
 
 Set objReg = New RegExp '给正则变量赋值
 
 With objReg  '引用正则变量
 
  .Global = True '全局匹配
 
  .Pattern = "\\" '正则模式
 
  RP = .Replace(strSrc, "/") '替换
 
 End With
 
End Function '函数体结束
