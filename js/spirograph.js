const notesToRatios = [1,1.0625,1.125,1.1875,1.25,4/3,1.375,1.5,1.625,1.6875,1.75,1.875];
function addSpirograph(scene, color){
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = 2048;
    ctx.canvas.height = 2048;
    ctx.fillStyle = ConvertHexToString(controls.floorColor);
    ctx.lineWidth = 2;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const texture = new THREE.CanvasTexture(ctx.canvas);
    texture.wrapS = THREE.MirroredRepeatWrapping;
    //console.log(texture);
    const geometry = new THREE.PlaneGeometry( 8, 8, 2);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    let graph = new THREE.Mesh(geometry, material);
    graph.ctx = ctx;
    graph.material.side = THREE.DoubleSide;
    graph.visible = false;
    graph.dir = 'alt';
    graph.customStr = '';
    graph.customSign = [];
    graph.clock = new THREE.Clock(false);
    graph.freqSum = 0;
    graph.arrows = new THREE.Group();

    scene.spiro = graph;
    graph.position.fromArray([6,-0.4,-5]);
    graph.rotateX(-Math.PI/2);
    scene.add(graph);

    // 3D line
    // let mat = new THREE.LineBasicMaterial({color: 0x0000ff,linewidth: 1});
    let geo = new THREE.BufferGeometry();

    // var line = new THREE.Line( geo, mat );
    // line.visible = false;
    // scene.spiro3D = line;
    // scene.add(line);

    const pMat = new THREE.PointsMaterial({ color: color, size: 0.1 });
    var particles = new THREE.Points(geo, pMat);
    particles.visible = false;
    particles.position.fromArray([6, 2, -5]);
    scene.spiro3D = particles;
    scene.spiro3D.color = color;

    scene.add(particles);

    scene.pitches = {};
    //drawGraph([0,4,7]);
  }
function updateSpiro(scene, pitch, on, dim){
  if (on){
      scene.pitches[pitch]=true;
  } else {
      scene.pitches[pitch]=false;
  }

  let pitches = [];
  for (let i in scene.pitches){
      if (scene.pitches[i]){
          pitches.push(parseInt(i));
      }
  }
  let s = scene.spiro;
  let min;
  if (pitches.length > 0){
    pitches.sort(function(a,b){return a - b});
    min = pitches[0];
    pitches = pitches.map(function(val){return val - min;});
    s.ctx.color = noteToColor(pitches[pitches.length - 1]+min).color.clone();
    s.ctx.palette = s.ctx.color.clone();
    s.ctx.strokeStyle = '#'+s.ctx.color.getHexString();
    scene.spiro3D.material.color = noteToColor(min).color;
  }
  let freq = [];
  let freqSum = 0;
  for (let n of pitches){
    let f = notesToRatios[n%12]*Math.pow(2,Math.floor(n/12));
    freqSum+=1/f;
    freq.push(f);
  }
  s.freq = freq;
  s.freqSum = freqSum;
  //console.log(pitches);
  //if (pitches.length>0){
  if (dim == 2){
    s.ctx.lineWidth = 2;
    drawGraph(pitches);
    s.material.map.needsUpdate = true;
  }
  if (dim == 2.5){
    s.ctx.lineWidth = 10;
    //for (let a of s.arrows.children) a.dispose();
    //console.log(scene.spiro.clock.getElapsedTime());
    s.ctx.fillRect(0, 0, s.ctx.canvas.width, s.ctx.canvas.height);
    s.clock.start();
    s.clock.elapsedTime = 0;
    s.material.map.needsUpdate = true;
    
    //console.log(freq, freqSum);
    scene.remove(s.arrows);
    s.arrows = new THREE.Group();
    if (pitches.length > 0){
      const ceil = 5;
      let root = new THREE.Vector3(6,ceil,-5);
      for (let i = 0; i < pitches.length; i++){
        let dir = new THREE.Vector3(0,-1,0.73);
        dir.normalize();
        dir.applyAxisAngle(up,-0.015);
        let height = (ceil+0.4)/(freq[i]*freqSum);
        let arrow_length = height*1.238;
        let arrow = new THREE.ArrowHelper(dir,root,arrow_length,
          parseInt(noteToColor(min+pitches[i]).color.getHexString(),16),0.25,0.1);
        arrow.dir = dir;
        arrow.len = arrow_length;
        s.arrows.add(arrow);
        
        root = root.clone().addScaledVector(dir,arrow_length);
      }
      scene.add(s.arrows);
    }
  }
  if (dim == 3){
    scene.spiro3D.geometry.dispose();
    if (pitches.length>0) draw3DGraph(pitches);
    else scene.spiro3D.geometry = new THREE.BufferGeometry();
  }
}

