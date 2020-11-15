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

'תΪutf8��ʽ
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

'���������ļ��д��� Ψһ����.pid �ļ�
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
	
	'������һ��Ŀ¼
	ipos=InStrRev(cd,"\")
	pathRemove=Left(cd,ipos)
	Set objFile=oFso.GetFile(ofile.path)
	ff.write "{""createtime"":""" & objFile.DateCreated & """,""updatetime"":""" & objFile.DateLastModified & """,""url"":"""&RP(Replace(ofile.path,pathRemove,""),"\\","/")&"""}"
	ff.close

	aa=aa & Replace(ofile.path,cd,"") & "|"
	aa=aa & pid & "|"	
	aa=aa & objFile.DateLastModified & "|"

	'תΪutf8��ʽjson �ƶ���pid�ļ���
	ws.run "cmd /c anit_to_utf8.vbs """ & filePath & """ """ & filePath & ".json""&&move /y  """& filePath & ".json"" " & " pid>nul" , vbhide
	'ws.run "cmd /c anit_to_utf8.vbs " & filePath & " " & filePath & ".json&&move /y  "& filePath & ".json " &filePath & "&&copy /y " & filePath & " pid>nul" , vbhide
		
end if	
Next
For Each oSubFolder In oSubFolders
TreeItCreatePid(oSubFolder.Path)
Next
End Function 


'�ж�·�����Ƿ���� .pid��׺�ļ�, ���ظ�pidֵ
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


Function RP(strSrc,reg,str) 'Function ��ʾ����һ������
 
 Dim objReg   '����һ���������
 
 Set objReg = New RegExp '�����������ֵ
 
 With objReg  '�����������
 
  .Global = True 'ȫ��ƥ��
 
  .Pattern = reg '����ģʽ
 
  RP = .Replace(strSrc, str) '�滻
 
 End With
 
End Function '���������
