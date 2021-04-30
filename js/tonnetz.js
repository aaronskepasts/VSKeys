const addTonnetz = (scene) => {
    const grid_size = 7;
    const side_len = 1;
    const corner = new THREE.Vector3(3,0,-6);
    const radius = 0.2
    const smaterial = new THREE.MeshPhongMaterial( {color: 0xffffff} );
    for (let i = 0; i<grid_size; i++){
        let z = i * Math.sqrt(3)/2 * side_len + corner.z;
        row = i%2 ? grid_size +1: grid_size;
        for (let j = 0; j<row; j++){
            let x = j * side_len + corner.x;
            if (i%2 == 0){
                x+=side_len/2;
            }
            let sgeometry = new THREE.SphereGeometry( radius, 16, 16 );
            let sphere = new THREE.Mesh( sgeometry, smaterial );
            sphere.position = new THREE.Vector3(x,corner.y,z);
            scene.add( sphere );
        }
    }
    //console.log(scene.children);
    const lineMat = new THREE.LineBasicMaterial( { color: 0x000000 } );
    for (let a of scene.children){
        let numClose = 0;
        for (let b of scene.children){
            //console.log(a.position,b.position);
            let inter = new THREE.Vector3().subVectors(a.position,b.position);
            if (inter.length() < side_len*1.2 && inter.length()>side_len*0.5){
                numClose++;
                let lineGeo = new THREE.BufferGeometry();
                //console.log(lineGeo);
                lineGeo.attributes.position = new THREE.BufferAttribute( new Float32Array([a.position.x,a.position.y,a.position.z,b.position.x,b.position.y,b.position.z]), 3);
                scene.add(new THREE.Line( lineGeo, lineMat ));
            }
        }
        //console.log(numClose,a.id);
    }
    //console.log(sphere);
}
    