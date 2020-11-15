Set ws=WScript.CreateObject("wscript.shell")
Set oFso = CreateObject("Scripting.FileSystemObject")

cd=ws.CurrentDirectory
ws.run "cmd /c if not exist pid md pid >nul" , vbhide


dim aa
dim max_pid
dim tmp_pid
max_pid=0
aa="var articles_list='"
articles_list="articles-list.js"

treeIt(cd)
treeItCreatePid(cd)
set f=ofso.opentextfile(articles_list,2,true)
aa=aa & "';"
aa=RP(aa,"\\","/" )
f.write aa
f.close

'转为utf8格式
ws.run "cmd /c anit_to_utf8.vbs """& articles_list & """ """ & articles_list &".utf8""&&move /y """ & articles_list & ".utf8"" """& articles_list &""">nul",vbhide


Function TreeIt(sPath)
on error resume next
'Set oFso = CreateObject("Scripting.FileSystemObject")
Set oFolder = oFso.GetFolder(sPath)
Set oSubFolders = oFolder.Subfolders
Set oFiles = oFolder.Files
For Each oFile In oFiles
IF StrComp(LCase(oFso.GetExtensionName(oFile)),"pid")=0 Then 
	tmp_pid=RP(oFso.GetFileName(ofile),"\.pid","" )	
	if tmp_pid>max_pid then max_pid=tmp_pid	
end if	
Next
For Each oSubFolder In oSubFolders
TreeIt(oSubFolder.Path)
Next
End Function 

'遍历文章文件夹创建 唯一数字.pid 文件
Function TreeItCreatePid(sPath)
on error resume next
'Set oFso = CreateObject("Scripting.FileSystemObject")
Set oFolder = oFso.GetFolder(sPath)
Set oSubFolders = oFolder.Subfolders
Set oFiles = oFolder.Files
dim ipos
dim pid
dim filePath
For Each oFile In oFiles
IF StrComp(LCase(oFso.GetExtensionName(oFile)),"html")=0 Then 	
	
	ipos=InStrRev(ofile.path,"\")
	pathRemove=Left(ofile.path,ipos)	
	
	pid=hasPid(pathRemove)	
	if not pid>0 then
		max_pid=max_pid+1
		pid=max_pid
	end if
	filePath=pathRemove & pid & ".pid"	
	set ff=ofso.opentextfile(filePath,2,true)	
	
	'保留上一级目录
	ipos=InStrRev(cd,"\")
	pathRemove=Left(cd,ipos)
	Set objFile=oFso.GetFile(ofile.path)
	ff.write "{""createtime"":""" & objFile.DateCreated & """,""updatetime"":""" & objFile.DateLastModified & """,""url"":"""&RP(Replace(ofile.path,pathRemove,""),"\\","/")&"""}"
	ff.close

	aa=aa & Replace(ofile.path,cd,"") & "|"
	aa=aa & pid & "|"	
	aa=aa & objFile.DateLastModified & "|"

	'转为utf8格式json 移动到pid文件夹
	ws.run "cmd /c anit_to_utf8.vbs """ & filePath & """ """ & filePath & ".json""&&move /y  """& filePath & ".json"" " & " pid>nul" , vbhide
	'ws.run "cmd /c anit_to_utf8.vbs " & filePath & " " & filePath & ".json&&move /y  "& filePath & ".json " &filePath & "&&copy /y " & filePath & " pid>nul" , vbhide
		
end if	
Next
For Each oSubFolder In oSubFolders
TreeItCreatePid(oSubFolder.Path)
Next
End Function 


'判断路径下是否存在 .pid后缀文件, 返回该pid值
Function hasPid(spath)
on error resume next
'Set oFso = CreateObject("Scripting.FileSystemObject")
Set oFolder = oFso.GetFolder(sPath)
'Set oSubFolders = oFolder.Subfolders
Set oFiles = oFolder.Files
For Each oFile In oFiles
IF StrComp(LCase(oFso.GetExtensionName(oFile)),"pid")=0 Then 
hasPid=RP(oFso.GetFileName(ofile),"\.pid","" )
exit for
end if	
Next
'For Each oSubFolder In oSubFolders
'hasPid(oSubFolder.Path)
'Next
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
