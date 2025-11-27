"""
Compress all images in the exported directory to 80% quality
to improve loading performance for idk.html
"""
import os
from PIL import Image
from pathlib import Path

def compress_image(image_path, quality=80):
    """Compress a single image to specified quality"""
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary (for PNG with transparency)
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Save with reduced quality
            img.save(image_path, 'JPEG', quality=quality, optimize=True)
            return True
    except Exception as e:
        print(f"Error compressing {image_path}: {e}")
        return False

def compress_directory(directory, quality=80):
    """Recursively compress all images in a directory"""
    directory = Path(directory)
    image_extensions = {'.jpg', '.jpeg', '.JPG', '.JPEG'}
    
    compressed_count = 0
    total_count = 0
    
    print(f"Scanning {directory} for images...")
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if Path(file).suffix in image_extensions:
                total_count += 1
                image_path = Path(root) / file
                print(f"Compressing: {image_path}")
                
                if compress_image(image_path, quality):
                    compressed_count += 1
    
    print(f"\n✓ Compressed {compressed_count}/{total_count} images to {quality}% quality")

if __name__ == "__main__":
    exported_dir = "exported"
    
    if not os.path.exists(exported_dir):
        print(f"Error: '{exported_dir}' directory not found!")
        exit(1)
    
    print("=" * 50)
    print("Image Compression Tool")
    print("Quality: 80%")
    print("=" * 50)
    
    compress_directory(exported_dir, quality=80)
    
    print("\n✓ Compression complete! Images will now load faster in idk.html")
