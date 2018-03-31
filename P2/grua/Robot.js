
/// The Robot class
/**
 * @author FVelasco
 * 
 * @param parameters = {
 *      robotHeight: <float>,
 *      robotWidth : <float>,
 *      material: <Material>
 * }
 */



class Robot extends THREE.Object3D {
  
  //-----------------
  //Texture
  //-----------------
  constructor (/*parameters*/aMaterial) {
    super();
    

    //-----------------
    //Color Robot
    //-----------------
    //-----------------
    //Texture
    //-----------------
    this.material    = aMaterial/*(parameters.material === undefined ? new THREE.MeshPhongMaterial ({color: 0xd4af37, specular: 0xfbf804, shininess: 70}) : parameters.material)*/;
          


    
    // Objects for operating with the robot
    this.leg        = null;
    this.footL         = null;
    this.footR         = null;
    this.extension    = null;

    //Provisional
    this.footHeight = 2;
    this.footWidth = 2;

    this.legWidth = 2;
    this.legHeight = 10;

    this.shoulderHeight = 3;
    this.shoulderWidth = 3;

    this.bodyHeight = 16;
    this.bodyWidth = 8;

    //Animation robot
    this.bodyRotation = 0;
    this.headRotation = 0;
    this.robotExtension = 0;
    
    this.footL = this.createFoot("L");
    this.footR = this.createFoot("R");
    this.extension = this.createExtension();
    // A way of feedback, a red jail will be visible around the robot when a box is taken by it
    this.feedBack = new THREE.BoxHelper (this.legL, 0xFF0000);
    this.feedBack.visible = false;
    this.add (this.footL);
    this.add (this.footR);
    this.add (this.extension);
    this.add (this.feedBack);
  }
  



  /// It creates the leg and the foot
  createFoot (tipo) {
    //Foot
    var foot = new THREE.Mesh (
      new THREE.ConeGeometry (this.footWidth, this.footHeight*2, 30, 16, 1), this.material);

    foot.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.footHeight, 0));
    foot.castShadow = true;
    foot.autoUpdateMatrix = false;
    foot.position.y = -(this.footHeight + this.legHeight + this.shoulderHeight/2);
    if(tipo == "R")
      foot.position.x = this.bodyWidth/2 + this.shoulderWidth/2;
    else
      foot.position.x = -(this.bodyWidth/2 + this.shoulderWidth/2);
    foot.updateMatrix();

    //Leg
    var leg = new THREE.Mesh (
      new THREE.CylinderGeometry (this.legWidth/2,this.legWidth/2, this.legHeight, 16, 8), this.material);

    leg.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.legHeight/2, 0));
    leg.castShadow = true;
    leg.autoUpdateMatrix = false;
    leg.position.y = this.footHeight;
    leg.updateMatrix();

    foot.add(leg);
    return foot;
  }

  //It creates de animation of extension
  createExtension(){
    var extension = new THREE.Object3D();
    extension.position.y = this.robotExtension;
    extension.add(this.createBody());
    extension.add(this.createShoulders("R"));
    extension.add(this.createShoulders("L"));
    return extension;
  }

  //It creates de body
  createBody(){
    var body = new THREE.Mesh (
      new THREE.CylinderGeometry (this.bodyWidth/2,this.bodyWidth/2, this.bodyHeight, 16, 8), this.material); 
    
    body.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, -this.bodyHeight/4, 0));
    body.castShadow = true;
    body.rotation.x = this.bodyRotation;
    
    body.add(this.createHead());
    return body;
  }

  //It creates the head and the eye
  createHead(){
    //Head
    var head = new THREE.Mesh (
      new THREE.SphereGeometry(this.bodyWidth/2.1, 20,20), this.material);

    head.position.y = this.bodyHeight/4;
    head.rotation.y = this.headRotation;
    head.castShadow = true;

    //Eye
    var eye = new THREE.Mesh (
      new THREE.CylinderGeometry (this.bodyWidth/10,this.bodyWidth/10, this.bodyWidth/6, 16, 8), this.material); 
    
    eye.position.y = this.bodyWidth/4;
    eye.position.z = this.bodyWidth/2.5;
    eye.rotation.x = 1.5708;
    eye.castShadow = true;

    head.add(eye);
    return head;
  }

  //It creates the shoulders and the mini legs
  createShoulders(tipo){
    //Shoulder
    var shoulder = new THREE.Mesh (
      new THREE.BoxGeometry (this.shoulderHeight, this.shoulderHeight, this.shoulderHeight), this.material); 

    shoulder.castShadow = true;   
    if(tipo == "R")
      shoulder.position.x = this.bodyWidth/2 + this.shoulderWidth/2;
    else
      shoulder.position.x = -(this.bodyWidth/2 + this.shoulderWidth/2);
    
    //Mini leg
    var miniLeg = new THREE.Mesh (
      new THREE.CylinderGeometry (this.legWidth/2.1,this.legWidth/2.1, this.legHeight*20/100, 16, 8), this.material);

      miniLeg.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, -(this.legHeight*20/100)/2, 0));
      miniLeg.castShadow = true;
      miniLeg.position.y = -this.shoulderHeight/2;

      shoulder.add(miniLeg);

    return shoulder;
  }

  
}