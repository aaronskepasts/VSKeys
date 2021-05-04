function initialize_keys( obj)
{
    keys_obj.push(obj);
    obj.rotation.x = -Math.PI/4.0;
    obj.rotation.y = 0;
    obj.rotation.z = 0;
    obj.keyState = keyState.unpressed;
    obj.clock = new THREE.Clock(false);
    obj.castShadow = true;
    obj.receiveShadow = true;

    // only add meshes in the material redefinition (to make keys change their color when pressed)
    if (obj instanceof THREE.Mesh)
    {
        //console.log(obj);
        old_material = obj.material;
        obj.material = new THREE.MeshPhongMaterial( { color:old_material.color} );
        obj.material.shininess = 35.0;
        obj.material.specular = new THREE.Color().setRGB(0.25, 0.25, 0.25);;
        obj.material.note_off = obj.material.color.clone();
        obj.material.note_on = noteToColor(parseInt(obj.name.slice(1))).color;
    }
}
function initialize_tutorial (scene){
    var loader = new THREE.FontLoader();
    loader.load( 'fonts/droid_serif_bold.typeface.json', function ( font ) {
        let textSettings = {
            font: font,
            size: 1.75,
            height: 0.6,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.05,
            bevelSegments: 3
        };
        evenKeySpacing();
        let textMat = new THREE.MeshPhongMaterial({color:0x000000});
        let key_offset = 0.29;
        let keyLabels = new THREE.Group();
        let hideableLabels = [];
        let white_keys = ['Shift','Z','X','C','V','B','N','M',',','.','/','Tab','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'];
        for (let i = 0; i<white_keys.length; i++){
            var geometry = new THREE.TextGeometry( white_keys[i], textSettings);
            var mesh = new THREE.Mesh( geometry, textMat );
            mesh.scale.fromArray([0.1,0.1,0.1]);
            mesh.rotation.fromArray([-Math.PI/2,0,0]);
            mesh.position.fromArray([2.22+key_offset*i,-0.31,1.2]);
            if (i == 0 || i == 11) {
                mesh.rotateZ(Math.PI/2);
                mesh.translateX(-0.175);
            }
            else if (i == 7){mesh.translateX(-0.21);}
            else if (i >= 8 && i <=10) {mesh.translateX(-0.125)}
            else if (i == 19|| i==24) {mesh.translateX(-0.15);}
            else if (i == 13) {mesh.translateX(-0.22);}
            else if (i>13) {mesh.translateX(-0.175);}
            else {mesh.translateX(-0.175);}
            if (i>white_keys.length-3){
                hideableLabels.push(mesh);
            }
            keyLabels.add( mesh );
        }
        textSettings.height = 0.1;
        let black_keys = ['A','S','D','','G','H','','K','L',';','','1','2','','4','5','6','','8','9','','-','=','bksp'];
        for (let i = 0; i<black_keys.length; i++){
            if(!black_keys[i]){continue;}
            var geometry = new THREE.TextGeometry( black_keys[i], textSettings);
            var mesh = new THREE.Mesh( geometry, textMat );
            mesh.scale.fromArray([0.1,0.1,0.1]);
            mesh.rotation.fromArray([-Math.PI/2,0,0]);
            mesh.position.fromArray([2.2+key_offset*i,-0.125,-0.6]);
            if (i==9) mesh.translateX(0.05);
            keyLabels.add( mesh );
            if (i>black_keys.length-3){
                hideableLabels.push(mesh);
            }
        }
        geometry = new THREE.TextGeometry( 'Toggle Octave: CapsLock', textSettings);
        mesh = new THREE.Mesh( geometry, textMat );
        mesh.scale.fromArray([0.1,0.1,0.1]);
        mesh.rotation.fromArray([-Math.PI/2,0,0]);
        mesh.position.fromArray([4.4,-0.4,1.75]);
        keyLabels.add( mesh );
        scene.add(keyLabels);
        keyLabels.hideable = hideableLabels;
        scene.keyLabels = keyLabels;
    });
}
function moveKeyLabels(){
    let h = scene.keyLabels.hideable;
    if (controls.tutorial){
        for (let key of scene.keyLabels.children){key.visible = true;}
        if (controls.octave == 3){
            //console.log(h);
            for (let key of h){key.visible = false;}
        }
    } else{
        for (let key of scene.keyLabels.children){key.visible = false;}
    }
    scene.keyLabels.position.fromArray([2.03*(controls.octave-1),0,0]);
}
function evenKeySpacing(){
    const keySpace = 29;
    const xCenter = 0;
    let numWhite = 0;
    let numBlack = 0;
    for (let i = 0; i < keys_obj.length-2; i++){
        let mod = i%12;
        if (mod == 1 ||mod == 3 ||mod == 6 ||mod == 8 ||mod == 10){
            scene.getObjectByName('_'+i, true).position.x = xCenter-62+keySpace*numBlack;
            numBlack++;
            if (mod == 3 || mod == 10){
                numBlack++;
            }
        }else {
            scene.getObjectByName('_'+i, true).position.x = xCenter-77+keySpace*numWhite;
            numWhite++;
        }
    }
}
function key_status (keyName, status)
{
    var obj = scene.getObjectByName(keyName, true);
    //console.log(keyName);
    let note = parseInt(keyName.substring(1));
    if (obj !== undefined){
        obj.clock.start();
        obj.clock.elapsedTime = 0;
        obj.keyState = status;
        //console.log(obj,note);
        obj.material.color = (status == keyState.note_on) ? obj.material.note_on: obj.material.note_off;
        if (status == keyState.note_on){
            if (controls.instrument == 'AMSynth'){
                //console.log(intToLetterName(note));
                let velocity = Math.pow(2,-note/12);
                AMSynth.triggerAttack(intToLetterName(note+12),0,velocity*1.5);
                //console.log(note);
            }
            if (controls.instrument == 'piano'){
                piano.triggerAttack(intToLetterName(note));
                /*var delay = 0; // play one note every quarter second
                var note = note+21; // the MIDI note
                var velocity = 127; // how hard the note hits
                MIDI.setVolume(0, 127);
                MIDI.noteOn(0, note, velocity, delay);*/
            }
            if (controls.visualize == 'tonnetz'){
                updateTonnetz(scene,note,true);
            }
            if (controls.visualize == 'spiro'){
                updateSpiro(scene, note, true, 2);
            }
            if (controls.visualize == 'spiro3D'){
                updateSpiro(scene, note, true, 3);
            }
        }
        if (status == keyState.note_off){
            if (controls.instrument == 'AMSynth'){
                AMSynth.triggerRelease(intToLetterName(note+12));
            }
            if (controls.instrument == 'piano'){
                piano.triggerRelease(intToLetterName(note));
                /*var delay = 0; // play one note every quarter second
                var note = note+21;
                var velocity = 127;// how hard the note hits
                MIDI.setVolume(0, 127);
                MIDI.noteOff(0, note, delay + 0.08);*/
            }
            if (controls.visualize == 'tonnetz'){
                updateTonnetz(scene,note,false);
            }
            if (controls.visualize == 'spiro'){
                updateSpiro(scene, note, false, 2);
            }
            if (controls.visualize == 'spiro3D'){
                updateSpiro(scene, note, false, 3);
            }
        }
        //console.log(chordStack);
    }
}
const updateOctave = (ev) => {
    if (ev.key == 'CapsLock'){
        if (ev.type == 'keydown'){
            controls.octave=2;
        }else {
            controls.octave=1;
        }
        if (ev.key == 'CapsLock'){
            let trollers = controls.gui.__controllers;
            for (let c of trollers){
                if (c.property=='octave'){
                    c.setValue(controls.octave);
                }
            }
        }
        //console.log('octave');
        if (controls.tutorial){
            moveKeyLabels();
        }
        releaseKeys();
        return true;
    }
    return false;
    //console.log(controls.key_color_scheme);
}
const releaseKeys = () => {
    //console.log('release keys');
    //console.log(Parser.parseCommands());
    for (keyCode in keys_down){
        if (keys_down[keyCode]){
            console.log(keyCode);
            var note = keyCode_to_note(keyCode);
            key_status('_'+note, keyState.note_off);
        }
    }
    piano.releaseAll();
    AMSynth.releaseAll();
}

