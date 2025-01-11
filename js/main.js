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
const kind2name  = ['2'  , '3'     , '5'     , '7'    , '11'  , '13'    , '17'   , '19'  , 'diag' , 'amp'    , 'bottom', 'start', 'thru'];
//const kind2color = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'pink', 'cyan' , 'magenta', 'lime'  , 'teal' , 'indigo', 'white'];
//don't use same color. please use rainbow order, don't use teal
const kind2color = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'pink', 'cyan' , 'magenta', 'lime'  , 'darkblue', 'indigo', 'white'];
  
const divs  =[ -1,  0,  1,  0,  2,  1,  2,  3, 4, 1, 5, 2, 6, 3];
const amps  =[  0,  9, 25, 13, 49, 17, 19,121, 1, 3, 1, 5, 1, 7];
const primes=[2,3,5,7,11,13,17,19];
// Select the canvas and button elements
const canout = document.getElementById('canout');
const canin  = document.getElementById('canin');
const ctxout = canout.getContext('2d');
const ctxin  = canin .getContext('2d');

// Add event listener to option
for(let i=0; i<nkind; i++){
  form0.kinds[i].addEventListener('click', () => {
    drawin();
  });
}


form0.save.addEventListener('click', () => {
    // Convert canvas content to a data URL (base64-encoded PNG)
    const image = canin.toDataURL('image/png');

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = image; // Set the link href to the data URL
    link.download = 'canvas-image.png'; // Set the default file name

    // Simulate a click on the link to trigger download
    link.click();
});

