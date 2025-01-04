// Select the canvas and button elements
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
const saveButton = document.getElementById('save');
const drawButton = document.getElementById('draw');

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

// Add event listener to the button
const draw = function() {
  const wx     = canvas.width;
  const wy     = canvas.height;
  const neq    = 14; //number of equations
  const ntile  = neq*2;
  const margin = 100;
  //floor
  let   tx     = Math.floor((wx-2*margin)/ntile);
  let   ty     = Math.floor((wy-2*margin)/ntile);
  if(tx>ty){
    tx = ty;
  }else{
    ty = tx;
  }
  const bx     = tx*ntile;
  const by     = ty*ntile;
  //draw a background
  context.fillStyle = 'white';
  context.fillRect(0, 0, wx, wy);
  //draw a brock
  context.strokeStyle = 'black';
  context.strokeRect(margin, margin, bx, by);
  //draw axes number
  let fontsize = Math.floor(tx/2);
  context.font = fontsize + 'px Arial';
  context.textAlign    = 'center';
  context.textBaseline = 'middle';
  context.fillStyle    = 'black';
  for(let i=0; i<ntile; i++){
    //x axis at bottom
    context.fillText(i, margin+tx*i+fontsize, margin+by+fontsize);
    //y axis at left, flip ud
    context.fillText(i, margin-fontsize, margin+by-ty*i-fontsize);
  }
  //draw a path
  context.beginPath();
  context.moveTo(margin+tx, margin+ty);
  for(let i=0; i<neq; i++){
    context.lineTo(margin+tx*(i*2+1), margin+ty*(i*2+1));
  }
}
drawButton.addEventListener('click', draw);

window.onload = function() {
  resize();
}
const resize = () => {
  const mx = 20;
  const my = 100;
  canvas.width  = window.innerWidth  - 2*mx;
  canvas.height = window.innerHeight - 2*my;
  draw();
}
window.addEventListener('resize', resize);

