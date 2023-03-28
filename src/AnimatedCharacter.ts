/* Assignment 4: So You Think Ants Can Dance
 * CSCI 4611, Spring 2023, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { Skeleton } from './Skeleton'
import { MotionClip } from './MotionClip'
import { Pose } from './Pose';
import { Bone } from './Bone';
import { Camera, Mesh, Transform3 } from 'gophergfx';

export class AnimatedCharacter extends gfx.Transform3
{
    public skeleton: Skeleton;
    public fps: number;
    public useAbsolutePosition: boolean;
    
    private clip: MotionClip | null;
    
    private currentTime: number;
    private currentPose: Pose;
    
    private overlayQueue: MotionClip[];
    private overlayTransitionFrames: number[];
    private overlayTime: number;
    private overlayPose: Pose;

    private parts: gfx.Mesh;

    constructor(fps = 60, useAbsolutePosition = true)
    {
        super();
        
        // Create skeleton and add it as a child
        this.skeleton = new Skeleton();
        this.add(this.skeleton);

        this.fps = fps;
        this.useAbsolutePosition = useAbsolutePosition;

        this.clip = null;

        this.currentTime = 0;
        this.currentPose = new Pose();
        
        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;  
        this.overlayPose = new Pose();
        this.parts = new gfx.Mesh;
    }

    // Entry function for the recursive call
    createMeshes(): void
    {
        // Drawing the coordinate axes is a good way to check your work.
        // To start, this will just create the axes for the root node of the
        // character, but once you add this to createMeshesRecursive, you 
        // can draw the axes for each bone.  The visibility of the axes
        // is toggled using a checkbox.

        const axes = new gfx.Axes3(0.15);
        this.skeleton.add(axes);

        // Call the recursive method for each root bone
        this.skeleton.children.forEach((child: gfx.Transform3) => {
            if(child instanceof Bone)
                this.createMeshesRecursive(child);
        });
    }


    private createMeshesRecursive(bone: Bone): void
    {
        // TO DO (PART 1): Draw the coordinate axes for the bone
        const axes = new gfx.Axes3(0.15);
        this.translateY(.005)
        axes.lookAt(bone.direction);
        bone.add(axes);
        

         // TO DO (PART 3): You will want to draw something different for each
        // part of the body. An if statement like this is an easy way
        // to do that.  You can find the names of additional bones in 
        // the .asf files.  Anything that you create will be automatically
        // be made invisible when the coordinate axes are visibile.
        // if(bone.name == 'head')
        // {
        // }
        // else if(bone.name == 'upperback')
        // {
        // }

         if(bone.name == 'root')
         {
            const part = gfx.MeshFactory.createBox(0.05, 0.05, bone.length);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            bone.add(part); 
         }
        
         else if (bone.name == 'lhipjoint')
         {
            const part = gfx.MeshFactory.createSphere(0.1, 0.05);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            bone.add(part); 
         }
         else if (bone.name == 'lfemur')
         {
            const part = gfx.MeshFactory.createCylinder(10, .1, .3);
            part.lookAt(bone.direction);
            part.translateZ(.06);
            part.translateY(.1);
            part.rotateX(gfx.MathUtils.degreesToRadians(-90));
            this.parts.add(part)

            bone.add(part); 
         }
         else if (bone.name == 'ltibia')
         {
            const parts = new gfx.Mesh
            const part = gfx.MeshFactory.createCone(.15, .1, 10);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateX(.01);
            part.translateZ(.25);
            part.translateY(.12);
            part.rotateX(gfx.MathUtils.degreesToRadians(90));
            parts.add(part)

            const part2 = gfx.MeshFactory.createCone(.1, .4, 10);
            part2.lookAt(bone.direction);
            part2.translateZ(.1);
            part2.translateY(.11);
            part2.rotateX(gfx.MathUtils.degreesToRadians(-90));
            parts.add(part2)

            bone.add(parts);
         }
         
         else if (bone.name == 'lfoot')
         {
            const part = gfx.MeshFactory.createBox(.1, .25, .1);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length);
            part.translateY(-.05);
            part.translateX(-.15);
            part.translateZ(.1);
            part.rotateX(gfx.MathUtils.degreesToRadians(90));
            bone.add(part); 
         }
         
         else if (bone.name == 'ltoes')
         {
            const part = gfx.MeshFactory.createCone(0.05, 0.1, 10);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateY(-.4);
            part.translateX(-.2);
            part.rotateX(gfx.MathUtils.degreesToRadians(-90));
           // bone.add(part); 
         }
         else if (bone.name == 'rhipjoint')
         {
            const part = gfx.MeshFactory.createSphere(0.1, 0.05);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            bone.add(part); 
         }
         else if (bone.name == 'rfemur')
         {
            const part = gfx.MeshFactory.createCylinder(10, .1, .3);
            part.lookAt(bone.direction);
            part.translateZ(.06);
            part.translateY(.1);
            part.rotateX(gfx.MathUtils.degreesToRadians(-90));
            this.parts.add(part)

            bone.add(part); 
         }
         else if (bone.name == 'rtibia')
         {
            const parts = new gfx.Mesh
            const part = gfx.MeshFactory.createCone(.15, .1, 10);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateX(.01);
            part.translateZ(.25);
            part.translateY(.12);
            part.rotateX(gfx.MathUtils.degreesToRadians(90));
            parts.add(part)

            const part2 = gfx.MeshFactory.createCone(.1, .4, 10);
            part2.lookAt(bone.direction);
            part2.translateZ(.1);
            part2.translateY(.11);
            part2.rotateX(gfx.MathUtils.degreesToRadians(-90));
            parts.add(part2)

            bone.add(parts);
         }
         
         else if (bone.name == 'rfoot')
         {
            const part = gfx.MeshFactory.createBox(.1, .25, .1);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length);
            part.translateY(-.05);
            part.translateX(.15);
            part.translateZ(.1);
            part.rotateX(gfx.MathUtils.degreesToRadians(90));
            bone.add(part); 
         }
         
         else if (bone.name == 'rtoes')
         {
            const part = gfx.MeshFactory.createCone(0.05, 0.1, 10);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateY(-.4);
            part.translateX(-.2);
            part.rotateX(gfx.MathUtils.degreesToRadians(-90));
           // bone.add(part); 
         }
         else if (bone.name == 'lowerback')
         {
            const part = gfx.MeshFactory.createBox(0.05, 0.05, .7);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            bone.add(part); 
         }
         else if (bone.name == 'upperback')
         {
            const part = gfx.MeshFactory.createBox(0.25, 0.25, .3);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            bone.add(part); 
         }
         else if (bone.name == 'thorax')
         {
            const part = gfx.MeshFactory.createSphere(.22, 0.1);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            bone.add(part); 
         }
         else if (bone.name == 'lowerneck')
         {
            const part = gfx.MeshFactory.createCone(.2, .2,20);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.rotateX(gfx.MathUtils.degreesToRadians(-90));
            bone.add(part); 
         }
         else if (bone.name == 'upperneck')
         {
            const part = gfx.MeshFactory.createCone(.2, .2,20);
            part.lookAt(bone.direction);
            part.translateZ(bone.length/2);
            part.rotateX(gfx.MathUtils.degreesToRadians(90));
            bone.add(part); 
         }
         else if (bone.name == 'head')
         {
            const part = gfx.MeshFactory.createSphere(0.05, 0.05);

           // const part = gfx.MeshFactory.createBox(0.05, 0.05, bone.length);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            bone.add(part); 
         }
         else if (bone.name == 'lclavicle')
         {
            const part = gfx.MeshFactory.createSphere(0.15, .15);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateY(.1);
            part.translateX(.01);
            bone.add(part); 
         }
         else if (bone.name == 'lhumerus')
         {
            const parts = new gfx.Mesh
            const part = gfx.MeshFactory.createCone(.12, .3,10);
            part.lookAt(bone.direction);
            part.translateZ(.13);
            part.translateY(.10);
            part.translateX(-.05);
            part.rotateX(gfx.MathUtils.degreesToRadians(-90));
            parts.add(part)

            const part2 = gfx.MeshFactory.createCone(.1, .25,10);
            part2.lookAt(bone.direction);
            part2.translateZ(.20);
            part2.translateY(.10);
            part2.translateX(-.05);
            part2.rotateX(gfx.MathUtils.degreesToRadians(90));
            parts.add(part2)
            bone.add(parts); 
         }
         else if (bone.name == 'lradius')
         {
            const part = gfx.MeshFactory.createBox(0.15, 0.15, .2);

            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateX(-.01);
            part.translateY(.01);
            part.translateZ(.12);
            bone.add(part); 
         }
         else if (bone.name == 'lwrist')
         {
            const part = gfx.MeshFactory.createCone(0.13, .1, 10);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateX(-.01);
            part.translateY(0);
            part.translateZ(.1);
            part.rotateX(gfx.MathUtils.degreesToRadians(90));
            bone.add(part); 
         }
         else if (bone.name == 'lhand')
         {
            const part = gfx.MeshFactory.createSphere(0.12, 0.12);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateX(0);
            part.translateY(0);
            part.translateZ(0);
            bone.add(part); 
         }
         else if (bone.name == 'lthumb')
         {
            const part = gfx.MeshFactory.createSphere(0.1, 0.01);
            part.lookAt(bone.direction);
            part.translateZ(bone.length/2);
            part.translateY(0);
            bone.add(part); 
         }
         else if (bone.name == 'lfingers')
         {
            const part = gfx.MeshFactory.createSphere(0.1, 0.1,);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            bone.add(part); 
         }
         else if (bone.name == 'rclavicle')
         {
            const part = gfx.MeshFactory.createSphere(0.15, .15);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateY(.1);
            part.translateX(.01);
            bone.add(part); 
         }
         else if (bone.name == 'rhumerus')
         {
            const parts = new gfx.Mesh
            const part = gfx.MeshFactory.createCone(.12, .3,10);
            part.lookAt(bone.direction);
            part.translateZ(.13);
            part.translateY(.10);
            part.translateX(-.05);
            part.rotateX(gfx.MathUtils.degreesToRadians(-90));
            parts.add(part)

            const part2 = gfx.MeshFactory.createCone(.1, .25,10);
            part2.lookAt(bone.direction);
            part2.translateZ(.20);
            part2.translateY(.10);
            part2.translateX(-.05);
            part2.rotateX(gfx.MathUtils.degreesToRadians(90));
            parts.add(part2)
            bone.add(parts); 
         }
         else if (bone.name == 'rradius')
         {
            const part = gfx.MeshFactory.createBox(0.15, 0.15, .2);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateX(-.01);
            part.translateY(.01);
            part.translateZ(.12);
            bone.add(part); 
         }
         else if (bone.name == 'rwrist')
         {
            const part = gfx.MeshFactory.createCone(0.13, .1, 10);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateX(-.01);
            part.translateY(0);
            part.translateZ(.1);
            part.rotateX(gfx.MathUtils.degreesToRadians(90));
            bone.add(part); 
         }
         else if (bone.name == 'rhand')
         {
            const part = gfx.MeshFactory.createSphere(0.12, 0.12);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            part.translateX(0);
            part.translateY(0);
            part.translateZ(0);
            bone.add(part); 
         }
         else if (bone.name == 'rthumb')
         {
            const part = gfx.MeshFactory.createSphere(0.1, 0.01);
            part.lookAt(bone.direction);
            part.translateZ(bone.length/2);
            part.translateY(0);
            bone.add(part); 
         }
         else if (bone.name == 'rfingers')
         {
            const part = gfx.MeshFactory.createSphere(0.1, 0.1,);
            part.lookAt(bone.direction);
            part.translateZ(-bone.length/2);
            bone.add(part); 
         }

        // TO DO (PART 1): Recursively call this function for each of the bone's children
      
        bone.children.forEach((child: gfx.Transform3) => {
            if(child instanceof Bone)
                this.createMeshesRecursive(child);

        });
        
    }

    


    // You do not need to modify any code below this comment to complete the base assignment.

    loadSkeleton(filename: string): void
    {
        this.skeleton.loadFromASF(filename);
    }

    loadMotionClip(filename: string): MotionClip
    {
        const clip = new MotionClip();
        clip.loadFromAMC(filename, this.skeleton);
        return clip;
    }

    play(clip: MotionClip): void
    {
        this.stop();
        this.clip = clip;
        this.currentPose = this.clip.frames[0];
    }

    stop(): void
    {
        this.clip = null;
        this.currentTime = 0;

        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;
    }

    overlay(clip: MotionClip, transitionFrames: number): void
    {
        this.overlayQueue.push(clip);
        this.overlayTransitionFrames.push(transitionFrames);
    }

    update(deltaTime: number): void
    {
        // If the motion queue is empty, then do nothing
        if(!this.clip)
            return;

        // Advance the time
        this.currentTime += deltaTime;

        // Set the next frame number
        let currentFrame = Math.floor(this.currentTime * this.fps);

        if(currentFrame >= this.clip.frames.length)
        {
            currentFrame = 0;
            this.currentTime = 0;   
            this.currentPose = this.clip.frames[0];
        }

        let overlayFrame = 0;

        // Advance the overlay clip if there is one
        if(this.overlayQueue.length > 0)
        {
            this.overlayTime += deltaTime;

            overlayFrame = Math.floor(this.overlayTime * this.fps);

            if(overlayFrame >= this.overlayQueue[0].frames.length)
            {
                this.overlayQueue.shift();
                this.overlayTransitionFrames.shift();
                this.overlayTime = 0;
                overlayFrame = 0;
            }
        }

        const pose = this.computePose(currentFrame, overlayFrame);
        this.skeleton.update(pose, this.useAbsolutePosition);
    }

    public getQueueCount(): number
    {
        return this.overlayQueue.length;
    }

    private computePose(currentFrame: number, overlayFrame: number): Pose
    {
        // If there is an active overlay track
        if(this.overlayQueue.length > 0)
        {
            // Start out with the unmodified overlay pose
            const overlayPose = this.overlayQueue[0].frames[overlayFrame].clone();

            let alpha = 0;

            // Fade in the overlay
            if(overlayFrame < this.overlayTransitionFrames[0])
            {
                alpha = 1 - overlayFrame / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }
            // Fade out the overlay
            else if (overlayFrame > this.overlayQueue[0].frames.length - this.overlayTransitionFrames[0])
            {
                alpha = 1 - (this.overlayQueue[0].frames.length - overlayFrame) / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }

            if(!this.useAbsolutePosition)
            {
                const relativeOverlayPosition = gfx.Vector3.copy(this.overlayQueue[0].frames[overlayFrame].rootPosition);
                relativeOverlayPosition.subtract(this.overlayPose.rootPosition);

                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);

                relativeOverlayPosition.lerp(relativeOverlayPosition, relativePosition, alpha);
                this.position.add(relativeOverlayPosition);

                this.overlayPose = this.overlayQueue[0].frames[overlayFrame];
                this.currentPose = this.clip!.frames[currentFrame];
            }
            
            return overlayPose;
        }
        // Motion is entirely from the base track
        else
        {
            if(!this.useAbsolutePosition)
            {
                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);
                this.position.add(relativePosition);
                this.currentPose = this.clip!.frames[currentFrame];
            }

            return this.clip!.frames[currentFrame];
        }
    }

    // Entry function for the recursive call
    toggleAxes(showAxes: boolean): void
    {
        this.toggleAxesRecursive(this.skeleton, showAxes);
    }

    private toggleAxesRecursive(object: gfx.Transform3, showAxes: boolean): void
    {
        // Set the visibility of the coordinate axes
        if(object instanceof gfx.Axes3)
        {
            object.visible = showAxes;
        }
        // Set the visibility of all objects that are not coordinate axes
        else if(object instanceof gfx.Mesh || object instanceof gfx.MeshInstance || object instanceof gfx.Line3)
        {
            object.visible = !showAxes;
        }

        // Call the function recursively for each child node
        object.children.forEach((child: gfx.Transform3) => {
            this.toggleAxesRecursive(child, showAxes);
        });
    }
}
