Set ws=WScript.CreateObject("wscript.shell")
Set oFso = CreateObject("Scripting.FileSystemObject")

cd=ws.CurrentDirectory
'If not oFso.folderExists("pid_old") Then  oFso.createfolder("pid_old")
If not oFso.folderExists("pid") Then  oFso.createfolder("pid")

dim aa
dim max_pid
dim tmp_pid
dim all_pid
dim all_pid_map
dim pidArr()

all_pid_path="|"
all_pid=","
max_pid=0
tmp_pid=0
test_pid=""
aa="var articles_list='"
articles_list="articles-list.js"

getMaxPid(cd)

TreeItCreatePid(cd)

'set f=ofso.opentextfile(articles_list,2,true)
aa=aa & "';"
aa=RP(aa,"\\","/" )

WriteToFile articles_list, aa

'��ȡ���pid
Function getMaxPid(sPath)
on error resume next
'Set oFso = CreateObject("Scripting.FileSystemObject")
Set oFolder = oFso.GetFolder(sPath)
Set oSubFolders = oFolder.Subfolders
Set oFiles = oFolder.Files
For Each oFile In oFiles
	IF StrComp(LCase(oFso.GetExtensionName(oFile)),"pid")=0 Then 
		tmp_pid=CINT(RP(oFso.GetFileName(ofile),"\.pid",""))
		if max_pid<tmp_pid then  max_pid=tmp_pid		
	end if
	IF StrComp(LCase(oFso.GetFileName(oFile)),"pid.unique")=0 Then 		
		tmp_pid=CINT(ReadFile(oFile))
		if max_pid<tmp_pid then  max_pid=tmp_pid			
	end if	
Next
For Each oSubFolder In oSubFolders
getMaxPid(oSubFolder.Path)
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
dim linkName
dim pidLogFile
dim pidStr
For Each oFile In oFiles
IF StrComp(LCase(oFso.GetExtensionName(oFile)),"md")=0 Then 	
	'��ȡmd�ļ�����Ŀ¼
	ipos=InStrRev(ofile.path,"\")
	pathRemove=Left(ofile.path,ipos)	
	

	linkName=splitGetLast(pathRemove,"\",1)
	
	
	pid=hasPid(pathRemove)
	filePath=pathRemove & pid & ".pid"
	oFSO.DeleteFile filePath
	pidLogFile=pathRemove & "pid.unique"
	if oFso.fileExists(pidLogFile) then 
		pidStr=ReadFile(pidLogFile)		
		if not pid>0 then MsgBox "��⵽"&pathRemove&" �Ѱ�pid "& pidStr & " , �Զ�����Ϊ��pid"
		pid=pidStr
	else
		
		if not pid>0 then
			max_pid=max_pid+1
			pid=max_pid
		end if
		
		WriteToFile pidLogFile,pid
	end if
	filePath=pathRemove & pid & ".pid"
	
	
	'pid ����Ƿ��ظ�
	if InStrRev(all_pid, ","& pid & ",")>0 then 		
		arr1=split(all_pid,",")
		arr2=split(all_pid_path,"|")
		lens=ubound(arr1)
		samePath=""
		for xx=lens to 0 step -1			
			if CINT(arr1(xx))=CINT(pid) then samePath=samePath & vbCrlf  &arr2(xx) 
		next 
		if samePath<>"" then MsgBox i&"��⵽�ظ���pid "& pid & " .�ļ�·��:"&samePath&pathRemove& vbCrlf & vbCrlf&"��ɾ������һ���ļ����ڵ� pid.unique�ļ� �� .pid��׺�ļ�"
		
	end if
	
	all_pid=all_pid & pid & ","	
	all_pid_path=all_pid_path & pathRemove & "|"
	
	set lnk = ws.CreateShortcut( "pid\"& pid & ".pid.json.[md�ļ�]" &linkName & ".lnk")
	lnk.TargetPath = ofile.path
	lnk.Save 	
	set lnk2  = ws.CreateShortcut( "pid\"& pid & ".pid.json.[�ļ���]" &linkName & ".lnk")
	lnk2.TargetPath = pathRemove
	lnk2.Save 
	
	'������һ��Ŀ¼
	ipos=InStrRev(cd,"\")
	pathRemove=Left(cd,ipos)
	Set objFile=oFso.GetFile(ofile.path)
	
	WriteToFile filePath,"{""createtime"":""" & objFile.DateCreated & """,""updatetime"":""" & objFile.DateLastModified & """,""url"":"""&RP(Replace(ofile.path,pathRemove,""),"\\","/")&"""}"
	
	aa=aa & Replace(ofile.path,cd,"") & "|"
	aa=aa & pid & "|"	
	aa=aa & objFile.DateLastModified & "|"
	
	ws.run "cmd /c copy /y """ & filePath & """ """ & filePath & ".json""&&move /y  """& filePath & ".json"" " & " pid>nul" , vbhide		
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
hasPid=CINT(RP(oFso.GetFileName(ofile),"\.pid","" ))
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


Function WriteToFile(FileUrlDst, Str)
Set stm = CreateObject("Adodb.Stream")
stm.Type = 2
stm.mode = 3
stm.charset = "UTF-8"
stm.Open
stm.WriteText Str
stm.SaveToFile FileUrlDst, 2
stm.flush
stm.Close
Set stm = Nothing
End Function

Function ReadFile(FileUrlSrc)
Dim Str
Set stm = CreateObject("Adodb.Stream")
stm.Type = 2
stm.mode = 3
stm.charset = "UTF-8"
stm.Open
stm.loadfromfile FileUrlSrc
Str = stm.readtext
stm.Close
Set stm = Nothing
ReadFile = Str
End Function


Function splitGetLast(Str,splitStr,num)
'�����ַ��ͷָ������õ����һ����
strarr=split(Str,splitStr)
lens=ubound(strarr)
'��ȡ����ĳ���
splitGetLast = strarr(lens-num)
End Function 


Function splitGet(Str,splitStr,num)
strarr=split(Str,splitStr)
splitGet = strarr(num)
End Function 

function inArray(arr,item)
for each i in arr
	if i=item then 
	inArray=true
	exit for
	end if
next 

end function

