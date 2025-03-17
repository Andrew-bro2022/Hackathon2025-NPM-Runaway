import qrcode
import json
from pathlib import Path

def generate_qr_codes(base_url="https://product2025info.netlify.app"):  # Your actual Netlify domain
    # Create output directory
    output_dir = Path("qr_codes")
    output_dir.mkdir(exist_ok=True)
    
    # Read product data
    with open("products_info.json", "r", encoding="utf-8") as f:
        products = json.load(f)
    
    # Generate QR code for each product
    for product in products:
        product_id = product["id"]
        product_name = product["product_name"]
        # Use product ID as URL parameter
        url = f"{base_url}?id={product_id}"
        
        # Create high-quality QR code
        qr = qrcode.QRCode(
            version=None,  # Auto-select best version
            error_correction=qrcode.constants.ERROR_CORRECT_H,  # Highest error correction
            box_size=20,  # Larger QR code
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        # Generate QR code image
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # Save QR code with product ID and name
        output_path = output_dir / f"{product_id}_{product_name.lower().replace(' ', '_')}_qr.png"
        qr_image.save(output_path, "PNG", quality=95, optimize=False)
        print(f"Generated QR code: {output_path.name}")
        print(f"Scanning this QR code will redirect to: {url}")

if __name__ == "__main__":
    # Use the actual Netlify domain
    WEBSITE_URL = "https://product2025info.netlify.app"
    generate_qr_codes(WEBSITE_URL)
    print("\nAll QR codes have been generated in the 'qr_codes' directory.")
    print("Test the QR codes by scanning them with your phone's camera.")