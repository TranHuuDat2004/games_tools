// load-components.js

document.addEventListener("DOMContentLoaded", function() {
    // Function to load a component and handle active nav link
    const loadComponent = async (selector, filePath, callback) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Could not load ${filePath}: ${response.statusText}`);
            }
            const text = await response.text();
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = text;
                if (callback) callback(); // Run callback after loading
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Callback function to set the active navigation link
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split("/").pop(); // e.g., "caro.html" or "index.html"
        const navLinks = document.querySelectorAll('.nav-menu-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split("/").pop();
            const parentLi = link.parentElement;
            
            // Remove active class from all items first
            parentLi.classList.remove('active');

            // Add active class if the link's href matches the current page
            if (currentPage === linkPage) {
                parentLi.classList.add('active');
            }
        });

        // Handle mobile navbar toggler
        const navbarToggler = document.getElementById('navbarToggler');
        const navbarNavContent = document.getElementById('navbarNavContent');
        if (navbarToggler && navbarNavContent) {
            navbarToggler.addEventListener('click', () => {
                navbarNavContent.classList.toggle('show');
            });
        }
    };
    
    // Load header and then set active link
    loadComponent("#header-placeholder", "header.html", setActiveNavLink);

    // Load footer
    loadComponent("#footer-placeholder", "footer.html");
});