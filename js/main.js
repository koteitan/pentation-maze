// Select the canvas and button elements
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
const saveButton = document.getElementById('saveButton');

// Draw a circle on the canvas
context.beginPath();
context.arc(200, 200, 100, 0, Math.PI * 2, false); // Circle parameters: (x, y, radius, startAngle, endAngle)
context.fillStyle = 'blue'; // Fill color
context.fill(); // Fill the circle
context.lineWidth = 5; // Border width
context.strokeStyle = 'black'; // Border color
context.stroke(); // Draw the border

// Add event listener to the button
saveButton.addEventListener('click', () => {
    // Convert canvas content to a data URL (base64-encoded PNG)
    const image = canvas.toDataURL('image/png');

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = image; // Set the link href to the data URL
    link.download = 'canvas-image.png'; // Set the default file name

    // Simulate a click on the link to trigger download
    link.click();
});

