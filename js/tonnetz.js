const addTonnetz = (scene) => {
    const rt3o2 = Math.sqrt(3)/2;
    const grid_size = 9;
    const side_len = 1;
    const radius = 0.05;
    const front_center = new THREE.Vector3(5.5,0,-1.5);
    const corner = new THREE.Vector3(front_center.x-(grid_size-1)/2,0,front_center.z-rt3o2*(grid_size-1));
    const off = new THREE.MeshPhongMaterial( {color: 0xffffff} );
    const sGeo = new THREE.SphereGeometry( radius, 16, 16 );
    let sphereList = [];
    let bass = 0;
    //let numSpheres = 0;
    for (let i = 0; i<grid_size; i++){
        let z = i * rt3o2 * side_len + corner.z;
        let row = i%2 ? grid_size +1: grid_size;
        for (let j = 0; j<row; j++){
            let x = j * side_len + corner.x;
            if (i%2 == 0){
                x+=side_len/2;
            }
            let sphere = new THREE.Mesh( sGeo, off);
            sphere.position.fromArray([x,corner.y,z]);
            sphere.minHeight = sphere.position.y;
            sphere.maxHeight = controls.sphereJump;
            sphere.note = (bass+j*7)%12;
            sphere.onColor = noteToColor(sphere.note);
            sphere.offColor = off;
            sphere.on = false;
            sphere.clock = new THREE.Clock(false);
            //console.log(intToLetterName(sphere.note));
            scene.add( sphere );
            sphereList.push(sphere);
        }
        bass = i%2 ? bass+3: bass+8;
    }
    let lineList = [];
    const blackLine = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 20} );
    //const whiteLine = new THREE.LineBasicMaterial( { color: 0xffffff, opacity:0, transparent: true} );
    //console.log(MeshLine);
    for (let a of sphereList){
        for (let b of sphereList){
            //console.log(a.position,b.position);
            let inter = new THREE.Vector3().subVectors(a.position,b.position);
            if (inter.length() < side_len*1.2 && inter.length()>side_len*0.5){
                let lineGeo = new THREE.BufferGeometry();
                lineGeo.attributes.position = new THREE.BufferAttribute( new Float32Array(spheresToPosArray(a,b)), 3);
                let line = new THREE.Line( lineGeo, blackLine );
                line.visible = false;
                line.adjSpheres = [a,b];
                line.adjNotes = [Math.min(a.note,b.note),Math.max(a.note,b.note)];
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
    scene.chord = [0,0,0,0,0,0,0,0,0,0,0,0];
}
const updateTonnetz = (scene, note, on) => {
    /*
    for (let s of scene.sphereList){
        s.material = s.offColor;
        //s.visible = false;
    }*/
    note%=12;
    if (on){
        scene.chord[note]++;
        for (let s of scene.sphereList){
            if (s.note==note){
                if (s.on != true){
                    s.clock.start();
                    s.clock.elapsedTime = 0;
                }
                s.material = s.onColor;
                s.on = true;
                //console.log(note);
                //s.visible = true;
            }
        }
    } else {
        scene.chord[note]--;
        if (scene.chord[note] <= 0){
            for (let s of scene.sphereList){
                if (s.note==note){
                    if (s.on != false){
                        s.clock.start();
                        s.clock.elapsedTime = 0;
                    }
                    s.material = s.offColor;
                    s.on = false;
                    //s.visible = true;
                }
            }
        }
    }
    //console.log(note, scene.chord, on);
    for (let l of scene.lineList){
        l.visible = false;
    }
    let chord = [];
    for (let i in scene.chord){
        if (scene.chord[i]>0){
            chord.push(parseInt(i));
        }
    }
    chord.sort(function(a,b){return a - b});
    for (let i = 0; i<chord.length-1; i++){
        for (let j = i+1; j<chord.length; j++){
            for (let l of scene.lineList){
                if (l.adjNotes[0]==chord[i] && l.adjNotes[1]==chord[j]){
                    l.visible = true;
                }
            }
        }
    }
}
const animateTonnetz = (scene) =>{
    for (let s of scene.sphereList){
        //console.log(s);
        if (s.on == true){
            if (s.scale.y==controls.sphereJump){
                s.on = 2;
                //s.scale.multiplyScalar(1.5);
            } else{
                let h =mix(s.minHeight,controls.sphereJump, smoothstep(0.0, 1.0, controls.key_attack_time*s.clock.getElapsedTime()));
                s.maxHeight = h;
                //s.position.y = h;
                s.scale.fromArray([h+1,h+1,h+1]);
                //console.log(h)
            }
        }
        if (s.on == false){
            if (s.scale.y==1){
                s.on = 2;
            } else{
                let h = mix(s.maxHeight,0, smoothstep(0.0, 1.0, controls.key_attack_time*s.clock.getElapsedTime()));
                s.scale.fromArray([h+1,h+1,h+1]);
                //s.position.y=h;
                s.minHeight = h;
                //console.log(h)
            }
        }
    }
}
/*
const animateTonnetzLines = (scene) =>{
    for (let l of scene.lineList){
        let posArray = l.geometry.attributes.position.array;
        let newPos = spheresToPosArray(l.adjSpheres[0],l.adjSpheres[1]);
        for (let i = 0; i<posArray.length; i++){
            posArray[i] = newPos[i];
        }
    }
    console.log(scene.lineList[0].geometry.attributes.position.array);
}*/
const spheresToPosArray = (a,b)=>{
    return [a.position.x,a.position.y,a.position.z,b.position.x,b.position.y,b.position.z];
}