const notesToRatios = [1,1.0625,1.125,1.1875,1.25,4/3,1.375,1.5,1.625,1.6875,1.75,1.875];
function addSpirograph(scene, color){
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = 2048;
    ctx.canvas.height = 2048;
    ctx.fillStyle = ConvertHexToString(color);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const texture = new THREE.CanvasTexture(ctx.canvas);
    texture.wrapS = THREE.MirroredRepeatWrapping;
    //console.log(texture);

    const geometry = new THREE.PlaneGeometry( 9, 8, 2);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    let graph = new THREE.Mesh(geometry, material);
    graph.ctx = ctx;
    graph.material.side = THREE.DoubleSide;
    graph.visible = false;
    graph.dir = 'pos';
    graph.customStr = '';
    graph.customSign = [];
    graph.clock = new THREE.Clock(false);

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
  //console.log(pitches);
  //if (pitches.length>0){
  if (dim == 2){
    drawGraph(pitches);
    scene.spiro.material.map.needsUpdate = true;
  }
  if (dim == 2.5){
    console.log(scene.spiro.clock.getElapsedTime());
    scene.spiro.ctx.fillRect(0, 0, scene.spiro.ctx.canvas.width, scene.spiro.ctx.canvas.height);
    scene.spiro.clock.start();
    scene.spiro.clock.elapsedTime = 0;
    scene.spiro.material.map.needsUpdate = true;
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
  //console.log(signArr);
  //console.log(ctx);
  notes.sort(function(a,b){return a - b});
  let min = notes[0];
  ctx.strokeStyle = '#'+noteToColor(min).color.getHexString();
  notes = notes.map(function(val){return val - min;});
  let freq = [];
  let freqSum = 0;
  for (let n of notes){
    let f = notesToRatios[n%12]*Math.pow(2,Math.floor(n/12));
    freqSum+=1/f;
    freq.push(f);
  }
  //console.log(freqSum);
  const center = ctx.canvas.height/2;
  const scale = center/(freqSum);
  ctx.moveTo(center+freqSum, center);
  ctx.beginPath();
  for (let t = 0; t<Math.PI*96; t+=0.125){
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
    ctx.lineTo(x,y);
  }
  //console.log('drawn');
  //ctx.lineTo(250, 140);
  ctx.closePath();
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
  let z = -5;
  for (let t = 0; t<Math.PI*96; t+=0.125){
    let x = 6;
    let y = 2;
    for (let i = 0; i<freq.length; i++){
      let r = freq[i];
      let sign = 1;
      if (custom && i<signArr.length) sign = signArr[i];
      if (alt) sign = i%2 == 0 ? 1: -1;
      x+=scale*Math.sin(r*t*sign)/r;
      y+=scale*Math.cos(r*t*sign)/r;
    }
    z += 0.00125;
    points.push( new THREE.Vector3( x, y,z ) );
  }
  scene.spiro3D.geometry = new THREE.BufferGeometry().setFromPoints( points );
  scene.spiro3D.material = new THREE.PointsMaterial({ color: '#'+noteToColor(min).color.getHexString(), size: 0.1 });
}

function animateSpiro(notes){
  let ctx = scene.spiro.ctx;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (notes.length == 0) return;

  let signArr = scene.spiro.customSign;
  let alt = scene.spiro.dir == 'alt';
  let custom = scene.spiro.dir == 'custom';
  //console.log(signArr);
  //console.log(ctx);
  notes.sort(function(a,b){return a - b});
  let min = notes[0];
  ctx.strokeStyle = '#'+noteToColor(min).color.getHexString();
  notes = notes.map(function(val){return val - min;});
  let freq = [];
  let freqSum = 0;
  for (let n of notes){
    let f = notesToRatios[n%12]*Math.pow(2,Math.floor(n/12));
    freqSum+=1/f;
    freq.push(f);
  }
  //console.log(freqSum);
  const center = ctx.canvas.height/2;
  const scale = center/(freqSum);
  ctx.moveTo(center+freqSum, center);
  ctx.beginPath();
  for (let t = 0; t<Math.PI*96; t+=0.125){
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
    ctx.lineTo(x,y);
  }
  //console.log('drawn');
  //ctx.lineTo(250, 140);
  ctx.closePath();
  ctx.stroke();
}