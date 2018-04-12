
/// The Robot class
/**
 * @author David Infante, Jose Ariza
 * 
 */

class Robot extends THREE.Object3D {

  constructor (aMaterial) {
    super();

    this.material = aMaterial;

    // Objects for operating with the robot
    this.root = null;
    this.head = null;
    this.body = null;
    this.extension = null;

    this.hitbox = null;
    this.camera = null;

    this.footHeight = 2;
    this.footWidth = 2;

    this.legWidth = 2;
    this.legHeight = 10;

    this.shoulderHeight = 3;
    this.shoulderWidth = 3;

    this.bodyHeight = 16;
    this.bodyWidth = 8;

    this.radio = 0;

    //Animation robot
    this.bodyRotation = 0;
    this.headRotation = 0;
    this.robotExtension = 0;
    
    this.root = this.createRoot();
    this.root.add(this.createHitbox());
    this.add (this.root);
  }

  getParameters(){
    var pos = new THREE.Vector3();
    pos.setFromMatrixPosition (this.hitbox.matrixWorld);
    var parameters = {pos: pos, radio: this.radio};
    return parameters;
  }
  
  //It creates de tree's root 
  createRoot () {
    var root = new THREE.Object3D();
    root.castShadow = true;
    root.position.y = this.footHeight + this.legHeight + this.shoulderHeight/2;
    root.position.z = 100;
    root.rotation.y = 3.14;
    root.add(this.createFoot("L"));
    root.add(this.createFoot("R"));
    root.add(this.createExtension());
    return root;
  }

  //It creates the robot's hitbox
  createHitbox () {
    var height = this.footHeight + this.legHeight + this.robotExtension + this.shoulderHeight/2
      + this.bodyHeight/4 + this.bodyWidth/2;
    this.radio = height/2;
    this.hitbox = new THREE.Mesh (
      new THREE.SphereGeometry(this.radio, 20,20));
    this.hitbox.position.y = -(this.radio - (this.bodyHeight/4 + this.bodyWidth/2)) + this.robotExtension;
    this.hitbox.material.transparent = true;
    this.hitbox.material.opacity = 0.0;
    return this.hitbox;
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
  createExtension() {
    this.extension = new THREE.Object3D();
    this.extension.position.y = this.robotExtension;
    this.extension.add(this.createBody());
    this.extension.add(this.createShoulders("R"));
    this.extension.add(this.createShoulders("L"));
    return this.extension;
  }

  //It creates de body
  createBody() {
    this.body = new THREE.Mesh (
      new THREE.CylinderGeometry (this.bodyWidth/2,this.bodyWidth/2, this.bodyHeight, 16, 8), this.material); 
    
    this.body.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, -this.bodyHeight/4, 0));
    this.body.castShadow = true;
    this.body.rotation.x = this.bodyRotation;
    
    this.body.add(this.createHead());
    return this.body;
  }

  //It creates the head and the eye
  createHead() {
    //Head
    this.head = new THREE.Mesh (
      new THREE.SphereGeometry(this.bodyWidth/2.1, 20,20), this.material);

    this.head.position.y = this.bodyHeight/4;
    this.head.rotation.y = this.headRotation;
    this.head.castShadow = true;

    //Eye
    var eye = new THREE.Mesh (
      new THREE.CylinderGeometry (this.bodyWidth/10,this.bodyWidth/10, this.bodyWidth/6, 16, 8), this.material); 
    
    eye.position.y = this.bodyWidth/4;
    eye.position.z = this.bodyWidth/2.5;
    eye.rotation.x = 1.5708;
    eye.castShadow = true;
    eye.add(this.createLight());
    eye.add(this.createCamera());

    this.head.add(eye);
    return this.head;
  }

  //It creates the robot's lantern in its eye
  createLight() {
    var robotLight = new THREE.SpotLight( 0xffffff );
    robotLight.position.set(0, this.bodyWidth/4, this.bodyWidth/2.5);
    robotLight.castShadow = true;
    robotLight.shadow.mapSize.width=2048;
    robotLight.shadow.mapSize.height=2048;
    robotLight.angle = 0.8;
    robotLight.penumbra = 0.5;
    var targetLight = new THREE.Object3D();
    targetLight.position.set(0, 1, 0);
    robotLight.target = targetLight;
    
    robotLight.add(targetLight);

    return robotLight;
  }

  //It creates the robot's camera in its eye
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, this.bodyWidth/4, this.bodyWidth/2.5);
    var look = new THREE.Vector3 (0,200,50);
    this.camera.lookAt(look);

    return this.camera;
  }

  //It creates the shoulders and the mini legs
  createShoulders(tipo) {
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

  //It animates the robot
  animateRobot(headRotation, bodyRotation, robotExtension) {
    //Head rotation
    this.headRotation = headRotation;
    this.head.rotation.y = this.headRotation;
    //Body rotation
    this.bodyRotation = bodyRotation;
    this.body.rotation.x = this.bodyRotation;
    //Robot extension
    if (robotExtension != this.robotExtension) {
      this.robotExtension = robotExtension;
      this.extension.position.y = this.robotExtension;
      this.root.remove(this.hitbox);
      this.root.add(this.createHitbox());
    }
    
  }

  //It rotates the robot
  rotateRobot(type) {
    if(type=="L")
      this.root.rotation.y += 0.2;
    else
      this.root.rotation.y -= 0.2; 
  }

  //It moves the robot with a tank type movement
  moveRobotTank(type) {
    if(type=="F") {
      this.root.position.z += 2*Math.cos(this.root.rotation.y);
      this.root.position.x += 2*Math.sin(this.root.rotation.y); 
    } else {
      this.root.position.z -= 2*Math.cos(this.root.rotation.y);
      this.root.position.x -= 2*Math.sin(this.root.rotation.y);
    }
  }

  
}