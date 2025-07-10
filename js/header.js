// header.js

class HeaderComponent {
    constructor() {
        this.render();
    }

    render() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (!headerPlaceholder) return;

        // Dùng template literal (dấu `) để chứa HTML
        const headerHTML = `
            <!-- Bộ chuyển đổi ngôn ngữ -->
            <div class="lang-switcher-container">
                <div class="lang-switcher btn-group" role="group" aria-label="Language selector">
                    <button type="button" class="btn btn-outline-secondary lang-btn" data-lang="vi">VI</button>
                    <button type="button" class="btn btn-outline-secondary lang-btn" data-lang="en">EN</button>
                </div>
            </div>

            <!-- ===== NAVBAR BẮT ĐẦU (CSS Tùy Chỉnh) ===== -->
            <nav class="custom-navbar">
                <div class="nav-container">
                    <a class="nav-brand" href="index.html">
                        <img style="max-height: 40px; display: inline-block; vertical-align: middle;" src="logo.png" alt="Logo" data-translate="navLogoAlt">
                    </a>

                    <button class="nav-toggler" id="navbarToggler" aria-label="Toggle navigation" data-translate="navToggleLabel">
                        <span class="nav-toggler-icon"></span>
                    </button>

                    <div class="nav-collapse" id="navbarNavContent">
                        <ul class="nav-menu">
                            <li class="nav-menu-item">
                                <a class="nav-menu-link lang-specific" href="index.html" data-lang-vi="Trang Chủ" data-lang-en="Home">Trang Chủ</a>
                            </li>
                            <li class="nav-menu-item">
                                <a class="nav-menu-link lang-specific" href="caro.html" data-lang-vi="Chơi Game" data-lang-en="Play Game">Chơi Game</a>
                            </li>
                            <li class="nav-menu-item">
                                <a class="nav-menu-link lang-specific" href="about.html" data-lang-vi="Giới Thiệu" data-lang-en="About">Giới Thiệu</a>
                            </li>
                            <li class="nav-menu-item">
                                <a class="nav-menu-link lang-specific" href="contact.html" data-lang-vi="Liên Hệ" data-lang-en="Contact">Liên Hệ</a>
                            </li>
                            <li class="nav-menu-item">
                                <a class="nav-menu-link lang-specific" href="split.html" data-lang-vi="Cắt Ảnh" data-lang-en="Image Tools">Cắt Ảnh</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <!-- ===== NAVBAR KẾT THÚC (CSS Tùy Chỉnh) ===== -->
        `;

        headerPlaceholder.innerHTML = headerHTML;
        
        // Sau khi render, thiết lập các event listeners và logic
        this._setupEventListeners();
        this._setActiveNavLink();
    }

    _setupEventListeners() {
        const navbarToggler = document.getElementById('navbarToggler');
        const navbarNavContent = document.getElementById('navbarNavContent');
        if (navbarToggler && navbarNavContent) {
            navbarToggler.addEventListener('click', () => {
                navbarNavContent.classList.toggle('show');
            });
        }
    }

    _setActiveNavLink() {
        // Lấy tên file của trang hiện tại (e.g., "caro.html")
        const currentPage = window.location.pathname.split("/").pop() || "index.html"; 
        const navLinks = document.querySelectorAll('.nav-menu-link');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split("/").pop();
            if (currentPage === linkPage) {
                link.parentElement.classList.add('active');
            }
        });
    }
}

// Tự động khởi tạo component khi file này được tải
document.addEventListener('DOMContentLoaded', () => new HeaderComponent());