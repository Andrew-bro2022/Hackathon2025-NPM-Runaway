// Product loader module
export class ProductLoader {
    constructor() {
        this.productId = new URLSearchParams(window.location.search).get('id');
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

            this.updateProductInfo(product);
            this.showProduct();

        } catch (error) {
            this.showError(error.message);
        }
    }

    updateProductInfo(product) {
        // Update basic info
        document.getElementById('productName').textContent = product.product_name;
        document.getElementById('productImage').src = product.product_image;
        
        // Update nutrition facts
        const nutrition = product.nutrition_facts;
        this.updateNutritionFacts(nutrition);

        // Update other information
        document.getElementById('origin').textContent = product.origin;
        document.getElementById('tariff').textContent = product.tariff_info;
        document.getElementById('additives').textContent = product.additives_harmful_ingredients;
        
        // Update dates
        document.getElementById('productionDate').textContent = this.formatDate(product.timestamp.production_date);
        document.getElementById('expirationDate').textContent = this.formatDate(product.timestamp.expiration_date);

        // Update certifications
        this.updateCertifications(product.certifications);

        // Update badges
        this.updateBadges(product);
    }

    updateNutritionFacts(nutrition) {
        const nutritionFields = {
            'servingSize': 'serving_size',
            'calories': 'calories',
            'totalFat': 'total_fat',
            'saturatedFat': 'saturated_fat',
            'sodium': 'sodium',
            'carbohydrates': 'carbohydrates',
            'protein': 'protein',
            'fiber': 'fiber',
            'sugar': 'sugar',
            'calcium': 'calcium',
            'iron': 'iron',
            'vitaminD': 'vitamin_d',
            'warning': 'warning'
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
        certificationsDiv.innerHTML = certifications.map(cert => 
            `<div class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">${cert}</div>`
        ).join('');
    }

    updateBadges(product) {
        document.getElementById('canadianBadge').style.display = product.is_100_canadian ? 'block' : 'none';
        document.getElementById('organicBadge').style.display = product.organic_certified ? 'block' : 'none';
        document.getElementById('verifiedSellerBadge').style.display = product.is_provided_by_verified_seller ? 'block' : 'none';
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-CA');
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