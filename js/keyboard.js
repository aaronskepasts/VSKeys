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
const updateOctave = (ev) => {
    if (ev.key == 'CapsLock'){
        if (ev.type == 'keydown'){
            controls.octave=2;
        }else {
            controls.octave=1;
        }
        let trollers = controls.gui.__controllers;
        for (let c of trollers){
            if (c.property=='octave'){
                c.setValue(controls.octave);
            }
        }
        releaseKeys();
    }
    //console.log(controls.key_color_scheme);
}
const releaseKeys = () => {
    //console.log('release keys');
    //console.log(Parser.parseCommands());
    for (keyCode in keys_down){
        if (keys_down[keyCode]){
            var note = keyCode_to_note(keyCode);
            key_status(note, keyState.note_off);
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