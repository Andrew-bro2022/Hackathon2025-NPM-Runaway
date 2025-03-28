# Canadian Product Information QR Code System

A web-based system for displaying Canadian product information via QR codes.

## Features

- Dynamic product information display
- QR code generation for each product
- Detailed nutrition facts
- Origin and certification information
- Mobile-friendly design

## Project Structure

```
.
├── index.html              # Main website
├── products_info.json      # Product database
├── generate_qr.py         # QR code generator script
└── netlify.toml           # Netlify configuration
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Install Python dependencies (for QR code generation):
```bash
pip install -r requirements.txt
```

3. Generate QR codes:
```bash
python generate_qr.py
```

## Deployment

This project is configured for deployment on Netlify:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Deploy with the following settings:
   - Build command: None required
   - Publish directory: Root directory

## Local Development

To test locally, you can use Python's built-in server:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

## License

MIT License
