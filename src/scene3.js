export function generateAnchorPoints(fontName, fontSize, samplingStep, text) {
  // Settings
  // const fontName = "Verdana";
  // const fontSize = 600;
  // const samplingStep = 28;
  // let text = "Hello!";

  // Create a single canvas for drawing everything
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);

  // ---------------------------------------------------------------

  // Run the main function to draw the text and dots
  const textureCoordinates = drawTextWithDots();

  // ---------------------------------------------------------------

  function drawTextWithDots() {
    // 1. PARSE TEXT AND CALCULATE DIMENSIONS
    const lines = text.split(`\n`);
    // Find the longest line to set the canvas width accurately
    const linesMaxLength = [...lines].sort((a, b) => b.length - a.length)[0].length;
    // Set canvas dimensions based on text properties
    const canvasWidth = fontSize * 0.7 * linesMaxLength;
    const canvasHeight = lines.length * fontSize;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 2. DRAW THE ORIGINAL TEXT
    ctx.font = "100 " + fontSize + "px " + fontName; // css shorthand
    ctx.fillStyle = "#ffffff"; // keep it same as background as its not visible
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const linesNumber = lines.length;
    for (let i = 0; i < linesNumber; i++) {
      ctx.fillText(lines[i], 0, ((i + 0.8) * canvasHeight) / linesNumber);
    }

    // 3. SAMPLE COORDINATES FROM THE DRAWN TEXT
    const textureCoordinates = [];

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
        2, // Made dots slightly larger to be more visible
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.fill();
    }
    return textureCoordinates;
  }

  //remove the canvas as we'll make a fresh one with three js
  canvas.remove();

  return textureCoordinates;
}