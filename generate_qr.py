import qrcode
import json
from pathlib import Path

def generate_qr_codes(base_url="https://your-site-name.netlify.app"):  # Replace with your Netlify domain
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
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=20,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        # Generate QR code image
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # Use product ID as filename
        output_path = output_dir / f"{product_id}_{product_name.lower().replace(' ', '_')}_qr.png"
        qr_image.save(output_path, "PNG", quality=95, optimize=False)
        print(f"Generated QR code: {output_path.name} -> {url}")

if __name__ == "__main__":
    # Replace with your Netlify domain
    WEBSITE_URL = "https://your-site-name.netlify.app"  # Replace with your actual domain
    generate_qr_codes(WEBSITE_URL) 