function smoothstep(a,b,x)
{
    if( x<a ) return 0.0;
    if( x>b ) return 1.0;
    var y = (x-a)/(b-a);
    return y*y*(3.0-2.0*y);
}
function mix(a,b,x)
{
    return a + (b - a)*Math.min(Math.max(x,0.0),1.0);
}
function update_key( obj, delta ){
    if (obj.keyState == keyState.note_on)
    {
        //console.log('updating');
        obj.rotation.x = mix(-Math.PI/4.0, -controls.key_max_rotation, smoothstep(0.0, 1.0, controls.key_attack_time*obj.clock.getElapsedTime()));
        if (obj.rotation.x >= -controls.key_max_rotation)
        {
            //console.log('deactivate');
            obj.keyState = keyState.pressed;
            obj.clock.elapsedTime = 0;
        }
    }
    else if (obj.keyState == keyState.note_off)
    {
        //console.log('updating');
        obj.rotation.x = mix(-controls.key_max_rotation, -Math.PI/4.0, smoothstep(0.0, 1.0, controls.key_attack_time*obj.clock.getElapsedTime()));

        if (obj.rotation.x <= -Math.PI/4.0)
        {
            //console.log('deactivate');
            obj.keyState = keyState.unpressed;
            obj.clock.elapsedTime = 0;
            AMSynth.triggerRelease(intToLetterName(parseInt(obj.name.substring(1))+12));
            piano.triggerRelease(intToLetterName(parseInt(obj.name.substring(1))));
        }
    }
}
const intToLetterName = (n) =>{
    let letter;
    switch (n%12){
        case 0:
            letter = 'C';
            break;
        case 1:
            letter = 'Db';
            break;
        case 2:
            letter = 'D';
            break;
            case 3:
            letter = 'Eb';
            break;
        case 4:
            letter = 'E';
            break;
        case 5:
            letter = 'F';
            break;
            case 6:
                letter = 'Gb';
            break;
        case 7:
            letter = 'G';
            break;
        case 8:
            letter = 'Ab';
            break;
            case 9:
                letter = 'A';
                break;
        case 10:
            letter = 'Bb';
            break;
            case 11:
            letter = 'B';
            break;
        }
    return letter + String(Math.floor(n/12));
}