// Add event listener to the button
const margin_in = 20;
const drawin = function() {
  // settings
  const margin = margin_in;
  const ctx = ctxin;
  const wx     = canin.width;
  const wy     = canin.height;
  const ntile  = neq*2;
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
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, wx, wy);
  
  //draw a brock
  ctx.strokeStyle = 'black';
  ctx.strokeRect(margin, margin, bx, by);
  
  //draw port number
  let fontsize = Math.floor(tx/1.5);
  ctx.font = fontsize + 'px Arial';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = 'black';
  for(let i=0; i<ntile; i++){
    //x axis at bottom
    ctx.fillText(i, margin+tx*i+fontsize, margin+by+fontsize);
    //y axis at left, flip ud
    ctx.fillText(i, margin-fontsize, margin+by-ty*i-fontsize);
  }
  
  //draw path
  ctx.strokeStyle = 'blue';
  ctx.fillStyle   = 'blue';
  const kind = form0.querySelector('input[name="kinds"]:checked').value;
  if(isFinite(kind)){
    //draw primes
    const selp   = parseInt(kind);
    for(let ie=0; ie<neq; ie++){
      //draw filter
      if(blockers[ie][selp] == 1){
        //stop band
        //connect top ports ie * 2  and ie * 2 + 1 by arc arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx/2   , margin);
        ctx.lineTo(margin+tx*ie*2+tx/2   , margin+ty/2);
        ctx.arc   (margin+tx*ie*2+tx     , margin+ty/2, tx/2, Math.PI, 0, true);
        ctx.lineTo(margin+tx*ie*2+tx+tx/2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx+tx/2     , margin     );
        ctx.lineTo(margin+tx*ie*2+tx+tx/2+tx/4, margin+tx/2);
        ctx.lineTo(margin+tx*ie*2+tx+tx/2-tx/4, margin+tx/2);
        ctx.closePath();
        ctx.fill();
      }else{
        //pass band
        //connect line from top ports ie * 2 to bottom ie * 2 + 1
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*2+tx/2, margin);
        ctx.stroke();
        //draw arrow to bottom
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx/2     , margin+by     );
        ctx.lineTo(margin+tx*ie*2+tx/2+tx/4, margin+by-tx/2);
        ctx.lineTo(margin+tx*ie*2+tx/2-tx/4, margin+by-tx/2);
        ctx.closePath();
        ctx.fill();
      }
      //divisor
      if(divs[ie]==selp){
        //dividing enable
        //connect bottom port ie * 2+1 to left port ie * 2 + 1 by rounded L-shape line
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*2+tx+tx/2, margin+by-ty*(ie*2+1));
        ctx.arc   (margin+tx*ie*2+tx     , margin+by-ty*(ie*2+1), tx/2, 0, -Math.PI/2, true);
        ctx.lineTo(margin                , margin+by-ty*(ie*2+1)-ty/2);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin                , margin+by-ty*(ie*2+1)-ty/2     );
        ctx.lineTo(margin+tx/2           , margin+by-ty*(ie*2+1)-ty/2-tx/4);
        ctx.lineTo(margin+tx/2           , margin+by-ty*(ie*2+1)-ty/2+tx/4);
        ctx.closePath();
        ctx.fill();
      }else{
        //dividing disable
        //connect right port ie * 2 + 1 to left port ie * 2 + 1 by line
        ctx.beginPath();
        ctx.moveTo(margin+bx, margin+by-ty*(ie*2+1)-ty/2);
        ctx.lineTo(margin   , margin+by-ty*(ie*2+1)-ty/2);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin     , margin+by-ty*(ie*2+1)-ty/2     );
        ctx.lineTo(margin+tx/2, margin+by-ty*(ie*2+1)-ty/2-tx/4);
        ctx.lineTo(margin+tx/2, margin+by-ty*(ie*2+1)-ty/2+tx/4);
        ctx.closePath();
        ctx.fill();
      }
    }//for(ie)
  }else{//if(isNaN)
    if(kind == 'start'){
      //connect left port 0 to right port 0 by line
      ctx.beginPath();
      ctx.moveTo(margin   , margin+by-ty/2);
      ctx.lineTo(margin+bx, margin+by-ty/2);
      ctx.stroke();
      //draw arrow
      ctx.beginPath();
      ctx.moveTo(margin+bx     , margin+by-ty/2     );
      ctx.lineTo(margin+bx-tx/2, margin+by-ty/2+tx/4);
      ctx.lineTo(margin+bx-tx/2, margin+by-ty/2-tx/4);
      ctx.closePath();
      ctx.fill();
    }else if(kind == 'diag'){
      //connect diagonal line from top right edge to bottom left edge
      ctx.beginPath();
      ctx.moveTo(margin+bx, margin);
      ctx.lineTo(margin   , margin+by);
      ctx.stroke();
      //draw diagonal arrow
      ctx.beginPath();
      ctx.moveTo(margin     , margin+by     );
      ctx.lineTo(margin+tx/2, margin+by     );
      ctx.lineTo(margin     , margin+by-ty/2);
      ctx.closePath();
      ctx.fill();
      //connect bottom ports 1 to diagonal line
      ctx.beginPath();
      ctx.moveTo(margin+tx*1+tx/2, margin+by);
      ctx.lineTo(margin+tx*1+tx/2, margin+by-ty-ty/2);
      ctx.stroke();
      //draw arrow
      ctx.beginPath();
      ctx.moveTo(margin+tx*1+tx/2     , margin+by-ty-ty/2     );
      ctx.lineTo(margin+tx*1+tx/2+tx/4, margin+by-ty-ty/2+ty/2);
      ctx.lineTo(margin+tx*1+tx/2-tx/4, margin+by-ty-ty/2+ty/2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(margin+tx*1+tx/2     , margin+by-ty-ty/2);
      ctx.lineTo(margin+tx*1+tx/2+tx/2, margin+by-ty-ty/2);
      ctx.lineTo(margin+tx*1+tx/2     , margin+by-ty-ty/2-ty/2);
      ctx.closePath();
      ctx.fill();
      for(let ie=0; ie<neq; ie++){
        //condition-incrementer
        if(ie>0){
          //connect arc from bottom ports ie * 2 + 1 to bottom ports ie * 2 + 2
          ctx.beginPath();
          ctx.moveTo(margin+tx*ie*2+tx/2   , margin+by);
          ctx.lineTo(margin+tx*ie*2+tx/2   , margin+by-ty/2);
          ctx.arc   (margin+tx*ie*2+tx     , margin+by-ty/2, tx/2, Math.PI, 0, false);
          ctx.lineTo(margin+tx*ie*2+tx+tx/2, margin+by);
          ctx.stroke();
          //draw arrow
          ctx.beginPath();
          ctx.moveTo(margin+tx*ie*2+tx+tx/2     , margin+by     );
          ctx.lineTo(margin+tx*ie*2+tx+tx/2+tx/4, margin+by-tx/2);
          ctx.lineTo(margin+tx*ie*2+tx+tx/2-tx/4, margin+by-tx/2);
          ctx.closePath();
          ctx.fill();
        }
        //connect L shape lines from right ports ie * 2 +1 to top ports ie * 2 + 1
        if(ie>0){
          ctx.beginPath();
          ctx.moveTo(margin+bx, margin+by-ty*ie*2-ty/2);
          ctx.lineTo(margin+tx*ie*2+tx, margin+by-ty*ie*2-ty/2);
          ctx.arc   (margin+tx*ie*2+tx, margin+by-ty*ie*2-ty, tx/2, Math.PI/2, Math.PI, false);
          ctx.lineTo(margin+tx*ie*2+tx/2, margin);
          ctx.stroke();
          //draw up arrow
          ctx.beginPath();
          ctx.moveTo(margin+tx*ie*2+tx/2,      margin     );
          ctx.lineTo(margin+tx*ie*2+tx/2-tx/4, margin+tx/2);
          ctx.lineTo(margin+tx*ie*2+tx/2+tx/4, margin+tx/2);
          ctx.closePath();
          ctx.fill();
        }
        //connect L shape lines from left ports ie * 2 to bottom ports 0
        ctx.beginPath();
        ctx.moveTo(margin     , margin+by-ty*ie*2-ty/2);
        ctx.lineTo(margin+tx/2, margin+by-ty*ie*2-ty/2);
        ctx.lineTo(margin+tx/2, margin+by);
        ctx.stroke();
        if(ie<neq-1){
          //draw down arrow
          ctx.beginPath();
          ctx.moveTo(margin+tx/2,      margin+by-ty/2-ty*ie*2     );
          ctx.lineTo(margin+tx/2-tx/4, margin+by-ty/2-ty*ie*2-ty/2);
          ctx.lineTo(margin+tx/2+tx/4, margin+by-ty/2-ty*ie*2-ty/2);
          ctx.closePath();
          ctx.fill();
          //draw right arrow
          ctx.beginPath();
          ctx.moveTo(margin+tx/2,      margin+by-ty/2-ty*ie*2);
          ctx.lineTo(margin+tx/2-tx/2, margin+by-ty/2-ty*ie*2-tx/4);
          ctx.lineTo(margin+tx/2-tx/2, margin+by-ty/2-ty*ie*2+tx/4);
          ctx.closePath();
          ctx.fill();
        }
      }
    }else if(kind == 'bottom'){
      for(let ie=0; ie<neq-1; ie++){
        //connect top ports ie * 2 + 1 and ie * 2 + 2 by arc
        ctx.beginPath();
        ctx.moveTo(margin+tx*(ie*2+1)+tx/2   , margin);
        ctx.lineTo(margin+tx*(ie*2+1)+tx/2   , margin+ty/2);
        ctx.arc   (margin+tx*(ie*2+1)+tx     , margin+ty/2, tx/2, Math.PI, 0, true);
        ctx.lineTo(margin+tx*(ie*2+1)+tx+tx/2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*(ie*2+1)+tx+tx/2     , margin     );
        ctx.lineTo(margin+tx*(ie*2+1)+tx+tx/2+tx/4, margin+tx/2);
        ctx.lineTo(margin+tx*(ie*2+1)+tx+tx/2-tx/4, margin+tx/2);
        ctx.closePath();
        ctx.fill();
      }
    }else if(kind == 'amp'){
      for(let ie=0; ie<neq; ie++){
        //connect bottom ports ie * 2 and right port neq - ie * 2 by L-shape line
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*2+tx/2, margin+by-ty*ie*2);
        ctx.arc   (margin+tx*ie*2+tx  , margin+by-ty*ie*2, tx/2, Math.PI, -Math.PI/2, false);
        ctx.lineTo(margin+bx          , margin+by-ty*ie*2-ty/2);
        ctx.stroke();
        //round corner
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx/2, margin+by-ty*ie*2);
        ctx.stroke();

        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+bx, margin+by-ty*ie*2-ty/2     );
        ctx.lineTo(margin+bx-tx/2, margin+by-ty*ie*2-ty/2-tx/4);
        ctx.lineTo(margin+bx-tx/2, margin+by-ty*ie*2-ty/2+tx/4);
        ctx.closePath();
        ctx.fill();
      }
    }else if(kind == 'thru'){
      for(let ie=0; ie<neq; ie++){
        //connect top ports ie * 2 to bottom ports ie * 2
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*2+tx/2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx/2     , margin+by     );
        ctx.lineTo(margin+tx*ie*2+tx/2+tx/4, margin+by-tx/2);
        ctx.lineTo(margin+tx*ie*2+tx/2-tx/4, margin+by-tx/2);
        ctx.closePath();
        ctx.fill();
        //connect bottom ports ie * 2 + 1 to right ports ie * 2 + 1
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*2+tx+tx/2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*2+tx+tx/2     , margin     );
        ctx.lineTo(margin+tx*ie*2+tx+tx/2+tx/4, margin+tx/2);
        ctx.lineTo(margin+tx*ie*2+tx+tx/2-tx/4, margin+tx/2);
        ctx.closePath();
        ctx.fill();
        //connect right ports ie * 2 to left ports ie * 2
        ctx.beginPath();
        ctx.moveTo(margin+bx, margin+by-ty*ie*2-ty/2);
        ctx.lineTo(margin   , margin+by-ty*ie*2-ty/2);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin     , margin+by-ty*ie*2-ty/2     );
        ctx.lineTo(margin+tx/2, margin+by-ty*ie*2-ty/2-tx/4);
        ctx.lineTo(margin+tx/2, margin+by-ty*ie*2-ty/2+tx/4);
        ctx.closePath();
        ctx.fill();
        //connect left ports ie * 2 + 1 to right ports ie * 2 + 1
        ctx.beginPath();
        ctx.moveTo(margin+bx, margin+by-ty*ie*2-ty-ty/2);
        ctx.lineTo(margin   , margin+by-ty*ie*2-ty-ty/2);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+bx     , margin+by-ty*ie*2-ty-ty/2     );
        ctx.lineTo(margin+bx-tx/2, margin+by-ty*ie*2-ty-ty/2-tx/4);
        ctx.lineTo(margin+bx-tx/2, margin+by-ty*ie*2-ty-ty/2+tx/4);
        ctx.closePath();
        ctx.fill();
      }
    }
  }//if(isNaN)
}

