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
            
            // Take the screenshot with enhanced configuration
            document.getElementById('processStep').textContent = "Generating screenshot...";
            const canvas = await html2canvas(productCard, {
                scale: 2, // Higher quality
                useCORS: true, // Allow loading cross-origin images
                allowTaint: true, // Allow tainted canvas
                backgroundColor: backgroundColor,
                logging: true, // Enable logging for debugging
                imageTimeout: 0, // No timeout for image loading
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

                    // 设置主容器背景
                    const productCard = clonedDoc.getElementById('productCard');
                    if (productCard) {
                        productCard.style.backgroundColor = cardBgColor;
                        productCard.style.opacity = '1';
                    }

                    // 设置所有信息区块的背景
                    const sections = clonedDoc.querySelectorAll('.info-section');
                    sections.forEach(section => {
                        // 根据section的类名决定使用哪个背景色
                        let bgColor = mainBgColor;
                        Object.entries(sectionBgColors).forEach(([className, color]) => {
                            if (section.classList.contains(className)) {
                                bgColor = color;
                            }
                        });
                        section.style.backgroundColor = bgColor;
                        section.style.opacity = '1';
                    });

                    // 确保所有徽章可见且有正确的背景色
                    const badges = clonedDoc.querySelectorAll('.badge');
                    badges.forEach(badge => {
                        badge.style.opacity = '1';
                        // 保持徽章原有的背景色，但确保不透明
                        if (!badge.style.backgroundColor) {
                            badge.style.backgroundColor = isDarkMode ? '#4B5563' : '#E5E7EB';
                        }
                    });

                    // 处理产品图片容器
                    const imageContainer = clonedDoc.querySelector('.product-image-container');
                    if (imageContainer) {
                        imageContainer.style.backgroundColor = cardBgColor;
                        imageContainer.style.opacity = '1';
                    }

                    // 添加全局样式以防止任何透明度
                    const style = clonedDoc.createElement('style');
                    style.textContent = `
                        * {
                            opacity: 1 !important;
                            transition: none !important;
                        }
                        .info-section {
                            border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
                        }
                    `;
                    clonedDoc.head.appendChild(style);

                    // 确保内容可见性
                    const clonedProductInfo = clonedDoc.getElementById('productInfo');
                    if (clonedProductInfo) {
                        clonedProductInfo.classList.remove('hidden');
                    }

                    // 隐藏加载和错误状态
                    const loadingState = clonedDoc.getElementById('loadingState');
                    const errorState = clonedDoc.getElementById('errorState');
                    if (loadingState) loadingState.classList.add('hidden');
                    if (errorState) errorState.classList.add('hidden');

                    // 应用暗模式样式
                    if (isDarkMode) {
                        clonedDoc.body.classList.add('dark-mode');
                    }
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