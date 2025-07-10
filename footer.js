// footer.js

class FooterComponent {
    constructor() {
        this.render();
    }

    render() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) return;

        const footerHTML = `
            <!-- ===== FOOTER BẮT ĐẦU ===== -->
            <footer class="site-footer bg-dark text-white py-4">
                <div class="container-fluid">
                    <div class="footer-content-wrapper">
                        <div class="row">
                            <div class="col-md-3 mb-3 mb-md-0">
                                <img src="logo.png" alt="Logo" class="mb-2" style="max-height: 50px;">
                                <p class="small text-white-50 lang-specific" data-lang-vi="Giải trí và sáng tạo không giới hạn." data-lang-en="Unlimited entertainment and creativity."></p>
                            </div>
                            <div class="col-md-3 col-4 mb-3 mb-md-0">
                                <h5 class="fw-semibold lang-specific" data-lang-vi="Khám Phá" data-lang-en="Explore"></h5>
                                <ul class="list-unstyled">
                                    <li><a href="index.html" class="text-white-50 text-decoration-none hover-light lang-specific" data-lang-vi="Trang Chủ" data-lang-en="Home"></a></li>
                                    <li><a href="caro.html" class="text-white-50 text-decoration-none hover-light lang-specific" data-lang-vi="Game Cờ Caro" data-lang-en="Caro Game"></a></li>
                                </ul>
                            </div>
                            <div class="col-md-3 col-4 mb-3 mb-md-0">
                                <h5 class="fw-semibold lang-specific" data-lang-vi="Công cụ" data-lang-en="Tools"></h5>
                                <ul class="list-unstyled">
                                    <li><a href="split.html" class="text-white-50 text-decoration-none hover-light lang-specific" data-lang-vi="Công Cụ Cắt Ảnh Lưới" data-lang-en="Grid Image Splitter"></a></li>
                                    <li><a href="scale.html" class="text-white-50 text-decoration-none hover-light lang-specific" data-lang-vi="Công Cụ Cắt Ảnh Vuông" data-lang-en="Square Image Cropper"></a></li>
                                    <li><a href="resize.html" class="text-white-50 text-decoration-none hover-light" data-lang-vi="Thay Đổi Kích Thước" data-lang-en="Image Resizer"></a></li>
                                </ul>
                            </div>
                            <div class="col-md-3 col-4">
                                <h5 class="fw-semibold lang-specific" data-lang-vi="Thông Tin" data-lang-en="Information"></h5>
                                <ul class="list-unstyled">
                                    <li><a href="about.html" class="text-white-50 text-decoration-none hover-light lang-specific" data-lang-vi="Giới Thiệu" data-lang-en="About"></a></li>
                                    <li><a href="contact.html" class="text-white-50 text-decoration-none hover-light lang-specific" data-lang-vi="Liên Hệ" data-lang-en="Contact"></a></li>
                                    <li><a href="terms.html" class="text-white-50 text-decoration-none hover-light lang-specific" data-lang-vi="Điều Khoản" data-lang-en="Terms"></a></li>
                                </ul>
                            </div>
                        </div>
                        <hr class="my-3 border-secondary">
                        <div class="row">
                            <div class="col-12 text-center">
                                <p class="small text-white-50 mb-0 lang-specific" data-lang-vi="© <span class='currentYear'></span> Game & Ảnh Pro. Phát triển bởi Trần Hữu Đạt. Bảo lưu mọi quyền." data-lang-en="© <span class='currentYear'></span> Game & Photos Pro. Developed by Trần Hữu Đạt. All rights reserved."></p>
                                <p class="small text-white-50 lang-specific" data-lang-vi="<small>Xây dựng với <i class='fas fa-heart text-danger'></i> và Bootstrap.</small>" data-lang-en="<small>Built with <i class='fas fa-heart text-danger'></i> and Bootstrap.</small>"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <!-- ===== FOOTER KẾT THÚC ===== -->
        `;
        
        footerPlaceholder.innerHTML = footerHTML;
        
        // Tự động cập nhật năm hiện tại
        this._setYear();
    }

    _setYear() {
        const yearSpans = document.querySelectorAll('.currentYear');
        if (yearSpans) {
            yearSpans.forEach(span => span.textContent = new Date().getFullYear());
        }
    }
}

// Tự động khởi tạo component khi file này được tải
document.addEventListener('DOMContentLoaded', () => new FooterComponent());