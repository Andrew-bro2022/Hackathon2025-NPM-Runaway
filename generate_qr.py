import qrcode
import json
from pathlib import Path

def generate_qr_codes(base_url="https://your-site-name.netlify.app"):  # 替换为您的 Netlify 域名
    # 创建输出目录
    output_dir = Path("qr_codes")
    output_dir.mkdir(exist_ok=True)
    
    # 读取产品数据
    with open("products_info.json", "r", encoding="utf-8") as f:
        products = json.load(f)
    
    # 为每个产品生成QR码
    for product in products:
        product_id = product["id"]
        product_name = product["product_name"]
        # 使用产品ID作为URL参数
        url = f"{base_url}?id={product_id}"
        
        # 创建高质量QR码
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=20,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        # 生成QR码图片
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # 使用产品ID作为文件名
        output_path = output_dir / f"{product_id}_{product_name.lower().replace(' ', '_')}_qr.png"
        qr_image.save(output_path, "PNG", quality=95, optimize=False)
        print(f"已生成QR码: {output_path.name} -> {url}")

if __name__ == "__main__":
    # 在这里替换为您的 Netlify 域名
    WEBSITE_URL = "https://your-site-name.netlify.app"  # 替换为您获得的实际域名
    generate_qr_codes(WEBSITE_URL) 