function drawGraph(notes){
  let ctx = scene.spiro.ctx;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (notes.length == 0) return;

  let signArr = scene.spiro.customSign;
  let alt = scene.spiro.dir == 'alt';
  let custom = scene.spiro.dir == 'custom';
  const freq = scene.spiro.freq;
  const freqSum = scene.spiro.freqSum;
  const step = 0.125;
  const center = ctx.canvas.height/2;
  const scale = center/freqSum;
  const para = (t) =>{
    let x = center;
    let y = center;
    for (let i = 0; i<freq.length; i++){
      r = freq[i];
      let sign = 1;
      if (custom && i<signArr.length) sign = signArr[i];
      if (alt) sign = i%2 == 0 ? 1: -1;
      x+=scale*Math.sin(r*t*sign)/r;
      y+=scale*Math.cos(r*t*sign)/r;
    }
    return [x,y];
  }
  //ctx.moveTo(center+freqSum, center);
  ctx.beginPath();
  for (let t = 0; t<96*Math.PI; t+=step){
    let [x,y] = para(t);
    ctx.lineTo(x,y);
  }
  //console.log('drawn');
  //ctx.lineTo(250, 140);
  //ctx.closePath();
  ctx.stroke();
}

function ConvertHexToString(str) {
  //console.log(str.toString(16));
  let hex = '#'+str.toString(16);
  //let tri = hex.charAt(0)+hex.charAt(1)+hex.charAt(3)+hex.charAt(5);
  return hex;
}

function draw3DGraph(notes){
  let alt = scene.spiro.dir == 'alt';
  let custom = scene.spiro.dir == 'custom';
  // store spiro3D points and set start point
  const points = [];
  // points.push( new THREE.Vector3( 6, 0,-9 ) );

  notes.sort(function(a,b){return a - b});
  let min = notes[0];
  notes = notes.map(function(val){return val - min;});
  let freq = [];
  let freqSum = 0;
  for (let n of notes){
    let f = notesToRatios[n%12]*Math.pow(2,Math.floor(n/12));
    freqSum+=1/f;
    freq.push(f);
  }

  const scale = 2/(freqSum);
  let z = -Math.PI*96/0.125*0.0013/2;
  for (let t = 0; t<Math.PI*96; t+=0.125){
    let x = 0;
    let y = 0;
    for (let i = 0; i<freq.length; i++){
      let r = freq[i];
      let sign = 1;
      if (custom && i<signArr.length) sign = signArr[i];
      if (alt) sign = i%2 == 0 ? 1: -1;
      x+=scale*Math.sin(r*t*sign)/r;
      y+=scale*Math.cos(r*t*sign)/r;
    }
    z += 0.0013;
    points.push( new THREE.Vector3( x, y,z ) );
  }
  scene.spiro3D.geometry = new THREE.BufferGeometry().setFromPoints( points );
}

function animateSpiro(delta){
  let ctx = scene.spiro.ctx;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let signArr = scene.spiro.customSign;
  let alt = scene.spiro.dir == 'alt';
  let custom = scene.spiro.dir == 'custom';
  //console.log(signArr);
  //console.log(ctx);
  //console.log(freqSum);
  const freq = scene.spiro.freq;
  const freqSum = scene.spiro.freqSum;
  const tailLength = 16*freqSum;
  const center = ctx.canvas.height/2;
  const scale = (center-10)/freqSum;

  const originalColor = ctx.strokeStyle;
  const col = ctx.color;
  
  let end = scene.spiro.clock.getElapsedTime()*controls.spiroSpeed;
  let start = Math.max(0,end-tailLength);
  let increment = Math.min(end/32,0.125);
  
  const para = (t)=>{
    let x = center;
    let y = center;
    for (let i = 0; i<freq.length; i++){
      r = freq[i];
      let sign = 1;
      if (custom && i<signArr.length) sign = signArr[i];
      if (alt) sign = i%2 == 0 ? 1: -1;
      x+=scale*Math.sin(r*t*sign)/r;
      y+=scale*Math.cos(r*t*sign)/r;
    }
    return [x,y];
  }

  ctx.strokeStyle = '#000000';
  ctx.beginPath();
  for (let t = 0; t<start; t+=increment){
    let [x,y] = para(t);
    ctx.lineTo(x,y);
  }
  ctx.stroke();
  for (let t = start; t<end; t+=increment){
    let [x,y] = para(t);
    ctx.lineTo(x,y);
    let pal = ctx.palette.copy(col).lerpHSL(black, 1- ((t-start)/(end-start)));
    ctx.strokeStyle = '#'+  pal.getHexString();
    //console.log(pal.getHexString());
    ctx.stroke();
    ctx.beginPath();
    ctx.lineTo(x,y);
  }
  let [x,y] = para(end);
  ctx.lineTo(x,y);
  ctx.stroke();
  ctx.arc(x,y,10,0,Math.PI*2);
  ctx.stroke();
  //console.log('done',col.getHexString());
  ctx.strokeStyle = originalColor;
  scene.spiro.material.map.needsUpdate = true;

  animateArrows(delta, freq, alt, custom, signArr);
}

function animateArrows(delta, freq, alt, custom, signArr){
  let arrows = scene.spiro.arrows.children;
  let prevEnd;
  for (let i = 0; i < arrows.length; i++){
    let a = arrows[i];

    let sign = 1;
    if (custom && i<signArr.length) sign = signArr[i];
    if (alt) sign = i%2 == 0 ? 1: -1;

    a.dir.applyAxisAngle(up, controls.spiroSpeed*sign*delta*freq[i]);
    a.setDirection(a.dir);
    if (i > 0) {
      a.position.copy(prevEnd);
    }
    prevEnd = a.position.clone().addScaledVector(a.dir,a.len);
    //a.rotateY(0.0125);
  }
}