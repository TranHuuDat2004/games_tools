document.addEventListener("DOMContentLoaded", function() {
    const footerPlaceholder = document.querySelector("footer-placeholder");

    if (footerPlaceholder) {
        // Sử dụng backticks (`) để tạo một chuỗi đa dòng, giúp mã HTML dễ đọc hơn.
        const footerHTML = `
        <!-- ===== FOOTER BẮT ĐẦU ===== -->
        <footer class="site-footer bg-dark text-white py-4 mt-auto">
            <div class="container-fluid px-4 px-lg-5"> <!-- Thêm padding để nội dung không dính sát viền -->
                <div class="footer-content-wrapper">
                    <div class="row">
                        <!-- Cột Logo và Giới thiệu -->
                        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0 text-center text-md-start">
                            <!-- Đảm bảo đường dẫn đến logo chính xác -->
                            <img src="logo.png" alt="Logo" class="mb-2" style="max-height: 50px;">
                            <p class="small text-white-50">Giải trí và sáng tạo không giới hạn.</p>
                        </div>

                        <!-- Cột Khám phá -->
                        <div class="col-lg-2 col-md-6 col-6 mb-4 mb-lg-0">
                            <h5 class="fw-semibold mb-3">Khám Phá</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2"><a href="index.html" class="text-white-50 text-decoration-none hover-light">Trang Chủ</a></li>
                                <li class="mb-2"><a href="game.html" class="text-white-50 text-decoration-none hover-light">Game Xếp Hình</a></li>
                            </ul>
                        </div>

                        <!-- Cột Công cụ -->
                        <div class="col-lg-4 col-md-6 col-6 mb-4 mb-lg-0">
                            <h5 class="fw-semibold mb-3">Công Cụ</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2"><a href="split.html" class="text-white-50 text-decoration-none hover-light">Công Cụ Cắt Lưới</a></li>
                                <li class="mb-2"><a href="scale.html" class="text-white-50 text-decoration-none hover-light">Công Cụ Cắt Vuông</a></li>
                                <li class="mb-2"><a href="resize.html" class="text-white-50 text-decoration-none hover-light">Thay đổi kích thước</a></li>
                            </ul>
                        </div>
                        
                        <!-- Cột Thông tin -->
                        <div class="col-lg-3 col-md-6 col-12">
                            <h5 class="fw-semibold mb-3">Thông Tin</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2"><a href="about.html" class="text-white-50 text-decoration-none hover-light">Giới Thiệu</a></li>
                                <li class="mb-2"><a href="contact.html" class="text-white-50 text-decoration-none hover-light">Liên Hệ</a></li>
                                <li class="mb-2"><a href="terms.html" class="text-white-50 text-decoration-none hover-light">Điều Khoản</a></li>
                            </ul>
                        </div>
                    </div>
                    <hr class="my-4 border-secondary">
                    <div class="row">
                        <div class="col-12 text-center">
                            <p class="small text-white-50 mb-0">
                                © <span id="currentYear"></span> Game & Image Pro. Phát triển bởi Trần Hữu Đạt. Bảo lưu mọi quyền.
                            </p>
                            <p class="small text-white-50 mt-1">
                                <small>Xây dựng với <i class="fas fa-heart text-danger"></i> và Bootstrap.</small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        <!-- ===== FOOTER KẾT THÚC ===== -->
        `;
        
        // Chèn HTML vào placeholder
        footerPlaceholder.innerHTML = footerHTML;

        // Tự động cập nhật năm hiện tại
        const yearSpan = document.getElementById("currentYear");
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
});