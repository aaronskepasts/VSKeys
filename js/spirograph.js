const notesToRatios = [1,1.0625,1.125,1.1875,1.25,4/3,1.375,1.5,1.625,1.6875,1.75,1.875];
function addSpirograph(scene, color){
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = 2048;
    ctx.canvas.height = 2048;
    ctx.fillStyle = ConvertHexToString(color);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
    const texture = new THREE.CanvasTexture(ctx.canvas);
    //console.log(texture);
    
    const geometry = new THREE.PlaneGeometry( 9, 8, 2);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    let graph = new THREE.Mesh(geometry, material);
    graph.visible = false;
    graph.dir = 'pos';
    graph.customStr = '';
    graph.customSign = [];
    scene.spiro = graph;
    graph.txtr = texture;
    texture.ctx = ctx;
    graph.position.fromArray([6,-0.4,-5]);
    graph.rotateX(-Math.PI/2);
    scene.add(graph);
    scene.pitches = {};
    //drawGraph([0,4,7]);
  }
function updateSpiro(scene, pitch, on){
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
  drawGraph(pitches);
  scene.spiro.txtr.needsUpdate = true;
}
  
function drawGraph(notes){
  let ctx = scene.spiro.txtr.ctx;
  let signArr = scene.spiro.customSign;
  let alt = scene.spiro.dir == 'alt';
  let custom = scene.spiro.dir == 'custom';
  //console.log(signArr);
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
  //console.log(ctx);
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