function findfontsize(ctx, text, bx, by) {
    let minFontSize = 1;
    let maxFontSize = 100; // 大きな値を仮定
    let bestFontSize = minFontSize;

    while (minFontSize <= maxFontSize) {
        const fontSize = Math.floor((minFontSize + maxFontSize) / 2);
        ctx.font = `${fontSize}px Arial`; // フォントサイズを設定
        // 文字列の幅と高さを測定
        const metrics = ctx.measureText(text);
        const width = metrics.width;
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        if (width <= bx && height <= by) {
            bestFontSize = fontSize; // 現在のフォントサイズが収まる場合は更新
            minFontSize = fontSize + 1;
        } else {
            maxFontSize = fontSize - 1; // 超えた場合はフォントサイズを縮小
        }
    }
    return bestFontSize;
}

const margin_out = 20;
let cx = 0; //current block x
let cy = 0; //current block y
let nblock = 10;
const drawout = function() {
  // settings
  const ctx = ctxout;
  const wx     = canout.width;
  const wy     = canout.height;
  let   bx     = Math.floor((wx-2*margin_out)/(nblock+1));
  let   by     = Math.floor((wy-2*margin_out)/(nblock+1));
  mgnx = margin_out + bx;
  mgny = margin_out;
  if(bx>by){ bx = by; }else{ by = bx; }
  const sx     = bx*nblock;
  const sy     = by*nblock;

  //draw a background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, wx, wy);
  
  //draw a screen
  ctx.strokeStyle = 'black';
  ctx.strokeRect(mgnx, mgny, sx, sy);

  //draw block grid
  ctx.strokeStyle = 'gray';
  for(let i=1; i<nblock; i++){
    ctx.beginPath();
    ctx.moveTo(mgnx+bx*i, mgny);
    ctx.lineTo(mgnx+bx*i, mgny+sy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mgnx, mgny+by*i);
    ctx.lineTo(mgnx+sx, mgny+by*i);
    ctx.stroke();
  }
  //draw axes
  const text = Math.max(Math.abs(cx), Math.abs(cx+nblock-1)).toString();
  const fmgnx = 2;
  const fmgny = 2;
  let fontsize = findfontsize(ctx, text, bx-fmgnx*2, by-fmgny*2)*0.8;
  const metrics = ctx.measureText(text);
  const strx = metrics.width;
  const strya = metrics.actualBoundingBoxAscent;
  const stryd = metrics.actualBoundingBoxDescent;
  const stry = strya + stryd;
  ctx.font = fontsize + 'px Arial';
  ctx.textAlign    = 'right';
  ctx.textBaseline = 'top';
  ctx.fillStyle    = 'black';
  for(let i=0; i<nblock; i++){
    //x axis at bottom
    ctx.fillText(i+cx, -fmgnx+mgnx+bx*i+bx     ,fmgny+mgny+sy);
    //ctx.strokeRect    (mgnx+bx*i+bx-strx, mgny+sy, strx, strya+stryd);

    //y axis at left, flip ud
    ctx.fillText(i+cy, -fmgnx+mgnx     , fmgny+mgny+sy-by*i-by);
    //ctx.strokeRect    (mgnx-strx, mgny+sy-by*i-by, strx, stry);
  }
  //draw blocks
  const drawblock = (x, y, bx, by, color) => {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = color;
    ctx.fillRect(x, y, bx, by);
    ctx.strokeRect(x, y, bx, by);
  }
  let color;
  for(let x=0; x<nblock; x++){
    for(let y=0; y<nblock; y++){
      let px = x + cx;
      let py = y + cy;
      //primes
      if(px>0 && py>0){
        for(let ip=0; ip<nprime; ip++){
          // fill color by prime when py*prime = px
          if(py*primes[ip] == px){
            drawblock(mgnx+bx*x, mgny+sy-by*y-by, bx, by, kind2color[ip]);
          }
        }
      }
      let ikind = nprime;
      //starter
      color = kind2color[ikind++];
      if(px==8 && py==0){
        drawblock(mgnx+bx*x, mgny+sy-by*y-by, bx, by, color);
        continue;
      }
      //diag
      color = kind2color[ikind++];
      if(px>=0 && py>=0 && px==py){
        drawblock(mgnx+bx*x, mgny+sy-by*y-by, bx, by, color);
        continue;
      }
      //amp
      color = kind2color[ikind++];
      if(px>0 && py>0){
        for(let a=0; a<amps.length; a++){
          // fill color by amp when py = px * amp
          if(py == px * amps[a] && amps[a] > 1){
            drawblock(mgnx+bx*x, mgny+sy-by*y-by, bx, by, color);
          }
        }
        continue;
      }
      //bottom
      color = kind2color[ikind++];
      if(px>0 && py==0){
        drawblock(mgnx+bx*x, mgny+sy-by*y-by, bx, by, color);
        continue;
      }
      //thru
    }
  }
}
window.onload = function() {
  resize();
}
const resize = () => {
  const mgnx = 40;
  const mgny = 200;
  const wx =  window.innerWidth  - mgnx;
  const wy = (window.innerHeight - mgny)/2;
  const w = Math.min(wx, wy);
  canin.width  = w;
  canin.height = w;
  canout.width  = w;
  canout.height = w;
  drawin();
  drawout();
}
window.addEventListener('resize', resize);

