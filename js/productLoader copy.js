// Product loader module
export class ProductLoader {
    constructor() {
        this.productId = new URLSearchParams(window.location.search).get('id');
        this.imageLoaded = false; // Track if product image is loaded
    }

    // Handle image path (local or remote)
    getImagePath(imagePath) {
        if (!imagePath) return '';
        
        // Check if the path is a URL
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        // Handle local path - ensure it starts from root
        return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    }

    async loadProductData() {
        try {
            this.showLoading();

            if (!this.productId) {
                throw new Error('Product ID not provided');
            }

            const response = await fetch('products_info.json');
            const products = await response.json();
            const product = products.find(p => p.id === this.productId);

            if (!product) {
                throw new Error('Product not found');
            }

            await this.updateProductInfo(product);
            this.showProduct();

        } catch (error) {
            this.showError(error.message);
        }
    }

    async updateProductInfo(product) {
        // Update basic info
        document.getElementById('productName').textContent = product.product_name;
        
        // Handle image loading with error handling and promise
        const imageLoadPromise = new Promise((resolve) => {
            const productImage = document.getElementById('productImage');
            
            // Set crossOrigin for remote images
            if (product.product_image.startsWith('http')) {
                productImage.crossOrigin = 'anonymous';
            }
            
            productImage.onload = () => {
                this.imageLoaded = true;
                console.log('Product image loaded successfully');
                resolve(true);
            };
            
            productImage.onerror = () => {
                console.error('Failed to load image:', product.product_image);
                // Try alternative path if the first attempt fails
                const altPath = product.product_image.startsWith('/') ? 
                    product.product_image.slice(1) : 
                    `/${product.product_image}`;
                    
                productImage.onerror = () => {
                    console.error('Failed to load image with alternative path:', altPath);
                    productImage.src = '/images/placeholder.png';
                    this.imageLoaded = true;
                    resolve(false);
                };
                productImage.src = altPath;
            };
            
            const imagePath = this.getImagePath(product.product_image);
            console.log('Loading image from:', imagePath); // Debug log
            productImage.src = imagePath;
        });
        
        // Update nutrition facts
        const nutrition = product.nutrition_facts;
        this.updateNutritionFacts(nutrition);

        // Update other information
        document.getElementById('origin').textContent = product.origin;
        this.displayTariffInfo(product.tariff_info);
        document.getElementById('additives').textContent = product.additives_harmful_ingredients;
        
        // Update dates
        document.getElementById('productionDate').textContent = this.formatDate(product.timestamp.production_date);
        document.getElementById('expirationDate').textContent = this.formatDate(product.timestamp.expiration_date);

        // Update certifications
        this.updateCertifications(product.certifications);

        // Update badges
        this.updateBadges(product);
        
        // Wait for image to load
        await imageLoadPromise;
    }

    updateNutritionFacts(nutrition) {
        const nutritionFields = {
            'ServingSize': 'serving_size',
            'Calories': 'calories',
            'TotalFat': 'total_fat',
            'SaturatedFat': 'saturated_fat',
            'Sodium': 'sodium',
            'Carbohydrates': 'carbohydrates',
            'Protein': 'protein',
            'Fiber': 'fiber',
            'Sugar': 'sugar',
            'Calcium': 'calcium',
            'Iron': 'iron',
            'VitaminD': 'vitamin_d',
            'Warning': 'warning'
        };

        const nutritionFactsContainer = document.getElementById('nutritionFacts');
        if (!nutritionFactsContainer) return;

        // Clear existing content
        nutritionFactsContainer.innerHTML = '';

        // Create and append nutrition fact elements
        for (const [elementId, dataKey] of Object.entries(nutritionFields)) {
            if (nutrition[dataKey]) {
                const div = document.createElement('div');
                div.className = 'p-2 border-b border-gray-200' + (elementId === 'warning' ? ' col-span-2' : '');
                
                const label = document.createElement('span');
                label.className = 'font-semibold';
                label.textContent = elementId.replace(/([A-Z])/g, ' $1').trim() + ':';
                
                const value = document.createElement('span');
                value.id = elementId;
                value.className = elementId === 'warning' ? 'text-red-600 ml-2' : 'ml-2';
                value.textContent = nutrition[dataKey];
                
                div.appendChild(label);
                div.appendChild(value);
                nutritionFactsContainer.appendChild(div);
            }
        }
    }

    updateCertifications(certifications) {
        const certificationsDiv = document.getElementById('certifications');
        // Add "Organic Certified" to certifications if the badge is visible
        const organicBadge = document.getElementById('organicBadge');
        if (organicBadge && organicBadge.style.display !== 'none') {
            certifications = [...certifications, 'Organic Certified'];
        }
        
        certificationsDiv.innerHTML = `<div class="flex flex-wrap gap-2">
            ${certifications.map(cert => 
                `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">${cert}</span>`
            ).join('')}
        </div>`;
        
        // Hide the original organic badge since it's now part of certifications
        if (organicBadge) {
            organicBadge.style.display = 'none';
        }
    }

    updateBadges(product) {
        document.getElementById('canadianBadge').style.display = product.is_100_canadian ? 'block' : 'none';
        document.getElementById('organicBadge').style.display = product.organic_certified ? 'block' : 'none';
        document.getElementById('verifiedSellerBadge').style.display = product.is_provided_by_verified_seller ? 'block' : 'none';
        
        // Update certifications after setting badge visibility
        this.updateCertifications(product.certifications || []);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-CA');
    }

    displayTariffInfo(tariff) {
        if (!tariff) return;
        
        const tariffDetails = document.getElementById('tariffDetails');
        if (!tariffDetails) return;

        // Format tariff information
        const tariffInfo = Array.isArray(tariff) ? tariff : [tariff];
        
        const tariffHTML = tariffInfo.map(item => {
            const rateValue = typeof item === 'object' ? item.rate : item;
            const rateText = rateValue.toLowerCase().includes('duty-free') ? 
                'Duty-free (Canadian product)' : rateValue;
            
            return `<div class="flex items-center py-1">
                <span class="font-medium">Rate:</span>
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm ml-2">${rateText}</span>
            </div>`;
        }).join('');

        tariffDetails.innerHTML = tariffHTML || '<div class="flex items-center py-1"><span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">No tariff information available</span></div>';
    }

    showLoading() {
        document.getElementById('loadingState').classList.remove('hidden');
        document.getElementById('productInfo').classList.add('hidden');
        document.getElementById('errorState').classList.add('hidden');
    }

    showError(message) {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('productInfo').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
        document.getElementById('errorState').querySelector('h2').textContent = message;
    }

    showProduct() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('productInfo').classList.remove('hidden');
        document.getElementById('errorState').classList.add('hidden');
    }
} 