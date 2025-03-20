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

            // Get the product card and ensure it's visible
            const productCard = document.getElementById('productCard');
            const productInfo = document.getElementById('productInfo');
            
            // Save original visibility state
            const productInfoWasHidden = productInfo.classList.contains('hidden');
            
            // Make sure product info is visible
            if (productInfoWasHidden) {
                productInfo.classList.remove('hidden');
            }
            
            // Prepare the document for screenshot
            // First fix any cross-origin issues with images
            const images = productCard.querySelectorAll('img');
            images.forEach(img => {
                if (img.src.startsWith('http')) {
                    img.setAttribute('crossorigin', 'anonymous');
                }
            });
            
            // Wait for all images to be fully loaded
            await Promise.all(Array.from(images).filter(img => !img.complete).map(img => {
                return new Promise(resolve => {
                    // Set both onload and onerror to resolve the promise
                    img.onload = resolve;
                    img.onerror = resolve; // Continue even if image fails to load
                });
            }));
            
            // Add additional delay to ensure rendering is complete
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Get current theme for proper background color
            const isDarkMode = document.body.classList.contains('dark-mode');
            const backgroundColor = isDarkMode ? '#1F2937' : '#F3F4F6';
            
            // Take the screenshot with enhanced configuration
            const canvas = await html2canvas(productCard, {
                scale: 2, // Higher quality
                useCORS: true, // Allow loading cross-origin images
                allowTaint: true, // Allow tainted canvas
                backgroundColor: backgroundColor,
                logging: true, // Enable logging for debugging
                imageTimeout: 0, // No timeout for image loading
                onclone: (clonedDoc) => {
                    // In the cloned document, make sure everything is visible
                    const clonedProductInfo = clonedDoc.getElementById('productInfo');
                    clonedProductInfo.classList.remove('hidden');
                    
                    // Hide loading and error states
                    const loadingState = clonedDoc.getElementById('loadingState');
                    const errorState = clonedDoc.getElementById('errorState');
                    if (loadingState) loadingState.classList.add('hidden');
                    if (errorState) errorState.classList.add('hidden');
                    
                    // Make all badges visible
                    const badges = clonedDoc.querySelectorAll('.badge');
                    badges.forEach(badge => {
                        const parent = badge.closest('div');
                        if (parent && parent.classList.contains('hidden')) {
                            parent.classList.remove('hidden');
                        }
                    });
                    
                    // Apply dark mode styles to cloned document if needed
                    if (isDarkMode) {
                        clonedDoc.body.classList.add('dark-mode');
                    }
                }
            });
            
            // Restore original state
            if (productInfoWasHidden) {
                productInfo.classList.add('hidden');
            }
            
            // Convert canvas to image and download
            const image = canvas.toDataURL('image/png', 1.0); // Use highest quality
            const link = document.createElement('a');
            const productName = document.getElementById('productName').textContent || 'product';
            const fileName = `${productName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_info.png`;
            
            link.href = image;
            link.download = fileName;
            link.click();
            
            // Restore download button
            downloadBtn.innerHTML = originalText;
            
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Sorry, there was an error generating the image. Please try again later.');
            
            // Restore download button even on error
            const downloadBtn = document.getElementById('downloadBtn');
            downloadBtn.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download Product Info
            `;
        }
    });
}); 