// mouse wheel event to zoom in out
const nblockmin = 2;
const nblockmax = 70;
canout.addEventListener('wheel', (e) => {
  //change nblock
  if(e.deltaY < 0){
    nblock -= 1;
  }else if(e.deltaY > 0){
    nblock += 1;
  }
  if(nblock < nblockmin){
    nblock = nblockmin;
  }else if(nblock > nblockmax){
    nblock = nblockmax;
  }

  drawout();
  //console.log("nblock = " + nblock);
});
// mouse drag and drop to move by cx, cy
let dragging = false;
let downx = 0;
let downy = 0;
let downcx = cx;
let downcy = cy;
canout.addEventListener('mousedown', (e) => {
  const wx = canout.width;
  const wy = canout.height;
  //dragx = convert browserx to canbas x pixcel
  downx =      Math.floor((e.clientX - canout.getBoundingClientRect().left) * wx / canout.clientWidth);
  downy = wy - Math.floor((e.clientY - canout.getBoundingClientRect().top ) * wy / canout.clientHeight);
  downcx = cx;
  downcy = cy;
  //debug out
  if(false){
    const bx   = Math.floor((wx-2*margin_out)/(nblock+1));
    const by   = Math.floor((wy-2*margin_out)/(nblock+1));
    const mgnx = margin_out + bx;
    const mgny = margin_out;
    const dbx = Math.floor((downx - mgnx) / bx);
    const dby = Math.floor((downy - mgny) / by);
    console.log("dbx = " + dbx + ", dby = " + dby);
  }
  dragging = true;
});
canout.addEventListener('mousemove', (e) => {
  if(dragging){
    const wx = canout.width;
    const wy = canout.height;
    const bx   = Math.floor((wx-2*margin_out)/(nblock+1));
    const by   = Math.floor((wy-2*margin_out)/(nblock+1));
    const mgnx = margin_out + bx;
    const mgny = margin_out;

    const mx =      Math.floor((e.clientX - canout.getBoundingClientRect().left) * canout.width / canout.clientWidth);
    const my = wy - Math.floor((e.clientY - canout.getBoundingClientRect().top ) * canout.height / canout.clientHeight);
    
    const dbx = Math.floor((downx - mgnx) / bx);
    const dby = Math.floor((downy - mgny) / by);
    const mbx = Math.floor((   mx - mgnx) / bx);
    const mby = Math.floor((   my - mgny) / by);
    //console.log("mbx = " + mbx + ", mby = " + mby + ", dbx = " + dbx + ", dby = " + dby + ", mbx-dbx = " + (mbx-dbx) + ", mby-dby = " + (mby-dby));
    cx = downcx - (mbx - dbx);
    cy = downcy - (mby - dby);
    drawout();
  }
});
canout.addEventListener('mouseup', (e) => {
  dragging = false;
});
// how can I dragging = false when mouse out of canvas?
canout.addEventListener('mouseout', (e) => {
  dragging = false;
});

