
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
 
class TheScene extends THREE.Scene {
  
  constructor (renderer) {
    super();
    
    // Attributes
    this.ambientLight = null;
    this.spotLight = null;
    this.camera = null;
    this.trackballControls = null;
    this.robot = null;
    this.ground = null;
    this.timePast = Date.now();
    this.maxFly = 10;
    this.fly = [];
    this.createLights ();
    this.createCamera (renderer);
    this.axis = new THREE.AxisHelper (25);
    this.add (this.axis);
    this.model = this.createModel ();
    this.add (this.model);
  }
  
  /// It creates the camera and adds it to the graph
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (0, 200, 200);
    var look = new THREE.Vector3 (0,20,50);
    this.camera.lookAt(look);

    this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
    this.trackballControls.rotateSpeed = 5;
    this.trackballControls.zoomSpeed = -2;
    this.trackballControls.panSpeed = 0.5;
    this.trackballControls.target = look;
    
    this.add(this.camera);
  }
  
  /// It creates lights and adds them to the graph
  createLights () {
    // add subtle ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (this.ambientLight);
    
    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 100, 60, 0 );
    this.spotLight.castShadow = true;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width=2048;
    this.spotLight.shadow.mapSize.height=2048;
    this.add (this.spotLight);
  }
  
  /// It creates the geometric model: robot and ground
  /**
   * @return The model
   */
  createModel () {
    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/wood.jpg");
    var model = new THREE.Object3D();

    for(var i = 0; i < this.maxFly; ++i){
      this.fly[i] = new FlyObj();
      model.add(this.fly[i]);
    }

    this.robot = new Robot();
    model.add (this.robot);
    
    this.ground = new Ground (200, 300, new THREE.MeshPhongMaterial ({map: textura}));
    model.add (this.ground);

    return model;
  }

  
  /// It sets the robot position according to the GUI
  /**
   * @controls - The GUI information
   */
  animate (controls) {
    this.axis.visible = controls.axis;
    this.spotLight.visible = controls.light1onoff;
    this.spotLight.intensity = controls.lightIntensity;
    this.robot.animateRobot(controls.headRotation, controls.bodyRotation, controls.robotExtension);

    /* Para que cada bola salga cada 2 segundos, poco útil
    var timeActual = Date.now();

    if(this.maxFly<10 && (timeActual-this.timePast > 2000)){
      this.fly[this.maxFly].launch();
      this.maxFly++;
      this.timePast = Date.now();
    }
    */
    for(var i=0;i<this.maxFly;++i){
      this.fly[i].update();
    }
    this.manageCollitions();
  }

  // It manages the collitions between the objects and the robot
  manageCollitions (){
    var paramRobot = this.robot.getParameters();
    for(var i=0;i<this.maxFly;++i){
      var paramFly = this.fly[i].getParameters();
      var distance = Math.sqrt(Math.pow((paramFly.x - paramRobot.pos.x),2) + Math.pow((paramFly.y - paramRobot.pos.y),2)
        + Math.pow((paramFly.z - paramRobot.pos.z),2));

      if(distance <= (paramRobot.radio + paramFly.radio))
        this.fly[i].setCollision();
    }
  }
  
  moveForwRobot () {
    this.robot.position.z -= 1;
  }

  moveBackRobot () {
    this.robot.position.z += 1;
  }

  moveLeftRobot () {
    this.robot.position.x -= 1;
  }

  moveRightRobot () {
    this.robot.position.x += 1;
  }

  rotateRobot(type){
    this.robot.rotateRobot(type);
  }

  moveRobotTank(type){
    this.robot.moveRobotTank(type);
  }

  /// It returns the camera
  /**
   * @return The camera
   */
  getCamera () {
    return this.camera;
  }
  
  /// It returns the camera controls
  /**
   * @return The camera controls
   */
  getCameraControls () {
    return this.trackballControls;
  }
  
  /// It updates the aspect ratio of the camera
  /**
   * @param anAspectRatio - The new aspect ratio for the camera
   */
  setCameraAspect (anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }
  
}

