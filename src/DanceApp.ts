/* Assignment 4: So You Think Ants Can Dance
 * CSCI 4611, Spring 2023, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 


import * as gfx from 'gophergfx'
import { GUI } from 'dat.gui'
import { AnimatedCharacter } from './AnimatedCharacter'
import { MotionClip } from './MotionClip';
import { Skeleton } from './Skeleton'

enum AppState
{
    STOPPED,
    LOADING_SKELETONS,
    LOADING_ANIMATIONS,
    STARTED
}

export class DanceApp extends gfx.GfxApp
{
    // Animated characters
    private salsaAntLead: AnimatedCharacter;
    private salsaAntFollow: AnimatedCharacter;
    private balletAnt: AnimatedCharacter;
    
    // Motion clips
    private salsaMotionLead: MotionClip;
    private salsaMotionFollow: MotionClip;
    private balletBaseLoop: MotionClip;
    private balletDanceMotions: MotionClip[];

    // State variables
    private state: AppState;
    private showAxes : boolean;

    constructor()
    {
        super();

        this.salsaAntLead = new AnimatedCharacter(60, true);
        this.salsaAntFollow = new AnimatedCharacter(60, true);
        this.balletAnt = new AnimatedCharacter(120, false);

        this.salsaMotionLead = new MotionClip();
        this.salsaMotionFollow = new MotionClip();
        this.balletBaseLoop = new MotionClip();
        this.balletDanceMotions = [];

        this.state = AppState.STOPPED;
        this.showAxes = false;
    }

    createScene(): void 
    {
        // Setup camera
        this.camera.setPerspectiveCamera(60, 1920/1080, 0.1, 50)
        this.camera.position.set(0, 1.5, 3.5);
        this.camera.lookAt(new gfx.Vector3(0, 1, 0));

        // Create an ambient light
        const ambientLight = new gfx.AmbientLight(new gfx.Vector3(0.3, 0.3, 0.3));
        this.scene.add(ambientLight);

        // Create a directional light
        const directionalLight = new gfx.DirectionalLight(new gfx.Vector3(0.6, 0.6, 0.6));
        directionalLight.position.set(0, 2, 1);
        this.scene.add(directionalLight);

        // Set the background image
        const background = new gfx.Rectangle(2, 2);
        background.material.texture = new gfx.Texture('./assets/images/ants-dance.jpg');
        background.material.texture.setMinFilter(true, false);
        background.layer = 1;
        this.scene.add(background);
        
        // Create the wood floor material
        const floorMaterial = new gfx.GouraudMaterial();
        floorMaterial.texture = new gfx.Texture('assets/images/woodfloor.jpg');
        
        // Create the floor mesh
        const floorMesh = gfx.MeshFactory.createPlane(14, 6);
        floorMesh.material = floorMaterial;
        floorMesh.rotateX(Math.PI / 2);
        this.scene.add(floorMesh);

        // Create the GUI
        const gui = new GUI();
        gui.width = 100;

        const controls = gui.addFolder('Ballet Controls');
        controls.open();

        // Add buttons for controlling the motion playback
        controls.add(this, 'playBalletMotion1').name('Motion 1');
        controls.add(this, 'playBalletMotion2').name('Motion 2');
        controls.add(this, 'playBalletMotion3').name('Motion 3');
        controls.add(this, 'playBalletMotion4').name('Motion 4');
        controls.add(this, 'playBalletMotion5').name('Motion 5');

        // Create a GUI control for the debug mode and add a change event handler
        const axesController = controls.add(this, 'showAxes');
        axesController.name('Axes');
        axesController.onChange(() => { 
            this.salsaAntLead.toggleAxes(this.showAxes);
            this.salsaAntFollow.toggleAxes(this.showAxes); 
            this.balletAnt.toggleAxes(this.showAxes);
         });

        // Set the initial positions of the characters
        this.salsaAntLead.position.set(1, 0, 0.5);
        this.salsaAntFollow.position.set(1, 0, 0.5);
        this.balletAnt.position.set(-2, .95, 0);

        // Load the skeleton data
        // Note that this is asynchronous!
        this.loadSkeletons();
    }

    loadSkeletons(): void
    {
        this.state = AppState.LOADING_SKELETONS;
        this.salsaAntLead.loadSkeleton('./assets/data/60.asf');
        this.salsaAntFollow.loadSkeleton('./assets/data/61.asf'); 
        this.balletAnt.loadSkeleton('./assets/data/61.asf');
    }

    loadAnimations(): void
    {
        this.state = AppState.LOADING_ANIMATIONS;

        // Add the salsa dance motions
        this.salsaMotionLead = this.salsaAntLead.loadMotionClip('./assets/data/60_12.amc');
        this.salsaMotionFollow = this.salsaAntLead.loadMotionClip('./assets/data/61_12.amc');

        // Add the ballet idle motion
        this.balletBaseLoop = this.balletAnt.loadMotionClip('./assets/data/05_20.amc');

        // Add the first ballet dance motion
        this.balletDanceMotions.push(this.balletAnt.loadMotionClip('./assets/data/05_02.amc'));



        // TO DO (PART 4): Add special motions 2-5 on your own.
        // You can pick your own motions from the CMU mocap database or you can use the same
        // dance moves that we did. These files are located in the public/assets/data folder.
        // We used 05_10.amc, 05_09.amc, 05_20.amc, and 05_06.amc.  However, note that there
        // are many other motions for this dancer in the CMU mocap database!  To download
        // other .amc files, go to http://mocap.cs.cmu.edu, enter the subject number, and
        // then click the search button.  For example, if you search for subject 05, you
        // will find that there are a total of 20 difference motion clips to choose from.


    }

    startAnimations(): void
    {
        // This code trims the excess data from the from the beginning and end of each clip.
        // The salsa and ballet idle animations also need to be interpolated to create a loop.
        this.salsaMotionLead.trimFront(100);
        this.salsaMotionLead.trimBack(150);
        this.salsaMotionLead.makeLoop(100);
        
        this.salsaMotionFollow.trimFront(100);
        this.salsaMotionFollow.trimBack(150);
        this.salsaMotionFollow.makeLoop(100);
        
        // The ballet idle motion needs to be looped
        this.balletBaseLoop.trimBack(600);
        this.balletBaseLoop.makeLoop(50);

        // The ballet dance motion does not need to be looped
        this.balletDanceMotions[0].trimFront(280);
        this.balletDanceMotions[0].trimBack(200);



        // TO DO (PART 4): You will need to trim the new animations you have
        // added to isolate the interesting portions of the motion.  You can
        // then add them similarly to the first ballet dance motion.
        


        // Create the meshes for the animated characters
        this.salsaAntLead.createMeshes();
        this.salsaAntFollow.createMeshes();
        this.balletAnt.createMeshes();

        // Set the visibility of the axes helpers
        this.salsaAntLead.toggleAxes(this.showAxes);
        this.salsaAntFollow.toggleAxes(this.showAxes); 
        this.balletAnt.toggleAxes(this.showAxes);

        // Start the looping salsa dance animations
        this.salsaAntLead.play(this.salsaMotionLead);
        this.salsaAntFollow.play(this.salsaMotionFollow);

        // Start the looping ballet idle animation
        this.balletAnt.play(this.balletBaseLoop);

        // Add the animated characters to the scene
        this.scene.add(this.salsaAntLead);
        this.scene.add(this.salsaAntFollow);
        this.scene.add(this.balletAnt);
    }

    update(deltaTime: number) : void
    {
        if(this.state == AppState.STOPPED)
        {
            return;
        }

        // We need the skeleton data to correctly load the animations. So, we wait until 
        // the skeleton data is finished loading and then we start loading the animations.
        if(this.state == AppState.LOADING_SKELETONS)
        {
            if(Skeleton.finishedLoading())
            {
                this.loadAnimations();
            }
            else
            {
                return;
            }
        }

        // This code exits the update loop if the animations are not finished loading yet.
        if(this.state == AppState.LOADING_ANIMATIONS)
        {
            if(MotionClip.finishedLoading())
            {
                this.state = AppState.STARTED;
                this.startAnimations();
            }
            else
            {
                return;
            }
        }

        // If everything is finished loading, then go ahead and update the animated characters.
        this.salsaAntLead.update(deltaTime);
        this.salsaAntFollow.update(deltaTime);
        this.balletAnt.update(deltaTime);
    }

    playBalletMotion1(): void
    {
        this.balletAnt.overlay(this.balletDanceMotions[0], 100);
        console.log('Queueing ballet motion 1. Queue size is ' + this.balletAnt.getQueueCount() + '.');
    }

    playBalletMotion2(): void
    {


        // TO DO (PART 4): Overlay the motion, similar to the call above


    }

    playBalletMotion3(): void
    {


        // TO DO (PART 4): Overlay the motion, similar to the call above
        

    }

    playBalletMotion4(): void
    {


        // TO DO (PART 4): Overlay the motion, similar to the call above
        

    }

    playBalletMotion5(): void
    {


        // TO DO (PART 4): Overlay the motion, similar to the call above
        

    }
}