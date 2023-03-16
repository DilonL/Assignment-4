/* Assignment 4: So You Think Ants Can Dance
 * CSCI 4611, Spring 2023, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 


import * as gfx from 'gophergfx'
import { Pose } from "./Pose";

export class Bone extends gfx.Transform3
{
    public name: string;
    public direction: gfx.Vector3;
    public length: number;
    public dofs: boolean[];

    public boneToRotationSpace: gfx.Quaternion;
    public rotationToBoneSpace: gfx.Quaternion;

    constructor()
    {
        super();

        this.name = '';
        this.direction = new gfx.Vector3();
        this.length = 0;
        this.dofs = [false, false, false];

        this.boneToRotationSpace = new gfx.Quaternion();
        this.rotationToBoneSpace = new gfx.Quaternion();
    }

    update(pose: Pose): void
    {
        this.resetTransform();

        /** TO DO (PART 2): You will first need to compute the transform.position in the correct 
         * coordinate space. Think of the vertices that make up the geometry of each bone as being 
         * defined in "bone space", where the joint that the bone rotates around is located at the 
         * origin, and the bone extends in the direction and length specified by the skeleton. 
         * 
         * The transform.position of each bone is determined by the direction and length defined
         * by the skeleton.  At the beginning of the update() loop, the transform.position is reset
         * to this location in bone space.  This means that the transform.position first needs to
         * be rotated to be in "rotation axis space" because the rotation axes are not guaranteed 
         * to line up perfectly with the bone's X,Y,Z axes. The bone's rotation axes are a property 
         * of the skeleton -- they are set for each skeleton and do not change for each pose. You 
         * can access the quaternionx that transform from "bone space" to "rotation axis space" as 
         * member variables.
         * 
         * Second, now that the transform.position is in the bone's "rotation axis space", the 
         * rotation from the character's current pose can be applied.  The current pose can be 
         * accessed using the pose.getJointRotation() method.
         * 
         * Third, after the transform.position has been transformed according to the appropriate 
         * rotation axes, it must now be rotated back into regular "bone space."  At this point, 
         * the position should be properly rotated based upon the current pose.
         * 
         * As a next step, you should call the update() method for each of the bone's children to
         * recursively propagate through the entire skeleton.  If you run the code and check the
         * box to show the coordinate axes, you should see some figures that appear to be dancing.
         * However, the rotation of the bones is still not correct!
         * 
         * To finish this method, you will need to also compute the bone's transform.rotation in
         * the correct coordinate space.  This is similar to the steps describe above for the 
         * position, except that you will need to compose all three quaternions together using the
         * premultiply() method.  Note that you could also use the quaternion's multiply() method,
         * but this is likely to compose the rotations in the wrong order, and quaternion
         * multiplication is not commutative! 
         * 
         * Finally, you will need to call the update() method for each of the bone's children to
         * recursively propagate through the entire skeleton.  Hint: you can iterate through the
         * array of children and check if each child object is a Bone using the instanceof keyword,
         * as shown in the AnimatedCharacter.createMeshes() method.
         * 
         * After all these steps are completed, the coordinate axes should appear to form
         * skeletons that are dancing the salsa!  If all the transformations are correct, then 
         * the axes that represent the hands of the two dancers should line up properly when
         * the couple is dancing together.
         */
  

        
    }

    resetTransform(): void
    {
        this.position.copy(this.direction);
        this.position.multiplyScalar(this.length);
        this.rotation.setIdentity();
    }
}