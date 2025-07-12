#!/bin/bash

# QuickThrift PWA Icon Generator
# This script creates basic PWA icons from the demo image

echo "🎨 Generating QuickThrift PWA Icons..."

# Check if ImageMagick is available
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Creating placeholder icons..."
    
    # Create simple colored squares as placeholders
    sizes=(72 96 128 144 152 192 384 512)
    
    for size in "${sizes[@]}"; do
        # Create a simple colored square using CSS/Canvas fallback
        echo "📱 Creating icon-${size}x${size}.png (placeholder)"
        
        # For now, copy demo1.jpeg and rename as placeholder
        if [ -f "demo1.jpeg" ]; then
            cp demo1.jpeg "icons/icon-${size}x${size}.png"
        else
            # Create empty placeholder
            touch "icons/icon-${size}x${size}.png"
        fi
    done
    
    # Create apple-touch-icon
    if [ -f "demo1.jpeg" ]; then
        cp demo1.jpeg "icons/apple-touch-icon.png"
    else
        touch "icons/apple-touch-icon.png"
    fi
    
    echo "✅ Placeholder icons created!"
    echo "📝 Note: Replace with proper icons using a tool like:"
    echo "   - https://realfavicongenerator.net/"
    echo "   - https://www.pwabuilder.com/"
    
else
    echo "🎉 ImageMagick found! Generating proper icons..."
    
    # Use demo1.jpeg as source
    source_image="demo1.jpeg"
    
    if [ ! -f "$source_image" ]; then
        echo "❌ Source image $source_image not found!"
        exit 1
    fi
    
    # Generate icons
    sizes=(72 96 128 144 152 192 384 512)
    
    for size in "${sizes[@]}"; do
        echo "📱 Creating icon-${size}x${size}.png"
        convert "$source_image" -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" "icons/icon-${size}x${size}.png"
    done
    
    # Create apple-touch-icon (180x180)
    echo "🍎 Creating apple-touch-icon.png"
    convert "$source_image" -resize "180x180" -background white -gravity center -extent "180x180" "icons/apple-touch-icon.png"
    
    echo "✅ All icons generated successfully!"
fi

echo "🎯 PWA icons ready for QuickThrift!"