function keyCode_to_note( keyCode)
{
    var note = -1;
    //console.log(keyCode,controls.octave);
    if(keyCode==16) note=5;
    if(keyCode==65) note=6;
    if(keyCode==90) note=7;
    if(keyCode==83) note=8;
    if(keyCode==88) note=9;
    if(keyCode==68) note=10;
    if(keyCode==67) note=11;
    if(keyCode==86) note=12;
    if(keyCode==71) note=13;
    if(keyCode==66) note=14;
    if(keyCode==72) note=15;
    if(keyCode==78) note=16;
    if(keyCode==77) note=17;
    if(keyCode==75) note=18;
    if(keyCode==188) note=19;
    if(keyCode==76) note=20;
    if(keyCode==190) note=21;
    if(keyCode==186) note=22;
    if(keyCode==191) note=23;
    if(keyCode==9) note=24;
    if(keyCode==49) note=25;
    if(keyCode==81) note=26;
    if(keyCode==50) note=27;
    if(keyCode==87) note=28;
    if(keyCode==69) note=29;
    if(keyCode==52) note=30;
    if(keyCode==82) note=31;
    if(keyCode==53) note=32;
    if(keyCode==84) note=33;
    if(keyCode==54) note=34;
    if(keyCode==89) note=35;
    if(keyCode==85) note=36;
    if(keyCode==56) note=37;
    if(keyCode==73) note=38;
    if(keyCode==57) note=39;
    if(keyCode==79) note=40;
    if(keyCode==80) note=41;
    if(keyCode==189) note=42;
    if(keyCode==219) note=43;
    if(keyCode==187) note=44;
    if(keyCode==221) note=45;
    if(keyCode==8) note=46;
    if(keyCode==220) note=47;
    if( note == -1 ) return -1;
    note += controls.octave*12;
    //console.log(intToLetterName(note));
    return note;
}
