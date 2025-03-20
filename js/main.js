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
                <span id="processStep">Loading product info...</span>
            `;

            // Get the product card and ensure it's visible
            const productCard = document.getElementById('productCard');
            const productInfo = document.getElementById('productInfo');
            const productContainer = document.querySelector('.container'); // Parent container
            
            // Save original states
            const productInfoWasHidden = productInfo.classList.contains('hidden');
            const originalCardStyle = productCard.getAttribute('style') || '';
            const originalContainerStyle = productContainer.getAttribute('style') || '';
            const originalBodyClass = document.body.className;
            
            // Make sure product info is visible
            if (productInfoWasHidden) {
                productInfo.classList.remove('hidden');
            }
            
            // Temporarily stop scrolling
            document.body.style.overflow = 'hidden';
            
            // Prepare the document for screenshot
            document.getElementById('processStep').textContent = "Preparing image resources...";
            
            // Add padding to ensure everything fits
            productCard.style.padding = '1.5rem';
            
            // First fix any cross-origin issues with images
            const images = productCard.querySelectorAll('img');
            images.forEach(img => {
                if (img.src.startsWith('http')) {
                    img.setAttribute('crossorigin', 'anonymous');
                }
                // Remove skeleton loading class if present
                img.classList.remove('skeleton-loading');
            });
            
            // Wait for all images to be fully loaded
            document.getElementById('processStep').textContent = "Loading images...";
            await Promise.all(Array.from(images).filter(img => !img.complete).map(img => {
                return new Promise(resolve => {
                    // Set both onload and onerror to resolve the promise
                    img.onload = resolve;
                    img.onerror = resolve; // Continue even if image fails to load
                });
            }));
            
            // Add additional delay to ensure rendering is complete
            document.getElementById('processStep').textContent = "Waiting for animations...";
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Temporarily disable animations and transitions
            document.getElementById('processStep').textContent = "Preparing screenshot...";
            
            // Create a high-contrast style element for screenshot
            const screenshotStyles = document.createElement('style');
            screenshotStyles.id = 'screenshot-styles';
            screenshotStyles.textContent = `
                /* Reset animations and transitions */
                .screenshot-mode * {
                    animation: none !important;
                    transition: none !important;
                    opacity: 1 !important;
                    box-shadow: none !important;
                }
                
                /* Force solid backgrounds for all sections */
                .screenshot-mode #productCard {
                    background-color: white !important;
                    border: none !important;
                    box-shadow: none !important;
                }
                
                /* Common styles for info sections */
                .screenshot-mode .info-section {
                    background-color: white !important;
                    border: 1px solid rgba(0, 0, 0, 0.2) !important;
                    margin-bottom: 1rem !important;
                }
                
                /* Individual section backgrounds */
                .screenshot-mode .bg-green-50 {
                    background-color: rgb(240, 253, 244) !important;
                }
                .screenshot-mode .bg-yellow-50 {
                    background-color: rgb(254, 252, 232) !important;
                }
                .screenshot-mode .bg-blue-50 {
                    background-color: rgb(239, 246, 255) !important;
                }
                .screenshot-mode .bg-gray-50 {
                    background-color: rgb(249, 250, 251) !important;
                }
                .screenshot-mode .bg-purple-50 {
                    background-color: rgb(245, 243, 255) !important;
                }
                
                /* Badge backgrounds */
                .screenshot-mode .bg-blue-100 {
                    background-color: rgb(219, 234, 254) !important;
                }
                .screenshot-mode .bg-yellow-100 {
                    background-color: rgb(254, 249, 195) !important;
                }
                .screenshot-mode .bg-red-600 {
                    background-color: rgb(220, 38, 38) !important;
                }
                .screenshot-mode .bg-green-600 {
                    background-color: rgb(22, 163, 74) !important;
                }
                
                /* Text colors */
                .screenshot-mode .text-gray-700 {
                    color: rgb(55, 65, 81) !important;
                }
                .screenshot-mode .text-gray-800 {
                    color: rgb(31, 41, 55) !important;
                }
                .screenshot-mode .text-blue-800 {
                    color: rgb(30, 64, 175) !important;
                }
                .screenshot-mode .text-white {
                    color: white !important;
                }
                
                /* Special elements */
                .screenshot-mode .badge {
                    display: inline-flex !important;
                    align-items: center !important;
                    padding: 0.25rem 0.75rem !important;
                    border-radius: 9999px !important;
                    font-weight: 500 !important;
                }
                
                /* Dark mode overrides */
                .screenshot-mode.dark-mode {
                    background-color: #1F2937 !important;
                    color: white !important;
                }
                .screenshot-mode.dark-mode #productCard {
                    background-color: #374151 !important;
                }
                .screenshot-mode.dark-mode .info-section {
                    background-color: #4B5563 !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                }
                .screenshot-mode.dark-mode .text-gray-800 {
                    color: white !important;
                }
                .screenshot-mode.dark-mode .text-gray-700 {
                    color: rgb(229, 231, 235) !important;
                }
            `;
            document.head.appendChild(screenshotStyles);
            
            // Add the screenshot mode class
            productCard.classList.add('screenshot-mode');
            
            // Remove all animated classes to ensure stable rendering
            const animatedElements = productCard.querySelectorAll('.animate__animated');
            animatedElements.forEach(el => {
                el.classList.remove('animate__animated');
                el.classList.remove('animate__fadeIn', 'animate__fadeInUp', 'animate__fadeInDown', 'animate__fadeInLeft', 'animate__fadeInRight');
            });
            
            // Pre-process specific elements that might cause rendering issues
            const nutritionFacts = document.getElementById('nutritionFacts');
            if (nutritionFacts) {
                nutritionFacts.querySelectorAll('.border-b').forEach(el => {
                    el.style.borderBottomColor = 'rgba(0,0,0,0.2)';
                    el.style.borderBottomWidth = '1px';
                    el.style.borderBottomStyle = 'solid';
                });
            }
            
            // Fix any transparency issues in the container
            productContainer.style.backgroundColor = 'transparent';
            document.body.style.backgroundColor = isDarkMode ? '#1F2937' : '#FFFFFF';
            
            // Force reflow to apply all style changes
            void productCard.offsetHeight; 
            
            // Additional delay to ensure everything is stable
            await new Promise(resolve => setTimeout(resolve, 2000)); // Increased to 2 seconds
            
            // Get current theme for proper background color
            const isDarkMode = document.body.classList.contains('dark-mode');
            const backgroundColor = isDarkMode ? '#1F2937' : '#FFFFFF'; // Use pure white/dark
            
            // Take the screenshot with enhanced configuration
            document.getElementById('processStep').textContent = "Generating screenshot...";
            
            // First make a pre-render to force layout calculations
            await html2canvas(productCard, { 
                scale: 1,
                logging: false,
                backgroundColor: 'transparent',
                onclone: () => {} 
            });
            
            // Now take the actual screenshot
            const canvas = await html2canvas(productCard, {
                scale: 2, // Higher quality
                useCORS: true, // Allow loading cross-origin images
                allowTaint: true, // Allow tainted canvas
                backgroundColor: backgroundColor,
                removeContainer: false, // Keep container to preserve layout
                logging: true, // Enable logging for debugging
                imageTimeout: 0, // No timeout for image loading
                letterRendering: true, // Improve text rendering
                foreignObjectRendering: false, // Avoid issues with foreignObject rendering
                onclone: (clonedDoc) => {
                    // In the cloned document, make sure everything is visible and stable
                    const clonedProductCard = clonedDoc.getElementById('productCard');
                    clonedProductCard.classList.add('screenshot-mode');
                    if (isDarkMode) {
                        clonedProductCard.classList.add('dark-mode');
                        clonedDoc.body.classList.add('dark-mode');
                    }
                    
                    // Force solid backgrounds for all elements
                    const sections = clonedDoc.querySelectorAll('.info-section');
                    sections.forEach(section => {
                        // Make background solid by forcing high opacity
                        const computedStyle = window.getComputedStyle(section);
                        let bgColor = computedStyle.backgroundColor;
                        
                        // If it has transparency, make it solid
                        if (bgColor.includes('rgba')) {
                            // Convert rgba to rgb with full opacity
                            bgColor = bgColor.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, 'rgb($1,$2,$3)');
                            section.style.backgroundColor = bgColor;
                        }
                        
                        // Ensure text is fully opaque
                        section.style.color = isDarkMode ? '#FFFFFF' : '#000000';
                        
                        // On mobile ensure consistent rendering
                        section.style.display = 'block';
                        section.style.width = '100%';
                    });
                    
                    // Make product info visible
                    const clonedProductInfo = clonedDoc.getElementById('productInfo');
                    clonedProductInfo.classList.remove('hidden');
                    clonedProductInfo.style.opacity = '1';
                    clonedProductInfo.style.display = 'block';
                    
                    // Hide loading and error states
                    const loadingState = clonedDoc.getElementById('loadingState');
                    const errorState = clonedDoc.getElementById('errorState');
                    if (loadingState) loadingState.classList.add('hidden');
                    if (errorState) errorState.classList.add('hidden');
                    
                    // Make all badges visible with solid colors
                    const badges = clonedDoc.querySelectorAll('.badge');
                    badges.forEach(badge => {
                        const parent = badge.closest('div');
                        if (parent && parent.classList.contains('hidden')) {
                            parent.classList.remove('hidden');
                        }
                        // Ensure badge colors are solid
                        badge.style.opacity = '1';
                        
                        // Force badge colors based on class
                        if (badge.classList.contains('bg-red-600')) {
                            badge.style.backgroundColor = 'rgb(220, 38, 38)';
                            badge.style.color = 'white';
                        } else if (badge.classList.contains('bg-green-600')) {
                            badge.style.backgroundColor = 'rgb(22, 163, 74)';
                            badge.style.color = 'white';
                        } else if (badge.classList.contains('bg-blue-100')) {
                            badge.style.backgroundColor = 'rgb(219, 234, 254)';
                            badge.style.color = 'rgb(30, 64, 175)';
                        }
                    });
                    
                    // Ensure certifications are visible
                    const certs = clonedDoc.getElementById('certifications');
                    if (certs) {
                        const certSpans = certs.querySelectorAll('span');
                        certSpans.forEach(span => {
                            span.style.backgroundColor = 'rgb(219, 234, 254)';
                            span.style.color = 'rgb(30, 64, 175)';
                            span.style.padding = '0.25rem 0.5rem';
                            span.style.borderRadius = '0.25rem';
                            span.style.display = 'inline-block';
                            span.style.margin = '0.25rem';
                        });
                    }
                }
            });
            
            // Restore original states
            if (productInfoWasHidden) {
                productInfo.classList.add('hidden');
            }
            
            // Remove screenshot styles
            productCard.classList.remove('screenshot-mode');
            const styles = document.getElementById('screenshot-styles');
            if (styles) {
                styles.remove();
            }
            
            // Restore original styles
            productCard.setAttribute('style', originalCardStyle);
            productContainer.setAttribute('style', originalContainerStyle);
            document.body.className = originalBodyClass;
            document.body.style.overflow = ''; // Restore scrolling
            
            // Restore animations
            animatedElements.forEach(el => {
                el.classList.add('animate__animated');
            });
            
            // Convert canvas to image and download
            document.getElementById('processStep').textContent = "Preparing download...";
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