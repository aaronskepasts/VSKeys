function loadTour(){
  getGuiElements();
    const tour = new Shepherd.Tour({
          defaultStepOptions: {cancelIcon: {enabled: true},
          classes: 'shadow-md bg-purple-dark',
          scrollTo: { behavior: 'smooth', block: 'center' }
        }
      });
      
      tour.addStep({
        title: 'Welcome to VSKeys!',
        text: 'VSKeys allows you to use an interactive 3D piano keyboard to visualize harmony as interesting colors and geometry.\
        WARNING: When changing any settings, remember to remove keyboard focus from that setting by clicking elsewhere on the GUI.',
        attachTo: {element: 'body', on: 'top'},
        buttons: [{action() {return this.next();},text: 'Next'}],
        arrow: false,
      });
      tour.addStep({
        title: 'Toggle Controls',
        text: 'By default, the keys for each note are shown on the keyboard. Remember, you can use CapsLock to toggle between the two octaves',
        attachTo: { element: '#controls',on: 'left'},
        buttons: [{action() {return this.back();}, classes: 'shepherd-button-secondary',text: 'Back'},
          {action() { return this.next();}, text: 'Next'}],
      });
      tour.addStep({
        title: 'Set Custom Spirograph Sign',
        text: 'Input a string of (+) and (-) signs to set the direction of each arm in order of the spirograph.',
        attachTo: { element: '#custom_spiro_sign',on: 'left'},
        buttons: [{action() {return this.back();}, classes: 'shepherd-button-secondary',text: 'Back'},
          {action() { return this.next();}, text: 'Next'}],
      });
      tour.addStep({
        title: 'Control Playback',
        text: 'Start and stop midi playback',
        attachTo: { element: '#play',on: 'left'},
        buttons: [{action() {return this.back();}, classes: 'shepherd-button-secondary',text: 'Back'},
          {action() { return this.complete();}, text: 'Start Exploring!'}],
      });
      
    return tour;
}
function getGuiElements(){
  let gui = Array.from(document.getElementsByTagName('li'));
  //console.log(gui.length);
  gui = gui.filter((val)=>{
    //console.log(val.className, val.className!='folder', val.className!='title');
    return val.className!='folder';
  });
  //console.log(gui.length);
  let idList = ['instrument','orbit','controls','octave','vis_type',
    'key_color','monochrome','color_scheme','spiro_settings',//'spiro_type',
    'spiro_sign','custom_spiro_sign','midi','play']
  for (let i = 0; i< gui.length; i++){
    gui[i].id = idList[i];
  }
}