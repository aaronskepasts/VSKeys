const newAMSynth = ()=>{
    //create a synth and connect it to the main output (your speakers)
    return new Tone.PolySynth(Tone.AMSynth).toDestination();
}
const newPiano = () => {

}