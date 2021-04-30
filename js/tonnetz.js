const addTonnetz = (scene) => {
    const grid_size = 7;
    const side_len = 1;
    const corner = new THREE.Vector3(2.5,0,-6);
    const radius = 0.2
    const off = new THREE.MeshPhongMaterial( {color: 0x000000} );
    let sphereList = [];
    let bass = 0;
    //let numSpheres = 0;
    for (let i = 0; i<grid_size; i++){
        let z = i * Math.sqrt(3)/2 * side_len + corner.z;
        let row = i%2 ? grid_size +1: grid_size;
        for (let j = 0; j<row; j++){
            let x = j * side_len + corner.x;
            if (i%2 == 0){
                x+=side_len/2;
            }
            let sGeo = new THREE.SphereGeometry( radius, 16, 16 );
            let sphere = new THREE.Mesh( sGeo, off);
            sphere.position = new THREE.Vector3(x,corner.y,z);
            sphere.note = (bass+j*7)%12;
            sphere.onColor = noteToColor(sphere.note);
            sphere.offColor = off;
            //console.log(intToLetterName(sphere.note));
            scene.add( sphere );
            sphereList.push(sphere);
        }
        bass = i%2 ? bass+3: bass+8;
    }
    //console.log(sphereList);
    let lineList = [];
    const blackLine = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 20} );
    //const whiteLine = new THREE.LineBasicMaterial( { color: 0xffffff, opacity:0, transparent: true} );
    //console.log(MeshLine);
    for (let a of scene.children){
        for (let b of scene.children){
            //console.log(a.position,b.position);
            let inter = new THREE.Vector3().subVectors(a.position,b.position);
            if (inter.length() < side_len*1.2 && inter.length()>side_len*0.5){
                let lineGeo = new THREE.BufferGeometry();
                lineGeo.attributes.position = new THREE.BufferAttribute( new Float32Array([a.position.x,a.position.y,a.position.z,b.position.x,b.position.y,b.position.z]), 3);
                let line = new THREE.Line( lineGeo, blackLine );
                line.visible = false;
                line.adj = [Math.min(a.note,b.note),Math.max(a.note,b.note)];
                //line.on = blackLine;
                scene.add(line);
                lineList.push(line);
            }
        }
        //console.log(numClose,a.id);
    }
    /*
    let line = new MeshLine();
    line.setPoints([new THREE.Vector3(),new THREE.Vector3(4,1,4)]);
    line.morphNormals = [];
    line.faces = [];
    console.log(line);
    let blackMeshLine = new MeshLineMaterial( { color: 0x000000, linewidth: 20} );
    scene.add(new THREE.Mesh(line,blackMeshLine));
    */
    //console.log(lineList);
    scene.sphereList = sphereList;
    scene.lineList = lineList;
}
const updateGrid = (scene, chord) => {
    chord = chord.map((c)=>c%12);
    //console.log('unsorted',chord);
    chord = chord.sort(function(a, b) {
        return a - b;
      });
    //console.log('chord',chord);
    for (let s of scene.sphereList){
        s.material = s.offColor;
    }
    for (let c of chord){
        for (let s of scene.sphereList){
            if (s.note==c){
                s.material = s.onColor;
            }
        }
    }
    for (let l of scene.lineList){
        l.visible = false;
    }
    for (let i = 0; i<chord.length-1; i++){
        for (let j = i+1; j<chord.length; j++){
            for (let l of scene.lineList){
                if (l.adj[0]==chord[i] && l.adj[1]==chord[j]){
                    l.visible = true;
                }
            }
        }
    }
}