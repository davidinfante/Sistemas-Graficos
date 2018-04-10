
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
 
class TheScene extends THREE.Scene {
  
  constructor (renderer) {
    super();
    
    // Attributes
    this.hud = null;
    this.marker = null;
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

    this.health = 3;
    this.lastHealth = 3;
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
    
    //HUD creation
    var loader = new THREE.TextureLoader();
    var texture  = loader.load ("imgs/lifebar3.png");
    this.hud = new HUD(new THREE.MeshBasicMaterial({map: texture }));
    this.camera.add(this.hud);
    //Place it in the center
    var hudPositionX = (41 / 100) * 2 - 1;
    var hudPositionY = (55.5 / 100) * 2 - 1;
    this.hud.position.set(hudPositionX, hudPositionY, -0.3);

    var material = new THREE.MeshPhongMaterial({
      color: 0xdddddd
    });
    /*
    var textGeom = new THREE.TextGeometry( 'Hello World!', {
      font: 'helvetiker' // Must be lowercase!
    });

    var textMesh = new THREE.Mesh( textGeom, material );

    this.add( textMesh );
    */

    this.add(this.camera);
  }
  
  /// It creates lights and adds them to the graph
  createLights () {
    // add subtle ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (this.ambientLight);
    
    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 0, 110, 0 );
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
    var model = new THREE.Object3D();
    var texture = null;

    var behaviour = null;
    for(var i = 0; i < this.maxFly; ++i){
      if (Math.floor(Math.random() * 10) < 5) {
        behaviour = true;
        texture = loader.load ("imgs/cabesaxD.jpg");
      } else {
        behaviour = false;
        texture = loader.load ("imgs/puma.jpg");
      }
      this.fly[i] = new FlyObj(new THREE.MeshPhongMaterial ({map: texture}), behaviour);
      model.add(this.fly[i]);
    }

    texture = loader.load ("imgs/r2d2.png");
    this.robot = new Robot(new THREE.MeshPhongMaterial ({map: texture}));
    model.add (this.robot);
    
    texture = loader.load ("imgs/cancha.jpg");
    this.ground = new Ground (200, 300, new THREE.MeshPhongMaterial ({map: texture}));
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

    for(var i = 0; i < this.maxFly; ++i) {
      this.fly[i].update();
    }

    this.manageCollitions();
    this.manageHUD();

  }

  //Manages the HUD's lifebar
  manageHUD () {
    if (this.health != this.lastHealth) {
      var loader = new THREE.TextureLoader();
      var texture = null;
      var hudPositionX = (41 / 100) * 2 - 1;
      var hudPositionY = (55.5 / 100) * 2 - 1;
      switch(this.health) {
        case 3:
          this.camera.remove(this.hud);
          texture  = loader.load ("imgs/lifebar3.png");
          this.hud = new HUD(new THREE.MeshBasicMaterial({map: texture }));
          this.camera.add(this.hud);
          //Place it in the center
          this.hud.position.set(hudPositionX, hudPositionY, -0.3);
        break;
        case 2:
          this.camera.remove(this.hud);
          texture  = loader.load ("imgs/lifebar2.png");
          this.hud = new HUD(new THREE.MeshBasicMaterial({map: texture }));
          this.camera.add(this.hud);
          //Place it in the center
          this.hud.position.set(hudPositionX, hudPositionY, -0.3);
        break;
        case 1:
          this.camera.remove(this.hud);
          texture  = loader.load ("imgs/lifebar1.png");
          this.hud = new HUD(new THREE.MeshBasicMaterial({map: texture }));
          this.camera.add(this.hud);
          //Place it in the center
          this.hud.position.set(hudPositionX, hudPositionY, -0.3);
        break;
      }
    }
    this.lastHealth = this.health;
  }

  // It manages the collitions between the objects and the robot
  manageCollitions () {
    var paramRobot = this.robot.getParameters();
    for(var i = 0; i < this.maxFly; ++i) {
      var paramFly = this.fly[i].getParameters();
      var distance = Math.sqrt(Math.pow((paramFly.x - paramRobot.pos.x),2) + Math.pow((paramFly.y - paramRobot.pos.y),2)
        + Math.pow((paramFly.z - paramRobot.pos.z),2));

      if (distance <= (paramRobot.radio + paramFly.radio)) {
        this.fly[i].setCollision();
        if (!paramFly.behaviour && this.health > 1) --this.health;
        else if (paramFly.behaviour && this.health < 3) ++this.health;
      }
    }
  }
  
  //All the Robot movement funcs
  moveForwRobot () {
    this.robot.position.z -= 2;
  }

  moveBackRobot () {
    this.robot.position.z += 2;
  }

  moveLeftRobot () {
    this.robot.position.x -= 2;
  }

  moveRightRobot () {
    this.robot.position.x += 2;
  }

  rotateRobot(type) {
    this.robot.rotateRobot(type);
  }

  moveRobotTank(type) {
    this.robot.moveRobotTank(type);
  }

  changeView(){
    
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

