// Settings
const fontName = "Verdana";
const textureFontSize = 250;

// String to show
let string = "Some text\nto sample\nwith Canvas";

// Create a single canvas for drawing everything
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// ---------------------------------------------------------------

// Run the main function to draw the text and dots
drawTextWithDots();

// ---------------------------------------------------------------

function drawTextWithDots() {
  // 1. PARSE TEXT AND CALCULATE DIMENSIONS
  const lines = string.split(`\n`);
  // Find the longest line to set the canvas width accurately
  const linesMaxLength = [...lines].sort((a, b) => b.length - a.length)[0]
    .length;
  // Set canvas dimensions based on text properties
  const canvasWidth = textureFontSize * 0.7 * linesMaxLength;
  const canvasHeight = lines.length * textureFontSize;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 2. DRAW THE ORIGINAL TEXT
  // This will serve as the background and the source for sampling
  ctx.font = "100 " + textureFontSize + "px " + fontName;
  ctx.fillStyle = "#000000"; // Original text color
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const linesNumber = lines.length;
  for (let i = 0; i < linesNumber; i++) {
    // We adjust the Y position to make it look vertically centered and aligned
    ctx.fillText(lines[i], 0, ((i + 0.8) * canvasHeight) / linesNumber);
  }

  // 3. SAMPLE COORDINATES FROM THE DRAWN TEXT
  const textureCoordinates = [];
  const samplingStep = 12; // Check every 4th pixel to improve performance

  if (canvasWidth > 0) {
    // Get the pixel data from the canvas where the text was just drawn
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Iterate over the image data, skipping pixels by `samplingStep`
    for (let y = 0; y < canvas.height; y += samplingStep) {
      for (let x = 0; x < canvas.width; x += samplingStep) {
        // The data is stored in a flat array [R, G, B, A, R, G, B, A, ...].
        // We calculate the index for the alpha channel of the current pixel.
        const alphaIndex = (y * canvas.width + x) * 4 + 3;
        
        // If the pixel is not transparent (alpha > 0), it's part of the text.
        if (imageData.data[alphaIndex] > 0) {
          textureCoordinates.push({ x: x, y: y });
        }
      }
    }
  }

  // 4. DRAW THE DOTS ON TOP OF THE EXISTING TEXT
  // Note: We do NOT clear the canvas here.
  ctx.fillStyle = "#e76f51"; // A contrasting color for the dots
  for (let i = 0; i < textureCoordinates.length; i++) {
    ctx.beginPath();
    ctx.arc(
      textureCoordinates[i].x,
      textureCoordinates[i].y,
      1.5, // Made dots slightly larger to be more visible
      0,
      Math.PI * 2,
      true
    );
    ctx.closePath();
    ctx.fill();
  }
}