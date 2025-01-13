const jsversion = 'v0.10';
//mathematics ----------------------------------
const kind2name  = ['2','3','5','7','11','13','17','19',
  'amp3','amp5','amp7', 'amp9','amp13','amp17','amp19','amp25','amp49','amp121',
  'diag','start','bottom','thru'];
const primes = [2,3,5,7,11,13,17,19];
const amps = [3,5,7,9,13,17,19,25,49,121];
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
const eq2div = [ 2, 2, 3, 2, 5, 3, 5,  7, 13, 5, 17, 7, 19, 11]; //divs[e]
const eq2amp = [ 0, 9,25,13,49,17,19,121,  1, 3,  1, 5,  1,  7]; //amps[e]

const nkind  = kind2name.length;
const nprime = primes.length;
const namp   = amps.length;
const neq    = blockers.length;

const name2kind = function(name){
  for(let i=0; i<nkind; i++){
    if(kind2name[i] == name){
      return i;
    }
  }
  return -1;
}
const prime2kind = [];
for (let p = 0; p < nprime; p++) {
  for (let k = 0; k < nkind; k++) {
    if (kind2name[k] == primes[p]) {
      prime2kind[primes[p]] = k;
    }
  }
}
const amp2kind = [];
for (let k = 0; k < nkind; k++) {
  for (let a = 0; a < namp; a++) {
    if (kind2name[k] == 'amp' + amps[a]) {
      amp2kind[a] = k;
    }
  }
}
const getkind = function(x, y){
  if(x==0 && y==8){
    return name2kind('start');
  }
  if(x>=0 && y>=0 && x==y){
    return name2kind('diag');
  }
  if(x>0 && y>0){
    for(let e=0; e<neq; e++){
      if(y == x * eq2amp[e] && eq2amp[e] > 1){
        return name2kind('amp'+eq2amp[e]);
      }
    }
  }
  if(x>0 && y==0){
    return name2kind('bottom');
  }
  if(x>=0 && y>=0){
    //primes
    for(let ip=0; ip<nprime; ip++){
      if(y*primes[ip] == x){
        return ip;
      }
    }
  }
  return name2kind('thru');
}
let cx   ; //current cursor x
let cy   ; //current cursor y
let cport; //current cursor port
let cdirx; //current cursor port x direction
let cdiry; //current cursor port y direction
let cmode; //current cursor mode
const initmath = function(){
  cx     =  0; //starter
  cy     =  8; //starter
  vx     = cx;
  vy     = cy;
  cport  =  0; //start port
  cdirx  = +1; //right
  cdiry  =  0; //right
  cmode  =  0; 
}
let kind2color = [];
window.onload = function() {
  //version
  document.getElementById('jsversion').textContent = jsversion;
  //math
  initmath();
  //make kind2color
  if(false){
    for(let i=0; i<nprime; i++){
      kind2color.push(real2color(i/nprime));
    }
    for(let i=nprime; i<nkind; i++){
      kind2color.push(real2color((i-nprime)/(nkind-nprime), 0.5, 1));
    }
  }
  if(true){
    kind2color = [
      'rgb(255,128,  0)', //orange    2
      'rgb(255,255,  0)', //yellow    3
      'rgb(  0,255,  0)', //green     5
      'rgb(  0,255,255)', //scryan    7
      'rgb(  0,128,255)', //sky blue 11
      'rgb(  0,  0,255)', //blue     13
      'rgb(128,  0,255)', //purple   17
      'rgb(255,  0,255)', //magenta  19
      'rgb(255,192,192)', //pink     amp3
      'rgb(255,192,128)', //orange   amp5
      'rgb(255,255,192)', //yellow   amp7
      'rgb(192,255,192)', //green    amp9
      'rgb(192,255,255)', //scryan   amp13
      'rgb(192,128,255)', //sky blue amp17
      'rgb(192,192,255)', //blue     amp19
      'rgb(128,192,255)', //purple   amp25
      'rgb(255,192,255)', //magenta  amp49
      'rgb(255,234,255)', //magenta  amp121
      'rgb(255,  0,  0)', //red      diag
      'rgb(128,128,128)', //gray     bottom
      'rgb(192,192,192)', //silver   start
      'rgb(255,255,255)', //white    thru
    ];
  }
  for(let i=0; i<nkind; i++){
    document.getElementById('kind'+kind2name[i]).style.backgroundColor = kind2color[i];
  }
  resize();
}
// GUI events
const margin_out = 20;
const canout = document.getElementById('canout');
const canin  = document.getElementById('canin');
const ctxout = canout.getContext('2d');
const ctxin  = canin .getContext('2d');
let nblock = 9; //number of blocks in a view
let scrx   =  0; //current view x
let scry   =  0; //current view y
let vx     =  0; //current cursor x = starter
let vy     =  8; //current cursor y = starter
let downx  =  0;         //mouse and touch down x
let downy  =  0;         //mouse and touch down y
let downx2 =  0;         //second touch down x
let downy2 =  0;         //second touch down y
let downscrx   = scrx;   //view x when down
let downscry   = scry;   //view y when down
let downnblock = nblock; //nblock when down
let dragging = false;    //mouse dragging flag
//debug print
const print = function(str){
  document.getElementById('debug').style.display = 'block';
  document.getElementById('debug').textContent = str;
}
const println = function(str){
  print(str + '\n');
}
// Add event listener to the button
const margin_in = 20;
const drawcanin = function() {
  // settings
  const margin = margin_in;
  const ctx    = ctxin;
  const wx     = canin.width  / window.devicePixelRatio;
  const wy     = canin.height / window.devicePixelRatio;
  const ntile  = neq*3;
  let   tx     = Math.floor((wx-2*margin)/ntile);
  let   ty     = Math.floor((wy-2*margin)/ntile);
  if(tx>ty){
    tx = ty;
  }else{
    ty = tx;
  }
  const bx     = tx*ntile;
  const by     = ty*ntile;
  const kind   = document.querySelector('input[name="kinds"]:checked').value;
  const iscur  = cx==vx && cy==vy;
  
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
  const colorpath = function(v){
    if(v){
      ctxin.strokeStyle = 'red';
      ctxin.fillStyle   = 'red';
    }else{
      ctxin.strokeStyle = 'blue';
      ctxin.fillStyle   = 'blue';
    }
  };
  if(isFinite(kind)){
    //draw primes
    const selp   = parseInt(kind);
    const ikind  = prime2kind[selp];
    const iprime = ikind;
    for(let ie=0; ie<neq; ie++){
      //draw filter
      if(blockers[ie][iprime] == 1){
        //stop band
        colorpath(iscur && ie==cport && cdiry==-1);
        //connect top ports ie*3  and ie*3+1 by arc arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx/2   , margin);
        ctx.lineTo(margin+tx*ie*3+tx/2   , margin+ty/2);
        ctx.arc   (margin+tx*ie*3+tx     , margin+ty/2, tx/2, Math.PI, 0, true);
        ctx.lineTo(margin+tx*ie*3+tx+tx/2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx+tx/2     , margin     );
        ctx.lineTo(margin+tx*ie*3+tx+tx/2+tx/4, margin+tx/2);
        ctx.lineTo(margin+tx*ie*3+tx+tx/2-tx/4, margin+tx/2);
        ctx.closePath();
        ctx.fill();
      }else{
        //pass band
        colorpath(iscur && ie==cport && cdiry==-1);
        //connect line from top ports ie*3 to bottom ie*3+1
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*3+tx/2, margin);
        ctx.stroke();
        //draw arrow to bottom
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx/2     , margin+by     );
        ctx.lineTo(margin+tx*ie*3+tx/2+tx/4, margin+by-tx/2);
        ctx.lineTo(margin+tx*ie*3+tx/2-tx/4, margin+by-tx/2);
        ctx.closePath();
        ctx.fill();
        //connect top ports ie*3 to bottom ports ie*3
        colorpath(iscur && ie==cport && cdiry==-1);
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*3+tx/2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx/2     , margin+by     );
        ctx.lineTo(margin+tx*ie*3+tx/2+tx/4, margin+by-tx/2);
        ctx.lineTo(margin+tx*ie*3+tx/2-tx/4, margin+by-tx/2);
        ctx.closePath();
        ctx.fill();
      }
      //return path by mode 0
      //connect bottom ports ie*3+1 to top ports ie*3+1
      colorpath(iscur && ie==cport && cdiry==+1 && cmode==0);
      ctx.beginPath();
      ctx.moveTo(margin+tx*ie*3+tx+tx/2, margin+by);
      ctx.lineTo(margin+tx*ie*3+tx+tx/2, margin);
      ctx.stroke();
      //draw arrow
      ctx.beginPath();
      ctx.moveTo(margin+tx*ie*3+tx+tx/2     , margin     );
      ctx.lineTo(margin+tx*ie*3+tx+tx/2+tx/4, margin+ty/2);
      ctx.lineTo(margin+tx*ie*3+tx+tx/2-tx/4, margin+ty/2);
      ctx.closePath();
      ctx.fill();
      //divisor
      if(eq2div[ie]==selp){
        //dividing enable
        //connect bottom port ie*3+1 to left port ie*3+1 by rounded L-shape line
        colorpath(iscur && ie==cport && cdiry==+1 && cmode==1);
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx*2+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*3+tx*2+tx/2, margin+by-ty*ie*3-ty/2);
        ctx.arc   (margin+tx*ie*3+tx*2     , margin+by-ty*ie*3-ty, tx/2, 0, -Math.PI/2, true);
        ctx.lineTo(margin                  , margin+by-ty*ie*3-ty-ty/2);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin                , margin+by-ty*ie*3-ty-ty/2     );
        ctx.lineTo(margin+tx/2           , margin+by-ty*ie*3-ty-ty/2-tx/4);
        ctx.lineTo(margin+tx/2           , margin+by-ty*ie*3-ty-ty/2+tx/4);
        ctx.closePath();
        ctx.fill();
      }else{
        //dividing disable
        //connect right port ie*3+1 to left port ie*3+1 by line
        colorpath(iscur && ie==cport && cdirx==-1);
        ctx.beginPath();
        ctx.moveTo(margin+bx, margin+by-ty*(ie*3+1)-ty/2);
        ctx.lineTo(margin   , margin+by-ty*(ie*3+1)-ty/2);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin     , margin+by-ty*(ie*3+1)-ty/2     );
        ctx.lineTo(margin+tx/2, margin+by-ty*(ie*3+1)-ty/2-tx/4);
        ctx.lineTo(margin+tx/2, margin+by-ty*(ie*3+1)-ty/2+tx/4);
        ctx.closePath();
        ctx.fill();
        //connect bottom ports ie*3+1 to top ports ie*3+1
        colorpath(iscur && ie==cport && cdiry==+1);
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*3+tx+tx/2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx+tx/2     , margin     );
        ctx.lineTo(margin+tx*ie*3+tx+tx/2+tx/4, margin+tx/2);
        ctx.lineTo(margin+tx*ie*3+tx+tx/2-tx/4, margin+tx/2);
        ctx.closePath();
        ctx.fill();
      }
    }//for(ie)
  }else{//if(isNaN)
    if(kind == 'start'){
      colorpath(iscur);
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
      colorpath(iscur && cdirx==-1 && cdiry==-1);
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
      //connect right ports 1 to diagonal line
      colorpath(iscur && cport==0 && cdirx==-1);
      ctx.beginPath();
      ctx.moveTo(margin+bx,        margin+by-ty-ty/2);
      ctx.lineTo(margin+tx*1+tx/2, margin+by-ty-ty/2);
      ctx.stroke();
      //draw arrow
      ctx.beginPath();
      ctx.moveTo(margin+tx*1+tx/2     , margin+by-ty-ty/2     );
      ctx.lineTo(margin+tx*1+tx/2+tx/2, margin+by-ty-ty/2+tx/4);
      ctx.lineTo(margin+tx*1+tx/2+tx/2, margin+by-ty-ty/2-tx/4);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(margin+tx*1+tx/2     , margin+by-ty-ty/2);
      ctx.lineTo(margin+tx*1+tx/2+tx/2, margin+by-ty-ty/2);
      ctx.lineTo(margin+tx*1+tx/2     , margin+by-ty-ty/2-ty/2);
      ctx.closePath();
      ctx.fill();
      for(let ie=0; ie<neq-1; ie++){
        //condition-incrementer
        //connect arc from bottom ports ie*3+1 to bottom ports (ie+1)*3
        colorpath(iscur && ie==cport && cdiry==+1);
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx+tx/2   , margin+by);
        ctx.lineTo(margin+tx*ie*3+tx+tx/2   , margin+by-ty/2);
        ctx.arc   (margin+tx*(ie+0.5)*3+tx    , margin+by-ty/2, tx, Math.PI, 0, false);
        ctx.lineTo(margin+tx*(ie+1  )*3+tx/2  , margin+by);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*(ie+1)*3+tx/2     , margin+by     );
        ctx.lineTo(margin+tx*(ie+1)*3+tx/2+tx/4, margin+by-tx/2);
        ctx.lineTo(margin+tx*(ie+1)*3+tx/2-tx/4, margin+by-tx/2);
        ctx.closePath();
        ctx.fill();
        //connect L shape lines from right ports ie*3 +1 to top ports ie*3+1
        if(ie>0){
          colorpath(iscur && ie==cport && cdirx==-1);
          ctx.beginPath();
          ctx.moveTo(margin+bx             , margin+by-ty*ie*3-ty-ty/2);
          ctx.lineTo(margin+tx*ie*3+tx+tx  , margin+by-ty*ie*3-ty-ty/2);
          ctx.arc   (margin+tx*ie*3+tx+tx  , margin+by-ty*ie*3-ty-ty, tx/2, Math.PI/2, Math.PI, false);
          ctx.lineTo(margin+tx*ie*3+tx+tx/2, margin);
          ctx.stroke();
          //draw up arrow
          ctx.beginPath();
          ctx.moveTo(margin+tx*ie*3+tx+tx/2,      margin     );
          ctx.lineTo(margin+tx*ie*3+tx+tx/2-tx/4, margin+tx/2);
          ctx.lineTo(margin+tx*ie*3+tx+tx/2+tx/4, margin+tx/2);
          ctx.closePath();
          ctx.fill();
        }
        //connect L shape lines from left ports ie*3 to bottom ports 0
        colorpath(iscur && ie==cport && cdirx==+1);
        ctx.beginPath();
        ctx.moveTo(margin     , margin+by-ty*(ie-0)*2-ty/2);
        ctx.lineTo(margin+tx/2, margin+by-ty*(ie-0)*2-ty/2);
        if(ie>0){
          ctx.lineTo(margin+tx/2, margin+by-ty*(ie-1)*2-ty/2);
        }else{
          ctx.lineTo(margin+tx/2, margin+by);
        }
        ctx.stroke();
        //draw right arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx/2, margin+by-ty*(ie)*2-ty/2);
        ctx.lineTo(margin     , margin+by-ty*(ie)*2-ty/2-tx/4);
        ctx.lineTo(margin     , margin+by-ty*(ie)*2-ty/2+tx/4);
        ctx.closePath();
        ctx.fill();
        //draw down arrow
        ctx.beginPath();
        if(ie>0){
          ctx.moveTo(margin+tx/2,      margin+by-ty*(ie-1)*2-ty/2);
          ctx.lineTo(margin+tx/2-tx/4, margin+by-ty*(ie-1)*2-ty);
          ctx.lineTo(margin+tx/2+tx/4, margin+by-ty*(ie-1)*2-ty);
        }else{
          ctx.moveTo(margin+tx/2,      margin+by);
          ctx.lineTo(margin+tx/2-tx/4, margin+by-ty/2);
          ctx.lineTo(margin+tx/2+tx/4, margin+by-ty/2);
        }
        ctx.closePath();
        ctx.fill();
      }//for(ie)
    }else if(kind == 'bottom'){
      for(let ie=0; ie<neq; ie++){
        //connect top ports ie*3 and ie*3+1 by arc
        colorpath(iscur && ie==cport && cdiry==-1);
        ctx.beginPath();
        ctx.moveTo(margin+tx*(ie*3)+tx/2   , margin);
        ctx.lineTo(margin+tx*(ie*3)+tx/2   , margin+ty/2);
        ctx.arc   (margin+tx*(ie*3)     +tx*1.5, margin+ty/2, tx, Math.PI, 0, true);
        ctx.lineTo(margin+tx*(ie*3)+tx/2+tx*2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*(ie*3)+tx/2+tx*2     , margin     );
        ctx.lineTo(margin+tx*(ie*3)+tx/2+tx*2+tx/4, margin+tx/2);
        ctx.lineTo(margin+tx*(ie*3)+tx/2+tx*2-tx/4, margin+tx/2);
        ctx.closePath();
        ctx.fill();
      }
    }else if(kind.startsWith('amp')){
      for(let ie=0; ie<neq; ie++){
        if(eq2amp[ie] == parseInt(kind.substring(3))){
          //connect bottom ports ie*3+1 and right port ie*3+1 by L-shape line
          colorpath(iscur && ie==cport && cdiry==+1);
          ctx.beginPath();
          ctx.moveTo(margin+tx*ie*3+tx+tx/2, margin+by);
          ctx.lineTo(margin+tx*ie*3+tx+tx/2, margin+by-ty*ie*3);
          ctx.arc   (margin+tx*ie*3+tx+tx  , margin+by-ty*ie*3, tx/2, Math.PI, -Math.PI/2, false);
          ctx.lineTo(margin+bx             , margin+by-ty*ie*3-ty/2);
          ctx.stroke();
          //round corner
          ctx.beginPath();
          ctx.moveTo(margin+tx*ie*3+tx/2, margin+by-ty*ie*3);
          ctx.stroke();
          //draw arrow
          ctx.beginPath();
          ctx.moveTo(margin+bx,      margin+by-ty*ie*3-ty/2     );
          ctx.lineTo(margin+bx-tx/2, margin+by-ty*ie*3-ty/2-ty/4);
          ctx.lineTo(margin+bx-tx/2, margin+by-ty*ie*3-ty/2+ty/4);
          ctx.closePath();
          ctx.fill();
        }else{
          //connect bottom ports ie*3 to top ports ie*3
          colorpath(iscur && ie==cport && cdiry==+1);
          ctx.beginPath();
          ctx.moveTo(margin+tx*ie*3+tx+tx/2, margin+by);
          ctx.lineTo(margin+tx*ie*3+tx+tx/2, margin);
          ctx.stroke();
          //draw arrow
          ctx.beginPath();
          ctx.moveTo(margin+tx*ie*3+tx+tx/2     , margin     );
          ctx.lineTo(margin+tx*ie*3+tx+tx/2+tx/4, margin+ty/2);
          ctx.lineTo(margin+tx*ie*3+tx+tx/2-tx/4, margin+ty/2);
          ctx.closePath();
          ctx.fill();
          //connect left ports ie*3+1 to right ports ie*3+1
          colorpath(iscur && ie==cport && cdirx==+1);
          ctx.beginPath();
          ctx.moveTo(margin+bx, margin+by-ty*ie*3-ty/2);
          ctx.lineTo(margin   , margin+by-ty*ie*3-ty/2);
          ctx.stroke();
          //draw arrow
          ctx.beginPath();
          ctx.moveTo(margin+bx     , margin+by-ty*ie*3-ty/2     );
          ctx.lineTo(margin+bx-tx/2, margin+by-ty*ie*3-ty/2-ty/4);
          ctx.lineTo(margin+bx-tx/2, margin+by-ty*ie*3-ty/2+ty/4);
          ctx.closePath();
          ctx.fill();
        }
      }
    }else if(kind == 'thru'){
      for(let ie=0; ie<neq; ie++){
        //connect top ports ie*3 to bottom ports ie*3
        colorpath(iscur && ie==cport && cdiry==-1);
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*3+tx/2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx/2     , margin+by     );
        ctx.lineTo(margin+tx*ie*3+tx/2+tx/4, margin+by-ty/2);
        ctx.lineTo(margin+tx*ie*3+tx/2-tx/4, margin+by-ty/2);
        ctx.closePath();
        ctx.fill();
        //connect bottom ports ie*3+1 to top ports ie*3+1
        colorpath(iscur && ie==cport && cdiry==+1 && cmode==0);
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*3+tx+tx/2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx+tx/2     , margin     );
        ctx.lineTo(margin+tx*ie*3+tx+tx/2+tx/4, margin+ty/2);
        ctx.lineTo(margin+tx*ie*3+tx+tx/2-tx/4, margin+ty/2);
        ctx.closePath();
        ctx.fill();
        //connect bottom ports ie*3+2 to top ports ie*3+2
        colorpath(iscur && ie==cport && cdiry==+1 && cmode==1);
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx*2+tx/2, margin+by);
        ctx.lineTo(margin+tx*ie*3+tx*2+tx/2, margin);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+tx*ie*3+tx*2+tx/2     , margin     );
        ctx.lineTo(margin+tx*ie*3+tx*2+tx/2+tx/4, margin+ty/2);
        ctx.lineTo(margin+tx*ie*3+tx*2+tx/2-tx/4, margin+ty/2);
        ctx.closePath();
        ctx.fill();
        //connect right ports ie*3 to left ports ie*3
        colorpath(iscur && ie==cport && cdirx==+1);
        ctx.beginPath();
        ctx.moveTo(margin+bx, margin+by-ty*ie*3-ty/2);
        ctx.lineTo(margin   , margin+by-ty*ie*3-ty/2);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin+bx     , margin+by-ty*ie*3-ty/2     );
        ctx.lineTo(margin+bx-tx/2, margin+by-ty*ie*3-ty/2-ty/4);
        ctx.lineTo(margin+bx-tx/2, margin+by-ty*ie*3-ty/2+ty/4);
        ctx.closePath();
        ctx.fill();
        //connect left ports ie*3+1 to right ports ie*3+1
        colorpath(iscur && ie==cport && cdirx==-1);
        ctx.beginPath();
        ctx.moveTo(margin+bx, margin+by-ty*ie*3-ty-ty/2);
        ctx.lineTo(margin   , margin+by-ty*ie*3-ty-ty/2);
        ctx.stroke();
        //draw arrow
        ctx.beginPath();
        ctx.moveTo(margin     , margin+by-ty*ie*3-ty-ty/2     );
        ctx.lineTo(margin+tx/2, margin+by-ty*ie*3-ty-ty/2-tx/4);
        ctx.lineTo(margin+tx/2, margin+by-ty*ie*3-ty-ty/2+tx/4);
        ctx.closePath();
        ctx.fill();
      }
    }
  }//if(isNaN)
}

