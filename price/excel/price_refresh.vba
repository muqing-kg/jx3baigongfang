Option Explicit

Public Sub CheckPriceUpdate()
    RefreshPrices False
End Sub

Public Sub RefreshPrices(silent As Boolean)
    Dim dst As Worksheet
    Dim url As String
    Dim qt As QueryTable
    Dim started As Double

    On Error GoTo EH
    Application.ScreenUpdating = False
    Application.StatusBar = "Refreshing prices from GitHub Pages..."
    started = Timer

    Set dst = ThisWorkbook.Worksheets(8)
    url = "https://cherishxie.github.io/JX3-AH-Calculator/prices.html?ts=" & Format(Now, "yyyymmddhhnnss")

    Do While dst.QueryTables.Count > 0
        dst.QueryTables(1).Delete
    Loop

    Set qt = dst.QueryTables.Add(Connection:="URL;" & url, Destination:=dst.Range("A1"))
    With qt
        .Name = "PriceRefresh"
        .FieldNames = True
        .RowNumbers = False
        .FillAdjacentFormulas = False
        .PreserveFormatting = False
        .RefreshOnFileOpen = False
        .BackgroundQuery = False
        .RefreshStyle = xlOverwriteCells
        .SaveData = True
        .AdjustColumnWidth = False
        .WebFormatting = xlWebFormattingNone
        .WebSelectionType = xlSpecifiedTables
        .WebTables = "1"
        .WebDisableDateRecognition = True
        .Refresh BackgroundQuery:=False
    End With

    Application.ScreenUpdating = True
    Application.StatusBar = False
    If Not silent Then
        MsgBox "Prices updated." & vbCrLf & "Data time: " & CStr(dst.Range("AM2").Value) & vbCrLf & _
               "Elapsed: " & Format(Timer - started, "0.0") & " s", vbInformation, "JX3 Price Ledger"
    End If
    Exit Sub
EH:
    Application.ScreenUpdating = True
    Application.StatusBar = False
    If Not silent Then
        MsgBox "Refresh failed: " & Err.Description & vbCrLf & _
               "Check network access to GitHub Pages, or use the IQY web query.", vbExclamation, "JX3 Price Ledger"
    End If
End Sub
