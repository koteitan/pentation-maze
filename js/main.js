const neq    = 14; //number of equations
const nprime =  8; //number of prime numbers
const nkind  = 13; //number of kinds of blocks
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
const div=[-1,0, 1, 0, 2, 1, 2, 3, 4, 1, 5, 2, 6, 3];
const numer=[0, 9,25,13,49,17,19,21, 1, 3, 1, 5, 1, 7];

// Select the canvas and button elements
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

// Add event listener to option
for(let i=0; i<nkind; i++){
  form0.kinds[i].addEventListener('click', () => {draw();});
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
  // settings
  const wx     = canvas.width;
  const wy     = canvas.height;
  const ntile  = neq*2;
  const margin = 20;
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
  
  //draw path
  context.strokeStyle = 'blue';
  context.fillStyle   = 'blue';
  const kind = form0.kinds.value;
  if(isFinite(kind)){
    //draw primes
    const selp   = parseInt(form0.kinds.value);
    for(let ie=0; ie<neq; ie++){
      //draw filter
      if(blockers[ie][selp] == 1){
        //stop band
        //connect top ports ie * 2  and ie * 2 + 1 by arc arrow
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx/2   , margin);
        context.lineTo(margin+tx*ie*2+tx/2   , margin+ty/2);
        context.arc   (margin+tx*ie*2+tx     , margin+ty/2, tx/2, Math.PI, 0, true);
        context.lineTo(margin+tx*ie*2+tx+tx/2, margin);
        context.stroke();
        //draw arrow
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx+tx/2     , margin     );
        context.lineTo(margin+tx*ie*2+tx+tx/2+tx/4, margin+tx/2);
        context.lineTo(margin+tx*ie*2+tx+tx/2-tx/4, margin+tx/2);
        context.closePath();
        context.fill();
      }else{
        //pass band
        //connect line from top ports ie * 2 to bottom ie * 2 + 1
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx/2, margin+by);
        context.lineTo(margin+tx*ie*2+tx/2, margin);
        context.stroke();
        //draw arrow to bottom
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx/2     , margin+by     );
        context.lineTo(margin+tx*ie*2+tx/2+tx/4, margin+by-tx/2);
        context.lineTo(margin+tx*ie*2+tx/2-tx/4, margin+by-tx/2);
        context.closePath();
        context.fill();
      }
      //divisor
      if(div[ie]==selp){
        //dividing enable
        //connect bottom port ie * 2+1 to left port ie * 2 + 1 by rounded L-shape line
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx+tx/2, margin+by);
        context.lineTo(margin+tx*ie*2+tx+tx/2, margin+by-ty*(ie*2+1));
        context.arc   (margin+tx*ie*2+tx     , margin+by-ty*(ie*2+1), tx/2, 0, -Math.PI/2, true);
        context.lineTo(margin                , margin+by-ty*(ie*2+1)-ty/2);
        context.stroke();
        //draw arrow
        context.beginPath();
        context.moveTo(margin                , margin+by-ty*(ie*2+1)-ty/2     );
        context.lineTo(margin+tx/2           , margin+by-ty*(ie*2+1)-ty/2-tx/4);
        context.lineTo(margin+tx/2           , margin+by-ty*(ie*2+1)-ty/2+tx/4);
        context.closePath();
        context.fill();
      }else{
        //dividing disable
        //connect right port ie * 2 + 1 to left port ie * 2 + 1 by line
        context.beginPath();
        context.moveTo(margin+bx, margin+by-ty*(ie*2+1)-ty/2);
        context.lineTo(margin   , margin+by-ty*(ie*2+1)-ty/2);
        context.stroke();
        //draw arrow
        context.beginPath();
        context.moveTo(margin     , margin+by-ty*(ie*2+1)-ty/2     );
        context.lineTo(margin+tx/2, margin+by-ty*(ie*2+1)-ty/2-tx/4);
        context.lineTo(margin+tx/2, margin+by-ty*(ie*2+1)-ty/2+tx/4);
        context.closePath();
        context.fill();
      }
    }//for(ie)
  }else{//if(isNaN)
    if(kind == 'start'){
      //connect left port 0 to right port 0 by line
      context.beginPath();
      context.moveTo(margin   , margin+by-ty/2);
      context.lineTo(margin+bx, margin+by-ty/2);
      context.stroke();
      //draw arrow
      context.beginPath();
      context.moveTo(margin+bx     , margin+by-ty/2     );
      context.lineTo(margin+bx-tx/2, margin+by-ty/2+tx/4);
      context.lineTo(margin+bx-tx/2, margin+by-ty/2-tx/4);
      context.closePath();
      context.fill();
    }else if(kind == 'diag'){
      //connect diagonal line from top right edge to bottom left edge
      context.beginPath();
      context.moveTo(margin+bx, margin);
      context.lineTo(margin   , margin+by);
      context.stroke();
      //draw diagonal arrow
      context.beginPath();
      context.moveTo(margin     , margin+by     );
      context.lineTo(margin+tx/2, margin+by     );
      context.lineTo(margin     , margin+by-ty/2);
      context.closePath();
      context.fill();
      //connect bottom ports 1 to diagonal line
      context.beginPath();
      context.moveTo(margin+tx*1+tx/2, margin+by);
      context.lineTo(margin+tx*1+tx/2, margin+by-ty-ty/2);
      context.stroke();
      //draw arrow
      context.beginPath();
      context.moveTo(margin+tx*1+tx/2     , margin+by-ty-ty/2     );
      context.lineTo(margin+tx*1+tx/2+tx/4, margin+by-ty-ty/2+ty/2);
      context.lineTo(margin+tx*1+tx/2-tx/4, margin+by-ty-ty/2+ty/2);
      context.closePath();
      context.fill();
      context.beginPath();
      context.moveTo(margin+tx*1+tx/2     , margin+by-ty-ty/2);
      context.lineTo(margin+tx*1+tx/2+tx/2, margin+by-ty-ty/2);
      context.lineTo(margin+tx*1+tx/2     , margin+by-ty-ty/2-ty/2);
      context.closePath();
      context.fill();
      for(let ie=0; ie<neq; ie++){
        //condition-incrementer
        if(ie>0){
          //connect arc from bottom ports ie * 2 + 1 to bottom ports ie * 2 + 2
          context.beginPath();
          context.moveTo(margin+tx*ie*2+tx/2   , margin+by);
          context.lineTo(margin+tx*ie*2+tx/2   , margin+by-ty/2);
          context.arc   (margin+tx*ie*2+tx     , margin+by-ty/2, tx/2, Math.PI, 0, false);
          context.lineTo(margin+tx*ie*2+tx+tx/2, margin+by);
          context.stroke();
          //draw arrow
          context.beginPath();
          context.moveTo(margin+tx*ie*2+tx+tx/2     , margin+by     );
          context.lineTo(margin+tx*ie*2+tx+tx/2+tx/4, margin+by-tx/2);
          context.lineTo(margin+tx*ie*2+tx+tx/2-tx/4, margin+by-tx/2);
          context.closePath();
          context.fill();
        }
        //connect L shape lines from right ports ie * 2 +1 to top ports ie * 2 + 1
        if(ie>0){
          context.beginPath();
          context.moveTo(margin+bx, margin+by-ty*ie*2-ty/2);
          context.lineTo(margin+tx*ie*2+tx, margin+by-ty*ie*2-ty/2);
          context.arc   (margin+tx*ie*2+tx, margin+by-ty*ie*2-ty, tx/2, Math.PI/2, Math.PI, false);
          context.lineTo(margin+tx*ie*2+tx/2, margin);
          context.stroke();
          //draw up arrow
          context.beginPath();
          context.moveTo(margin+tx*ie*2+tx/2,      margin     );
          context.lineTo(margin+tx*ie*2+tx/2-tx/4, margin+tx/2);
          context.lineTo(margin+tx*ie*2+tx/2+tx/4, margin+tx/2);
          context.closePath();
          context.fill();
        }
        //connect L shape lines from left ports ie * 2 to bottom ports 0
        context.beginPath();
        context.moveTo(margin     , margin+by-ty*ie*2-ty/2);
        context.lineTo(margin+tx/2, margin+by-ty*ie*2-ty/2);
        context.lineTo(margin+tx/2, margin+by);
        context.stroke();
        if(ie<neq-1){
          //draw down arrow
          context.beginPath();
          context.moveTo(margin+tx/2,      margin+by-ty/2-ty*ie*2     );
          context.lineTo(margin+tx/2-tx/4, margin+by-ty/2-ty*ie*2-ty/2);
          context.lineTo(margin+tx/2+tx/4, margin+by-ty/2-ty*ie*2-ty/2);
          context.closePath();
          context.fill();
          //draw right arrow
          context.beginPath();
          context.moveTo(margin+tx/2,      margin+by-ty/2-ty*ie*2);
          context.lineTo(margin+tx/2-tx/2, margin+by-ty/2-ty*ie*2-tx/4);
          context.lineTo(margin+tx/2-tx/2, margin+by-ty/2-ty*ie*2+tx/4);
          context.closePath();
          context.fill();
        }
      }
    }else if(kind == 'bottom'){
      for(let ie=0; ie<neq-1; ie++){
        //connect top ports ie * 2 + 1 and ie * 2 + 2 by arc
        context.beginPath();
        context.moveTo(margin+tx*(ie*2+1)+tx/2   , margin);
        context.lineTo(margin+tx*(ie*2+1)+tx/2   , margin+ty/2);
        context.arc   (margin+tx*(ie*2+1)+tx     , margin+ty/2, tx/2, Math.PI, 0, true);
        context.lineTo(margin+tx*(ie*2+1)+tx+tx/2, margin);
        context.stroke();
        //draw arrow
        context.beginPath();
        context.moveTo(margin+tx*(ie*2+1)+tx+tx/2     , margin     );
        context.lineTo(margin+tx*(ie*2+1)+tx+tx/2+tx/4, margin+tx/2);
        context.lineTo(margin+tx*(ie*2+1)+tx+tx/2-tx/4, margin+tx/2);
        context.closePath();
        context.fill();
      }
    }else if(kind == 'amp'){
      for(let ie=0; ie<neq; ie++){
        //connect bottom ports ie * 2 and right port neq - ie * 2 by L-shape line
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx/2, margin+by);
        context.lineTo(margin+tx*ie*2+tx/2, margin+by-ty*ie*2);
        context.arc   (margin+tx*ie*2+tx  , margin+by-ty*ie*2, tx/2, Math.PI, -Math.PI/2, false);
        context.lineTo(margin+bx          , margin+by-ty*ie*2-ty/2);
        context.stroke();
        //round corner
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx/2, margin+by-ty*ie*2);
        context.stroke();

        //draw arrow
        context.beginPath();
        context.moveTo(margin+bx, margin+by-ty*ie*2-ty/2     );
        context.lineTo(margin+bx-tx/2, margin+by-ty*ie*2-ty/2-tx/4);
        context.lineTo(margin+bx-tx/2, margin+by-ty*ie*2-ty/2+tx/4);
        context.closePath();
        context.fill();
      }
    }else if(kind == 'thru'){
      for(let ie=0; ie<neq; ie++){
        //connect top ports ie * 2 to bottom ports ie * 2
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx/2, margin+by);
        context.lineTo(margin+tx*ie*2+tx/2, margin);
        context.stroke();
        //draw arrow
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx/2     , margin+by     );
        context.lineTo(margin+tx*ie*2+tx/2+tx/4, margin+by-tx/2);
        context.lineTo(margin+tx*ie*2+tx/2-tx/4, margin+by-tx/2);
        context.closePath();
        context.fill();
        //connect bottom ports ie * 2 + 1 to right ports ie * 2 + 1
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx+tx/2, margin+by);
        context.lineTo(margin+tx*ie*2+tx+tx/2, margin);
        context.stroke();
        //draw arrow
        context.beginPath();
        context.moveTo(margin+tx*ie*2+tx+tx/2     , margin     );
        context.lineTo(margin+tx*ie*2+tx+tx/2+tx/4, margin+tx/2);
        context.lineTo(margin+tx*ie*2+tx+tx/2-tx/4, margin+tx/2);
        context.closePath();
        context.fill();
        //connect right ports ie * 2 to left ports ie * 2
        context.beginPath();
        context.moveTo(margin+bx, margin+by-ty*ie*2-ty/2);
        context.lineTo(margin   , margin+by-ty*ie*2-ty/2);
        context.stroke();
        //draw arrow
        context.beginPath();
        context.moveTo(margin     , margin+by-ty*ie*2-ty/2     );
        context.lineTo(margin+tx/2, margin+by-ty*ie*2-ty/2-tx/4);
        context.lineTo(margin+tx/2, margin+by-ty*ie*2-ty/2+tx/4);
        context.closePath();
        context.fill();
        //connect left ports ie * 2 + 1 to right ports ie * 2 + 1
        context.beginPath();
        context.moveTo(margin+bx, margin+by-ty*ie*2-ty-ty/2);
        context.lineTo(margin   , margin+by-ty*ie*2-ty-ty/2);
        context.stroke();
        //draw arrow
        context.beginPath();
        context.moveTo(margin+bx     , margin+by-ty*ie*2-ty-ty/2     );
        context.lineTo(margin+bx-tx/2, margin+by-ty*ie*2-ty-ty/2-tx/4);
        context.lineTo(margin+bx-tx/2, margin+by-ty*ie*2-ty-ty/2+tx/4);
        context.closePath();
        context.fill();
      }
    }
  }//if(isNaN)
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