const drawcanout = function() {
  // settings
  const ctx = ctxout;
  const wx     = canout.width / window.devicePixelRatio;
  const wy     = canout.height / window.devicePixelRatio;
  let   bx     = ((wx-2*margin_out)/(nblock+1));
  let   by     = ((wy-2*margin_out)/(nblock+1));
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
  const text = Math.max(Math.abs(scrx), Math.abs(scrx+nblock-1)).toString();
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
    ctx.fillText(i+scrx, -fmgnx+mgnx+bx*i+bx     ,fmgny+mgny+sy);
    //ctx.strokeRect    (mgnx+bx*i+bx-strx, mgny+sy, strx, strya+stryd);

    //y axis at left, flip ud
    ctx.fillText(i+scry, -fmgnx+mgnx     , fmgny+mgny+sy-by*i-by);
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
      let px = x + scrx;
      let py = y + scry;
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
      if(px==0 && py==8){
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
        for(let ie=0; ie<neq; ie++){
          // fill color by amp when py = px * amp
          if(py == px * eq2amp[ie] && eq2amp[ie] > 1){
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
    }//for(y)
  }//for(x)

  //draw view cursor
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  if(vx>=scrx && vx<scrx+nblock && vy>=scry && vy<scry+nblock){
    ctx.strokeRect(mgnx+bx*(vx-scrx), mgny+sy-by*(vy-scry)-by, bx, by);
  }
  ctx.lineWidth = 1;

  //draw cursor (circle)
  ctx.fillStyle = 'black';
  if(cx>=scrx && cx<scrx+nblock && cy>=scry && cy<scry+nblock){
    ctx.beginPath();
    ctx.arc(mgnx   +bx*(cx-scrx)+bx/2-bx/5+bx/6*cdirx, 
            mgny+sy-by*(cy-scry)-by/2     -by/6*cdiry, bx/2/6, 0, Math.PI*2, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(mgnx   +bx*(cx-scrx)+bx/2+bx/5+bx/6*cdirx,
            mgny+sy-by*(cy-scry)-by/2     -by/6*cdiry, bx/2/6, 0, Math.PI*2, false);
    ctx.fill();
  }

}//drawcanout
// slide by swipe and zoom by pinch
canout.addEventListener('touchstart', (e) => {
  const wx = canout.width  / window.devicePixelRatio;
  const wy = canout.height / window.devicePixelRatio;
  downx =      Math.floor((e.touches[0].clientX - canout.getBoundingClientRect().left) /canout.clientWidth  *wx);
  downy = wy - Math.floor((e.touches[0].clientY - canout.getBoundingClientRect().top ) /canout.clientHeight *wy);
  downscrx = scrx;
  downscry = scry;
  if(e.touches.length == 2){
    downx2 = e.touches[1].clientX;
    downy2 = e.touches[1].clientY;
    downnblock = nblock;
  }
  e.preventDefault();
});
canout.addEventListener('touchmove', (e) => {
  const wx = canout.width  / window.devicePixelRatio;
  const wy = canout.height / window.devicePixelRatio;
  if(e.touches.length == 1){
    const mx =      Math.floor((e.touches[0].clientX - canout.getBoundingClientRect().left) /canout.clientWidth  *wx);
    const my = wy - Math.floor((e.touches[0].clientY - canout.getBoundingClientRect().top ) /canout.clientHeight *wy);
    scrx = downscrx - Math.floor((mx-downx) / (wx / nblock));
    scry = downscry - Math.floor((my-downy) / (wy / nblock));

    e.preventDefault();
    drawcanout();
  }else if(e.touches.length == 2){
    const mx = e.touches[0].clientX;
    const my = e.touches[0].clientY;
    const mx2 = e.touches[1].clientX;
    const my2 = e.touches[1].clientY;
    const len0 = Math.sqrt((downx - downx2)**2 + (downy - downy2)**2);
    const len1 = Math.sqrt((mx - mx2)**2 + (my - my2)**2);
    const rate = len1 / len0;
    if(rate > 1.1){
      zoom(Math.floor(downnblock / rate));
    }else if(rate < 0.9){
      zoom(Math.floor(downnblock / rate));
    }
    //calculate fixed point
    const fx = (downx + downx2) / 2;
    const fy = (downy + downy2) / 2;
    const fx2 = (mx + mx2) / 2;
    const fy2 = (my + my2) / 2;
    scrx = downscrx + Math.floor((fx - fx2) / (wx / nblock));
    scry = downscry + Math.floor((fy2 - fy) / (wy / nblock));

    e.preventDefault();
    drawcanout();
  }
});
canout.addEventListener('touchend', (e) => {
  const wx = canout.width  / window.devicePixelRatio;
  const wy = canout.height / window.devicePixelRatio;
  const bx   = Math.floor((wx-2*margin_out)/(nblock+1));
  const by   = Math.floor((wy-2*margin_out)/(nblock+1));
  const mgnx = margin_out + bx;
  const mgny = margin_out;
  const mx   =      Math.floor((e.changedTouches[0].clientX - canout.getBoundingClientRect().left) * wx / canout.clientWidth);
  const my   = wy - Math.floor((e.changedTouches[0].clientY - canout.getBoundingClientRect().top ) * wy / canout.clientHeight);
  const dbx = Math.floor((downx - mgnx) / bx);
  const dby = Math.floor((downy - mgny) / by);
  const mbx = Math.floor((   mx - mgnx) / bx);
  const mby = Math.floor((   my - mgny) / by);
  if(dbx == mbx && dby == mby){ //click
    clickblock(mbx + scrx, mby + scry - 1);
    e.preventDefault();
    drawcanout();
    drawcanin();
  }
});

// by mouse
// zoom by mouse wheel
canout.addEventListener('wheel', function(e){
  const rate = 1.1;
  if(e.deltaY > 0){
    nblocknew = Math.floor(nblock*rate);
    if(nblocknew == nblock){
      nblocknew = nblock + 1;
    }
  }else{
    nblocknew = Math.floor(nblock/rate);
    if(nblocknew == nblock){
      nblocknew = nblock - 1;
    }
  }
  zoom(nblocknew);

  drawcanout();
  e.preventDefault();
  return false;
});
// mouse down (start to move or click)
canout.addEventListener('mousedown', (e) => {
  const wx = canout.width  / window.devicePixelRatio;
  const wy = canout.height / window.devicePixelRatio;
  //dragx = convert browserx to canbas x pixcel
  downx =      Math.floor((e.clientX - canout.getBoundingClientRect().left) /canout.clientWidth  *wx);
  downy = wy - Math.floor((e.clientY - canout.getBoundingClientRect().top ) /canout.clientHeight *wy);
  downscrx = scrx;
  downscry = scry;
  //debug out
  if(false){
    const bx   = Math.floor((wx-2*margin_out)/(nblock+1));
    const by   = Math.floor((wy-2*margin_out)/(nblock+1));
    const mgnx = margin_out + bx;
    const mgny = margin_out;
    const dbx = Math.floor((downx - mgnx) / bx);
    const dby = Math.floor((downy - mgny) / by);
  }
  dragging = true;
});
// mouse move (move)
canout.addEventListener('mousemove', (e) => {
  if(dragging){
    const wx = canout.width  / window.devicePixelRatio;
    const wy = canout.height / window.devicePixelRatio;
    const bx   = Math.floor((wx-2*margin_out)/(nblock+1));
    const by   = Math.floor((wy-2*margin_out)/(nblock+1));
    const mgnx = margin_out + bx;
    const mgny = margin_out;

    const mx =      Math.floor((e.clientX - canout.getBoundingClientRect().left) /canout.clientWidth  *wx);
    const my = wy - Math.floor((e.clientY - canout.getBoundingClientRect().top ) /canout.clientHeight *wy);
    
    const dbx = Math.floor((downx - mgnx) / bx);
    const dby = Math.floor((downy - mgny) / by);
    const mbx = Math.floor((   mx - mgnx) / bx);
    const mby = Math.floor((   my - mgny) / by);
    newscrx = downscrx - (mbx - dbx);
    newscry = downscry - (mby - dby);
    if(!isNaN(newscrx) && !isNaN(newscry)){
      scrx = newscrx;
      scry = newscry;
    }

    e.preventDefault();
    drawcanout();
  }
});
// mouse up (end to move or click)
canout.addEventListener('mouseup', (e) => {
  const wx = canout.width  / window.devicePixelRatio;
  const wy = canout.height / window.devicePixelRatio;
  const bx   = Math.floor((wx-2*margin_out)/(nblock+1));
  const by   = Math.floor((wy-2*margin_out)/(nblock+1));
  const mgnx = margin_out + bx;
  const mgny = margin_out;
  const mx =      Math.floor((e.clientX - canout.getBoundingClientRect().left) / canout.clientWidth  * wx);
  const my = wy - Math.floor((e.clientY - canout.getBoundingClientRect().top ) / canout.clientHeight * wy);
  const dbx = Math.floor((downx - mgnx) / bx);
  const dby = Math.floor((downy - mgny) / by);
  const mbx = Math.floor((   mx - mgnx) / bx);
  const mby = Math.floor((   my - mgny) / by);

  if(dbx == mbx && dby == mby){ //click
    clickblock(mbx + scrx, mby + scry - 1);
    e.preventDefault();
    drawcanout();
    drawcanin();
  }

  dragging = false;
});
const clickblock = function(x, y){
  vx = x;
  vy = y;
  const k=getkind(vx, vy);
  for(let j=0; j<nkind; j++){
    if(k == name2kind(form0.kinds[j].value)){
      form0.kinds[j].checked = true;
      break;
    }else{
      form0.kinds[j].checked = false;
    }
  }
};
canout.addEventListener('mouseout', (e) => {
  dragging = false;
});
// form events -------------------------------------------
// radio button
for(let i=0; i<nkind; i++){
  form0.kinds[i].addEventListener('click', function(){
    drawcanin();
  });
}
// keydown
document.addEventListener('keydown', function(e){
  if(e.key == 'r'){
    reset();
    e.preventDefault();
  }else if(e.key == ' '){
    proceed();
    e.preventDefault();
  }
});
// reset
const reset = function(){
  initmath();
  while(cx < scrx        ){ scrx--; nblock++; }
  while(cy < scry        ){ scry--; nblock++; }
  while(cx >= scrx+nblock){ scrx++; nblock++; }
  while(cy >= scry+nblock){ scry++; nblock++; }
  drawcanin();
  drawcanout();
  return false;
}
// proceed
const proceed = function(){
  const k = kind2name[getkind(cx, cy)];
  if(k == 'start'){
    cdirx = +1;
  }else if(k == 'diag'){
    if(cdirx == -1 && cdiry == -1){
    }else if(cdirx == -1 && cport == 0){//diagonal
      cdirx = -1;
      cdiry = -1;
    }else if(cdiry == +1){//incrementer
      cdiry = -1;
      cport ++;
    }else if(cdirx == +1){//reset
      cdirx = 0;
      cdiry = -1;
      cport = 0;
    }else if(cdiry == -1){//condition
      cdiry = +1;
    }else if(cdirx == -1){//go to amplifier
      cdirx = 0;
      cdiry = +1;
    }
  }else if(isFinite(k)){//prime
    if(cdiry == -1){//filter
      if(blockers[cport][prime2kind[k]]==1){//stop
        cdiry = +1;
      }else{
        //thru
      }
    }else if(cdiry == +1){//divisor
      if(cmode == 1){//waiting divisor
        if(eq2div[cport]==k){//divide
          cdiry = 0;
          cdirx = -1;
          cmode = 0;
        }else{
          //thru
        }
      }else{
        //thru
      }
    }else if(cdirx == -1){//goto diag
      //thru
    }else if(cdirx == +1){//reset equation
      cdirx = 0;
      cdiry = -1;
    }
  }else if(k == 'bottom'){
    cdiry = +1;
    cmode = 1;
  }else if(k.startsWith('amp')){
    const ie = parseInt(k.slice(3));
    if(eq2amp[cport] == ie){
      cdiry = 0;
      cdirx = +1;
    }else{
      //thru
    }
  }else if(k == 'thru'){
    //thru
  }
  cx += cdirx;
  cy += cdiry;

  while(cx < scrx        ){ scrx--; nblock++; }
  while(cy < scry        ){ scry--; nblock++; }
  while(cx >= scrx+nblock){ scrx++; nblock++; }
  while(cy >= scry+nblock){ scry++; nblock++; }

  vx = cx;
  vy = cy;
  clickblock(vx, vy);
  drawcanout();
  drawcanin();
  return false;
}
document.getElementById('reset').addEventListener('click', reset);
let intervalid = null;
let isfirst = true;
const looptoproceed = function(){
  if(true){
    proceed();
    if(isfirst){
      isfirst = false;
      intervalid = setTimeout(looptoproceed, 300);
    }else{
      intervalid = setTimeout(looptoproceed, 30);
    }
  }
}
const stoptoproceed = function(){
  clearInterval(intervalid);
  intervalid = null;
  isfirst = true;
}
document.getElementById('proceed').addEventListener('mousedown', looptoproceed);
document.getElementById('proceed').addEventListener('mouseup', stoptoproceed);
document.getElementById('proceed').addEventListener('mouseout', stoptoproceed);
document.getElementById('proceed').addEventListener('touchstart', looptoproceed);
document.getElementById('proceed').addEventListener('touchend', stoptoproceed);
document.getElementById('proceed').addEventListener('touchcancel', stoptoproceed);

// resize
const resize = function() {
  const mgnx = 40;
  const mgny = 0;
  const wx =  window.innerWidth  - mgnx;
  const wy = (window.innerHeight - mgny) / 2;
  const w = Math.min(wx, wy);
  
  const dpr = window.devicePixelRatio || 1;
  canin.width = w * dpr;
  canin.height = w * dpr;
  canout.width = w * dpr;
  canout.height = w * dpr;
  
  canin.style.width = `${w}px`;
  canin.style.height = `${w}px`;
  canout.style.width = `${w}px`;
  canout.style.height = `${w}px`;

  ctxin.scale(dpr, dpr);
  ctxout.scale(dpr, dpr);

  drawcanin();
  drawcanout();
};
window.addEventListener('resize', resize);
//zoom common
const zoom = function(nblocknew){
  const nblockmin = 2;
  const nblockmax = 1000;
  if(nblocknew < nblockmin){
    nblock = nblockmin;
  }else if(nblocknew > nblockmax){
    nblock = nblockmax;
  }else{
    nblock = nblocknew;
  }
}
//general functions -------------------------------------------
//convert real number to color
const real2color = (i, bmin=0, bmax=1) => {
  let r, g, b;
  if(i < 1/3){
    r = +1 -3*i;
    g = -0 +3*i;
    b =  0;
  }else if(i < 2/3){
    r =  0;
    g = +2 -3*i;
    b = -1 +3*i;
  }else{
    r = -2 +3*i;
    g = 0;
    b = +3 -3*i;
  }
  r = (r * (bmax - bmin) + bmin) * 255;
  g = (g * (bmax - bmin) + bmin) * 255;
  b = (b * (bmax - bmin) + bmin) * 255;
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
//find font size to fit the box
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

