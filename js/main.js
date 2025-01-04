const neq    = 14; //number of equations
const nprime =  8; //number of prime numbers
const blockers = [ //blockers[ie][ip]
// 2^a  3^b  5^c  7^d  11^e  13   17   19
   [1  , 0  , 1  , 0  , 0  ,  0  ,  0 ,  0],
   [0  , 1  , 1  , 0  , 0  ,  0  ,  0 ,  0],
   [0  , 0  , 1  , 1  , 0  ,  0  ,  0 ,  0],
   [0  , 1  , 0  , 0  , 0  ,  0  ,  0 ,  0],
   [0  , 0  , 0  , 1  , 1  ,  0  ,  0 ,  0],
   [0  , 0  , 1  , 0  , 0  ,  0  ,  0 ,  0],
   [0  , 0  , 0  , 1  , 0  ,  0  ,  0 ,  0],
   [0  , 0  , 0  , 0  , 0  ,  0  ,  0 ,  0],
   [0  , 0  , 1  , 0  , 0  ,  1  ,  0 ,  0],
   [0  , 0  , 0  , 0  , 0  ,  1  ,  0 ,  0],
   [0  , 0  , 0  , 1  , 0  ,  0  ,  1 ,  0],
   [0  , 0  , 0  , 0  , 0  ,  0  ,  1 ,  0],
   [0  , 0  , 0  , 0  , 1  ,  0  ,  0 ,  0],
   [0  , 0  , 0  , 0  , 0  ,  0  ,  0 ,  1]
];

// Select the canvas and button elements
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

// Add event listener to option
for(let i=0; i<nprime; i++){
  form0.primes[i].addEventListener('click', () => {draw();});
}


form0.draw.addEventListener('click', () => {
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
  const ntile  = neq*2;
  const margin = 100;
  const selp   = parseInt(form0.primes.value);
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
  //draw port number
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
  context.strokeStyle = 'blue';
  for(let ie=0; ie<neq; ie++){
    if(blockers[ie][selp] == 1){
      //connect bottom ports ie * 2 and ie * 2 + 1 by arc
      context.beginPath();
      context.arc(margin+tx*ie*2+tx, margin+by, tx/2, Math.PI, 0, false);
      context.stroke();
    }else{
      //connect bottom and top by line
      context.beginPath();
      context.moveTo(margin+tx*ie*2+tx/2, margin+by);
      context.lineTo(margin+tx*ie*2+tx/2, margin);
      context.stroke();
      context.beginPath();
      context.moveTo(margin+tx*ie*2+tx+tx/2, margin+by);
      context.lineTo(margin+tx*ie*2+tx+tx/2, margin);
      context.stroke();
    }
  }
}

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




