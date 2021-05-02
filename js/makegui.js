const makeGUI = ()=>{
    var gui = new dat.GUI({ width:250,hideable: false});
    controls.gui = gui;
    //gui.add(controls, 'key_attack_time', 2.0 , 40.0);
    //gui.add(controls, 'key_max_rotation',0.2 , 1.0);

    // make sure to remove any key pressed when changing the octave
    gui.add(controls, 'instrument',{"Piano":'piano','AMSynth':'AMSynth'}).name('Instrument');
    gui.add(controls, 'orbit').onChange((val)=>{cameraControls.autoRotate = val});
    //gui.add(controls, 'key_attack_time',1, 10).step(1);
    var octave = gui.add(controls, 'octave',0 , 3).step(1);
    octave.onChange(releaseKeys());
    var keyColors = gui.addFolder('Key Colors');
    var noteOnColorControl = keyColors.addColor(controls, 'monochrome');
    noteOnColorControl.onChange(function(value)
                    {
                        noteOnColor.color = new THREE.Color().setRGB(controls.monochrome[0]/256.0, controls.monochrome[1]/256.0, controls.monochrome[2]/256.0);
                        //console.log(noteOnColor);
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
    var midiFolder = gui.addFolder('Player Piano');
    var song = midiFolder.add(controls, 'song', songsToFiles);
    song.onChange(function(value)
                    {
                        MIDI.Player.stop();
                        MIDI.Player.loadFile("midi/" + value, MIDI.Player.start);
                    });
    midiFolder.add(controls, 'play');
    midiFolder.add(controls, 'stop');
    //midiFolder.add(controls, 'playback_speed',0.25,2);
    // Visualizations
    var visualizations = gui.addFolder('Visualizations');
    var tonnetz = visualizations.add(controls, 'tonnetz').name('Tonnetz Grid');
    tonnetz.onChange(function(val)
                        {
                            for (let s of scene.sphereList){
                                s.visible = controls.tonnetz;
                            }
                            for (let l of scene.lineList){
                                l.visible = false;
                            }
                        });
}