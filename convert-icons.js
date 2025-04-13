const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function convertSvgToPng(svgPath, sizes) {
  try {
    // Read the SVG file
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Create a data URL from the SVG content
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
    
    // Load the SVG image
    const image = await loadImage(svgDataUrl);
    
    // Convert to different sizes
    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0, size, size);
      
      // Get the PNG buffer
      const pngBuffer = canvas.toBuffer('image/png');
      
      // Write the PNG file
      const outputPath = path.join(path.dirname(svgPath), `icon${size}.png`);
      fs.writeFileSync(outputPath, pngBuffer);
      
      console.log(`Created ${outputPath}`);
    }
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  }
}

// Convert the icon to different sizes
const svgPath = path.join(__dirname, 'assets', 'icons', 'icon.svg');
convertSvgToPng(svgPath, [16, 48, 128]);
