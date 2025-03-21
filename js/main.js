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
            
            // Save original visibility state
            const productInfoWasHidden = productInfo.classList.contains('hidden');
            
            // Make sure product info is visible
            if (productInfoWasHidden) {
                productInfo.classList.remove('hidden');
            }
            
            // Prepare the document for screenshot
            // Update process status
            document.getElementById('processStep').textContent = "Preparing image resources...";
            
            // First fix any cross-origin issues with images
            const images = productCard.querySelectorAll('img');
            images.forEach(img => {
                if (img.src.startsWith('http')) {
                    img.setAttribute('crossorigin', 'anonymous');
                }
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
            
            // Temporarily disable animations
            document.getElementById('processStep').textContent = "Preparing screenshot...";
            const animatedElements = productCard.querySelectorAll('.animate__animated');
            animatedElements.forEach(el => {
                el.classList.remove('animate__animated');
                el.classList.remove('animate__fadeIn', 'animate__fadeInUp', 'animate__fadeInDown', 'animate__fadeInLeft', 'animate__fadeInRight');
            });
            
            // Additional delay to ensure everything is stable.
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Get current theme for proper background color
            const isDarkMode = document.body.classList.contains('dark-mode');
            const backgroundColor = isDarkMode ? '#1F2937' : '#F3F4F6';

            // Force a repaint before taking screenshot
            document.getElementById('processStep').textContent = "Preparing final render...";
            productCard.style.transform = 'translateZ(0)';
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Take the screenshot with enhanced configuration
            document.getElementById('processStep').textContent = "Generating screenshot...";
            const canvas = await html2canvas(productCard, {
                scale: 2, // Higher quality
                useCORS: true, // Allow loading cross-origin images
                allowTaint: true, // Allow tainted canvas
                backgroundColor: backgroundColor,
                logging: true, // Enable logging for debugging
                imageTimeout: 0, // No timeout for image loading
                removeContainer: false, // Prevent removal of the clone container
                onclone: (clonedDoc) => {
                    // 获取当前主题的背景色
                    const isDarkMode = document.body.classList.contains('dark-mode');
                    const mainBgColor = isDarkMode ? '#1F2937' : '#F3F4F6';
                    const cardBgColor = isDarkMode ? '#374151' : '#FFFFFF';
                    const sectionBgColors = {
                        'bg-green-50': isDarkMode ? 'rgba(34, 197, 94, 0.1)' : '#F0FDF4',
                        'bg-yellow-50': isDarkMode ? 'rgba(234, 179, 8, 0.1)' : '#FEFCE8',
                        'bg-blue-50': isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
                        'bg-gray-50': isDarkMode ? 'rgba(75, 85, 99, 0.1)' : '#F9FAFB',
                        'bg-purple-50': isDarkMode ? 'rgba(168, 85, 247, 0.1)' : '#FAF5FF'
                    };

                    // Force hardware acceleration and prevent any transitions
                    const forceRenderStyle = `
                        * {
                            -webkit-transform: translateZ(0);
                            -moz-transform: translateZ(0);
                            transform: translateZ(0);
                            -webkit-backface-visibility: hidden;
                            -moz-backface-visibility: hidden;
                            backface-visibility: hidden;
                            -webkit-perspective: 1000;
                            -moz-perspective: 1000;
                            perspective: 1000;
                            opacity: 1 !important;
                            transition: none !important;
                            animation: none !important;
                        }
                    `;

                    // 设置主容器背景
                    const productCard = clonedDoc.getElementById('productCard');
                    if (productCard) {
                        productCard.style.cssText = `
                            background-color: ${cardBgColor} !important;
                            opacity: 1 !important;
                            position: relative !important;
                            z-index: 1 !important;
                            transform: translateZ(0);
                        `;
                    }

                    // 设置所有信息区块的背景
                    const sections = clonedDoc.querySelectorAll('.info-section');
                    sections.forEach(section => {
                        let bgColor = mainBgColor;
                        Object.entries(sectionBgColors).forEach(([className, color]) => {
                            if (section.classList.contains(className)) {
                                bgColor = color;
                            }
                        });
                        section.style.cssText = `
                            background-color: ${bgColor} !important;
                            opacity: 1 !important;
                            position: relative !important;
                            z-index: 2 !important;
                        `;
                    });

                    // 确保所有徽章可见且有正确的背景色
                    const badges = clonedDoc.querySelectorAll('.badge');
                    badges.forEach(badge => {
                        const currentBg = window.getComputedStyle(badge).backgroundColor;
                        badge.style.cssText = `
                            background-color: ${currentBg || (isDarkMode ? '#4B5563' : '#E5E7EB')} !important;
                            opacity: 1 !important;
                            position: relative !important;
                            z-index: 3 !important;
                        `;
                    });

                    // 处理产品图片容器
                    const imageContainer = clonedDoc.querySelector('.product-image-container');
                    if (imageContainer) {
                        imageContainer.style.cssText = `
                            background-color: ${cardBgColor} !important;
                            opacity: 1 !important;
                            position: relative !important;
                            z-index: 2 !important;
                        `;
                    }

                    // 添加全局样式
                    const style = clonedDoc.createElement('style');
                    style.textContent = `
                        ${forceRenderStyle}
                        .info-section {
                            border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} !important;
                        }
                        #productCard * {
                            transform: translateZ(0);
                            backface-visibility: hidden;
                            perspective: 1000;
                        }
                    `;
                    clonedDoc.head.appendChild(style);

                    // 确保内容可见性
                    const clonedProductInfo = clonedDoc.getElementById('productInfo');
                    if (clonedProductInfo) {
                        clonedProductInfo.style.cssText = `
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        `;
                    }

                    // 隐藏加载和错误状态
                    const loadingState = clonedDoc.getElementById('loadingState');
                    const errorState = clonedDoc.getElementById('errorState');
                    if (loadingState) loadingState.style.display = 'none';
                    if (errorState) errorState.style.display = 'none';

                    // 应用暗模式样式
                    if (isDarkMode) {
                        clonedDoc.body.classList.add('dark-mode');
                    }

                    // 强制重绘
                    clonedDoc.body.offsetHeight;
                }
            });
            
            // Restore original state
            if (productInfoWasHidden) {
                productInfo.classList.add('hidden');
            }
            
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