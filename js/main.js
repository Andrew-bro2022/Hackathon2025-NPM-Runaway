import { ProductLoader } from './productLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    const loader = new ProductLoader();
    loader.loadProductData();

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            localStorage.setItem('theme', 'light');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    });

    // Scroll to top functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Show button when page is scrolled
    const toggleScrollButton = () => {
        if (window.scrollY > 200) {
            scrollToTopBtn.classList.add('visible');
            scrollToTopBtn.classList.remove('hidden');
        } else {
            scrollToTopBtn.classList.remove('visible');
            scrollToTopBtn.classList.add('hidden');
        }
    };

    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Listen for scroll events
    window.addEventListener('scroll', toggleScrollButton);

    // Download functionality
    document.getElementById('downloadBtn').addEventListener('click', async () => {
        const productCard = document.getElementById('productCard');
        
        try {
            // Show loading state
            const downloadBtn = document.getElementById('downloadBtn');
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = `
                <svg class="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            `;
            
            // Generate canvas from the product card
            const canvas = await html2canvas(productCard, {
                scale: 2, // Higher quality
                useCORS: true, // Allow loading cross-origin images
                backgroundColor: '#F3F4F6', // Match the background color
                logging: false
            });

            // Convert canvas to image and download
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            const productName = document.getElementById('productName').textContent;
            const fileName = `${productName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_info.png`;
            
            link.href = image;
            link.download = fileName;
            link.click();

            // Restore button state
            downloadBtn.innerHTML = originalText;
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Sorry, there was an error generating the image. Please try again.');
        }
    });
}); 