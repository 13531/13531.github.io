


Set ws=WScript.CreateObject("wscript.shell")
ww=ws.CurrentDirectory


Set oFso = CreateObject("Scripting.FileSystemObject")
msgbox wscript.scriptname
dim a
a=""
dim posts_list
posts_list="tmp-txt-list.html"
treeIt(ww)
set f=ofso.opentextfile(posts_list,2,true)
f.write a
f.close
msgbox "OK"
Set ws = CreateObject("Wscript.Shell")
ws.run "cmd /c anit_to_utf8.vbs "&posts_list&" "&posts_list&".utf8&&move /y "&posts_list&".utf8 "&posts_list&">nul",vbhide

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
