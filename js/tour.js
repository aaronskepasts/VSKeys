function loadTour(){
  labelGuiElements();
    const tour = new Shepherd.Tour({
          defaultStepOptions: {cancelIcon: {enabled: true},
          classes: 'shadow-md bg-purple-dark',
          scrollTo: { behavior: 'smooth', block: 'center' }
        }
      });
      let buttons = [{action() {return tour.back();}, classes: 'shepherd-button-secondary',text: 'Back'},
      {action() { return tour.next();}, text: 'Next'}];

      tour.addStep({
        title: 'Welcome to VSKeys!',
        text: 'VSKeys is an interactive 3D piano keyboard for visualizing harmony with interesting colors and geometry.<br>\
        <strong style="text-decoration:underline">WARNING</strong>: After changing any settings in the GUI, remember to remove keyboard focus from that setting by clicking elsewhere on the GUI.\
        Forgetting this step can lead to settings changing while you play.',
        attachTo: {element: 'body', on: 'top'},
        buttons: [{action() {return this.next();},text: 'Next'}],
        arrow: false,
      });
      tour.addStep({
        title: 'Instrument',
        text: 'Choose the instrument you want to play.',
        attachTo: { element: '#instrument',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Orbit',
        text: 'Slowly spin the camera around the scene.',
        attachTo: { element: '#orbit',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Show Keyboard',
        text: 'Hide the keyboard for a fully immersive experience.',
        attachTo: { element: '#keyboard',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Show Key Layout',
        text: 'The key layout is shown on the piano by default. \
        Use the <strong>CapsLock</strong> hotkey to quickly toggle between the two middle octaves.\
        Turn this setting off once you\'ve mastered the layout.',
        attachTo: { element: '#controls',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Octave',
        text: 'Manually set the octave you want to play. Use the additional range to play extra high and low notes.',
        attachTo: { element: '#octave',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Visualization',
        text: 'We offer two main types of visualization. \
        The default is the <a href="https://en.wikipedia.org/wiki/Tonnetz">Tonnetz</a>, which tesselates an isometric grid with the 12 tones of the Western music scale.\
        Check out the shapes of different kinds of chords. (Major/Minor, Diminished/Augmented, etc.) <br> \
        The second is our own invention based on the spirographic idea of tracing a point on a circle. \
        Our spirograph illustrates frequency relationships using concatenated rotating vectors. Try it out!',
        attachTo: { element: '#vis_type',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Monochrome Key Color',
        text: 'Pick a color you like for pressed keys.',
        attachTo: { element: '#monochrome',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Color Scheme',
        text: 'Choose a more interesting color scheme.<br>Chromatic goes around the color wheel by semitones.\
        <br>Circle of Fifths goes around the color wheel by perfect fifths.',
        attachTo: { element: '#color_scheme',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Spirograph Type',
        text: 'We offer 3 visualizations based on the spirograph. The one you\'ve seen thus far plots instantly in 2D.\
        Try the Animated option to see behind the scenes of the drawing. For each note in the chord, we create a spinning vector.\
        The length and rotation speed of the vector is proportional to the frequency of the note. \
        The 3D plot shows the same graph extended by a small amount in the third dimension at each timestep.',
        attachTo: { element: '#spiro_type',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Rotation Direction',
        text: 'Note that in the Animated spirograph, the vectors are spinning in alternating directions.\
        Positive makes all of the vectors spin counterclockwise. Custom allows you to set the rotation directions yourself.',
        attachTo: { element: '#spiro_sign',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Custom Spirograph Sign',
        text: 'Input a string of (+) and (-) signs to set the direction of each arm in ascending order of frequency for the spirograph.',
        attachTo: { element: '#custom_spiro_sign',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: 'Drawing Speed',
        text: 'Speed up the drawing animation. Watch the vectors go wild!',
        attachTo: { element: '#draw_speed',on: 'left'},
        buttons: buttons,
      });
      
      tour.addStep({
        title: '3D Scale',
        text: 'Set the scale to max to be immersed in a cloud of particles.',
        attachTo: { element: '#Td_scale',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: '3D Animated Scale',
        text: 'Make chords swell to their full scale.',
        attachTo: { element: '#Td_animate_scale',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: '3D Animated Particles',
        text: 'Make the particles swirl within the graph.',
        attachTo: { element: '#Td_animate_particles',on: 'left'},
        buttons: buttons,
      });
      tour.addStep({
        title: '3D Animated Scan',
        text: 'Scan through the graph back and forth to see cross sections.',
        attachTo: { element: '#Td_animate_scan',on: 'left'},
        buttons: buttons,
      });
      
      tour.addStep({
        title: 'MIDI Playback',
        text: 'Choose a song and play it with any of the above visualizations to see some pretty shapes and colors.\
        (Animated 2D doesn\'t look very good unless the music is extremely slow since it draws so slowly.)',
        attachTo: { element: '#play',on: 'left'},
        buttons: [{action() {return this.back();}, classes: 'shepherd-button-secondary',text: 'Back'},
          {action() { return this.complete();}, text: 'Start Exploring!'}],
      });
      
    return tour;
}
function labelGuiElements(){
  let gui = Array.from(document.getElementsByTagName('li'));
  //console.log(gui.length);
  gui = gui.filter((val)=>{return val.className!='folder';});
  //console.log(gui.length);
  let idList = ['instrument','orbit','keyboard','controls','octave','vis_type', 'key_color','monochrome','color_scheme','spiro_settings','spiro_type',
    'spiro_sign','custom_spiro_sign','draw_speed','3d_settings','Td_scale','Td_animate_scale','Td_animate_particles','Td_animate_scan','midi','play']
  for (let i = 0; i< gui.length; i++){
    gui[i].id = idList[i];
  }
}