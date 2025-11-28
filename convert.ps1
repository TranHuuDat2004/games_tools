# Đường dẫn đến thư mục chứa file PPTX
# Sửa lại đường dẫn này cho đúng với máy bạn
$folderPath = "D:\Slides"

# Khởi tạo ứng dụng PowerPoint
$pptxApp = New-Object -ComObject PowerPoint.Application
# Cho phép chạy ẩn (hoặc hiện nếu muốn xem tiến trình)
$pptxApp.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue

# Lấy danh sách file .pptx
$files = Get-ChildItem -Path $folderPath -Filter *.pptx

ForEach ($file in $files) {
    Write-Host "Dang xu ly: $($file.Name)"
    
    try {
        # Mở file
        $presentation = $pptxApp.Presentations.Open($file.FullName)
        
        # Tạo tên file PDF đầu ra
        $pdfName = $file.FullName -replace '\.pptx$', '.pdf'
        
        # Lưu sang định dạng PDF (32 là mã định dạng PDF)
        $presentation.SaveAs($pdfName, 32)
        
        # Đóng file
        $presentation.Close()
    }
    catch {
        Write-Host "Loi khi xu ly file: $($file.Name)" -ForegroundColor Red
    }
}

# Tắt PowerPoint
$pptxApp.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($pptxApp) | Out-Null
Write-Host "Hoan tat!" -ForegroundColor Green