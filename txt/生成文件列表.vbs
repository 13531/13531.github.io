


Set ws=WScript.CreateObject("wscript.shell")
ww=ws.CurrentDirectory


Set oFso = CreateObject("Scripting.FileSystemObject")

dim a
a=""
dim posts_list
posts_list="tmp-txt-list.html"
treeIt(ww)
set f=ofso.opentextfile(posts_list,2,true)
f.write a
f.close

Set ws = CreateObject("Wscript.Shell")
ws.run "cmd /c anit_to_utf8.vbs "&posts_list&" "&posts_list&".utf8&&move /y "&posts_list&".utf8 "&posts_list&">nul",vbhide

' s = MsgBox("�Ƿ�ȷ������", vbOKCancel) 
 
'If s = 1 Then  ws.run "cmd /c start cmd",vbhide'ȷ������


Function TreeIt(sPath)
on error resume next
Set oFso = CreateObject("Scripting.FileSystemObject")
Set oFolder = oFso.GetFolder(sPath)
Set oSubFolders = oFolder.Subfolders
Set oFiles = oFolder.Files
For Each oFile In oFiles
rem ��ȡָ����ʽ�ļ���Ϣ. �ļ�·�� ��������ʱ��
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
