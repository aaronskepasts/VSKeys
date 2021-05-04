function addSpirograph3D(scene){
  const material = new THREE.LineBasicMaterial({
	color: 0x0000ff,
  linewidth: 1
  });

  var geometry = new THREE.BufferGeometry()

  var line = new THREE.Line( geometry, material );
  line.visible = false;

  line.name = "oldLine"
  scene.spiro3D = line;
  scene.spiro3D.material = material
  scene.add(line);
  scene.counter = 0;
}




function updateSpiro3D(scene, pitch, on){
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
  // console.log(pitches);
  //if (pitches.length>0){
  draw3DGraph(pitches);
}
function draw3DGraph(notes){
  // remove past lines
  scene.remove( scene.getObjectByName(scene.spiro3D.name) );


  let alt = scene.spiro.dir == 'alt';
  let custom = scene.spiro.dir == 'custom';

  // if (scene.counter == 0){
  //   points.push( new THREE.Vector3( 6,-0.4,-9 ) );
  //   points.push( new THREE.Vector3( 0, 10, 0 ) );
  //   points.push( new THREE.Vector3( 10, 0, 0 ) );
  //   console.log(scene.counter);
  //   scene.counter = 1;
  // } else if (scene.counter == 1){
  //   points.push( new THREE.Vector3( - 10, 0, 0 ) );
  //   points.push( new THREE.Vector3( 0, 10, 0 ) );
  //   points.push( new THREE.Vector3( 10, 10, 0 ) );
  //   scene.counter = 2;
  // } else {
  // points.push( new THREE.Vector3( - 10, 0, 0 ) );
  // points.push( new THREE.Vector3( 0, 10, 0 ) );
  // points.push( new THREE.Vector3( 10, 0, 0 ) );
  // console.log(scene.counter);
  // }
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
  let z = -9
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
      z += 0.001;
    }
    points.push( new THREE.Vector3( x, y,z ) );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const line = new THREE.Line( geometry, scene.spiro3D.material );
  line.name = "oldLine"
  scene.add(line);
  // let ctx = scene.spiro.txtr.ctx;
  // let signArr = scene.spiro3D.customSign;
  // let alt = scene.spiro.dir == 'alt';
  // let custom = scene.spiro.dir == 'custom';
  // //console.log(signArr);
  // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // //console.log(ctx);
  // notes.sort(function(a,b){return a - b});
  // let min = notes[0];
  // notes = notes.map(function(val){return val - min;});
  // let freq = [];
  // let freqSum = 0;
  // for (let n of notes){
  //   let f = notesToRatios[n%12]*Math.pow(2,Math.floor(n/12));
  //   freqSum+=1/f;
  //   freq.push(f);
  // }
  // //console.log(freqSum);
  // const center = ctx.canvas.height/2;
  // const scale = center/(freqSum);
  // ctx.moveTo(center+freqSum, center);
  // ctx.beginPath();
  // for (let t = 0; t<Math.PI*96; t+=0.125){
  //   let x = center;
  //   let y = center;
  //   for (let i = 0; i<freq.length; i++){
  //     r = freq[i];
  //     let sign = 1;
  //     if (custom && i<signArr.length) sign = signArr[i];
  //     if (alt) sign = i%2 == 0 ? 1: -1;
  //     x+=scale*Math.sin(r*t*sign)/r;
  //     y+=scale*Math.cos(r*t*sign)/r;
  //   }
  //   ctx.lineTo(x,y);
  // }
}
