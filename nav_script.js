console.log("Scripts.js loaded successfully");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, creating navbar");
    loadNavbar();
});

function loadNavbar() {
    // Check if navbar already exists to avoid duplicates
    if (document.querySelector('header')) {
        console.log("Navbar already exists");
        return;
    }

    console.log("Creating navbar");
    createNavbar();
}

function createNavbar() {
    const navbar = `
        <header>
            <nav class="navbar">
                <a href="index.html" class="logo-container">
                    <span class="logo">bespoke teacher</span>
                    <span class="tagline">for teachers, by teachers</span>
                </a>
                <div class="nav-links">
                    <a href="about.html">about us</a>
                    <a href="product.html">product</a>
                    <a href="report_writer.html">reports
                    <a href="template.html">blog</a>
                </div>
            </nav>
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', navbar);
    console.log("Navbar created");
    setupNavigation();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.removeAttribute('target');
        
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                e.preventDefault();
                window.location.href = href;
            }
        });
    });
}