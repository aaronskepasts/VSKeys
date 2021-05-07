const makeGUI = ()=>{
    var gui = new dat.GUI({ width:300,hideable: false});
    controls.gui = gui;
    //gui.add(controls, 'key_attack_time', 2.0 , 40.0);
    //gui.add(controls, 'key_max_rotation',0.2 , 1.0);

    // make sure to remove any key pressed when changing the octave
    gui.add(controls, 'instrument',{'Synth':'AMSynth',"Piano":'piano'}).name('Instrument');
    let orbit = gui.add(controls, 'orbit').name('Orbit');
    orbit.onChange((val)=>{cameraControls.autoRotate = val});
    //gui.add(controls, 'key_attack_time',1, 10).step(1);
    gui.add(controls, 'tutorial').name('Show Key Layout').onChange(moveKeyLabels);
    var octave = gui.add(controls, 'octave',0 , 3).step(1).name('Octave');
    octave.onChange((val)=>{
        updateOctave(val);
        moveKeyLabels();
    });
    gui.add(controls, 'visualize',{'Tonnetz':'tonnetz','Spirograph':'spiro'}).name('Visualization').onChange(updateVisType);
    var keyColors = gui.addFolder('Key Colors');
    keyColors.open();
    var noteOnColorControl = keyColors.addColor(controls, 'monochrome').name('Monochrome');
    noteOnColorControl.onChange(function(value)
                    {
                        //console.log(value);
                        if (value.length == 4){
                            noteOnColor.color.setRGB(value[0]/256.0, value[1]/256.0, value[2]/256.0);
                        } else{
                            noteOnColor.color.setHex(parseInt(value.substring(1),16));
                        }
                        for (let k of keys_obj[0].children){
                            //console.log(k);
                            if (k.name.charAt(0)=='_') k.material.note_on = noteToColor(parseInt(k.name.slice(1))).color;
                        }
                    });
    var keyColor = keyColors.add(controls,'key_color_scheme',{"Monochrome":'monochrome',"Chromatic":'chromatic',"Circle of Fifths":'fifths'}).name('Color Scheme');
    keyColor.onChange((val)=>{
        for (let s of scene.sphereList){
            s.onColor = noteToColor(s.note);
        }
        //console.log(keys_obj[0].children[0]);
        for (let k of keys_obj[0].children){
            //console.log(k);
            if (k.name.charAt(0)=='_') k.material.note_on = noteToColor(parseInt(k.name.slice(1))).color;
        }
        releaseKeys();
    })
    // Visualizations
    var visFolder = gui.addFolder('Spirograph Settings');
    visFolder.open();
    visFolder.add(controls,'spiroType',{'2D':'2D','Animated 2D':'animate','3D':'3D'}).name('Type').onChange(updateVisType);
    let spiroDir = visFolder.add(scene.spiro,'dir',{'Positive':'pos','Alternating':'alt','Custom':'custom'}).name('Rotation Sign');
    visFolder.add(scene.spiro,'customStr').name('Custom Rotation').onFinishChange((str)=>{
        let signArr = [];
        for (let i = 0; i<str.length; i++){
            let c = str.charAt(i);
            if (c != '+' && c != '-'){
                scene.spiro.customSign = [];
                spiroDir.setValue('pos');
                return;
            }
            if (c == '+') signArr.push(1);
            if (c == '-') signArr.push(-1);
        }{}
        scene.spiro.customSign = signArr;
    });

<<<<<<< Updated upstream
    visFolder.add(controls, 'spiroSpeed', 1, 5).step(0.1).name('Drawing Speed');
=======
    visFolder.add(controls, 'spiroSpeed', 1, 5).step(0.1).name('Animation Speed');

    var spiro3DFolder = gui.addFolder('3D Spirograph Settings');
    spiro3DFolder.open()
    var scale3D = spiro3DFolder.add(controls, 'scale3D', 0.1, 3).step(0.01).name('Scale');
    scale3D.onChange((val)=>{
        console.log(scale3D);
        scene.spiro3D.scale.fromArray([val, val, val]);
    });
    let animateS = spiro3DFolder.add(controls, 'animateS').name('Animate Scale');
    animateS.onChange((val)=>{
            if (!val){
              scene.spiro3D.scale.fromArray([1,1,1]);
            }
            scene.spiro3D.s = [0.3, 0.3, 0.3]
    });
    let animateP = spiro3DFolder.add(controls, 'animateP').name('Animate Particles');
    animateP.onChange((val)=>{
            if (scene.spiro3D.geometry.index != null){
              console.log("w");
              scene.spiro3D.geometry.dispose();
            }
    });
    /*
    var rotateX = visFolder.add(controls, 'rotateX', -Math.PI, Math.PI).step(0.1).name('Rotate X');
    rotateX.initialValue = 0;
    rotateX.onChange((val)=>{
        scene.spiro3D.rotation.fromArray([val, scene.spiro3D.rotation.y, scene.spiro3D.rotation.z]);
    });
    var rotateY = visFolder.add(controls, 'rotateY', -Math.PI, Math.PI).step(0.01).name('Rotate Y');
    rotateY.initialValue = 0;
    rotateY.onChange((val)=>{
        scene.spiro3D.rotation.fromArray([scene.spiro3D.rotation.x, val, scene.spiro3D.rotation.z]);
    });
    var rotateZ = visFolder.add(controls, 'rotateZ', -Math.PI, Math.PI).step(0.01).name('Rotate Z');
    rotateZ.initialValue = 0;
    rotateZ.onChange((val)=>{
        scene.spiro3D.rotation.fromArray([scene.spiro3D.rotation.x, scene.spiro3D.rotation.y, val]);
    });*/
>>>>>>> Stashed changes
    var midiFolder = gui.addFolder('Player Piano');
    midiFolder.open()
    var song = midiFolder.add(controls, 'song', songsToFiles).name('Song');
    song.onChange(function(value)
                    {
                        MIDI.Player.stop();
                        MIDI.Player.loadFile("midi/" + value, MIDI.Player.start);
                    });
    midiFolder.add(controls, 'play').name('Play');
    midiFolder.add(controls, 'stop').name('Stop');
    //midiFolder.add(controls, 'playback_speed',0.25,2);
}
function updateVisType(){
    for (let l of scene.lineList){
        l.visible = false;
    }
    for (let s of scene.sphereList){
        s.visible = false;
    }
    scene.spiro.visible = false;
    scene.remove(scene.spiro.arrows);
    scene.spiro3D.visible = false;
    scene.floor.visible = true;
    scene.spiro.ctx.fillRect(0, 0, scene.spiro.ctx.canvas.width, scene.spiro.ctx.canvas.height);
    switch (controls.visualize){
        case 'tonnetz':
            for (let s of scene.sphereList){
                s.visible = true;
            }
            break;
        case 'spiro':
            switch (controls.spiroType){
                case '2D':
                    console.log('spiro2D');
                    scene.spiro.visible = true;
                    //scene.spiro.ctx.fillStyle = '#000000';
                    break;
                case 'animate':
                    console.log('spiroAnimate');
                    scene.spiro.visible = true;
                    //scene.spiro.ctx.fillStyle = '#'+scene.floor.material.color.getHexString();
                    //scene.spiro.ctx.fillRect(0, 0, scene.spiro.ctx.canvas.width, scene.spiro.ctx.canvas.height);
                    break;
                case '3D':
                    console.log("spiro3D");
                    scene.spiro3D.visible = true;
                    scene.floor.visible = false;
        }
    }
    moveKeyLabels();
}