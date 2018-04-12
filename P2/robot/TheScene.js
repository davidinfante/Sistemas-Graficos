
/// The Model Facade class. The root node of the graph.
/**
 * @author David Infante, Jose Ariza
 *
 * @param renderer - The renderer to visualize the scene
 */
 
class TheScene extends THREE.Scene {
  
  constructor (renderer) {
    super();
    
    // Attributes
    this.marker = null;
    this.ambientLight = null;
    this.spotLight = null;
    this.trackballControls = null;
    this.robot = null;
    this.ground = null;
    this.timePast = Date.now();
    this.maxFly = 10;

    this.hudPositionX = -0.23;//(60 / 100) * 2 - 1;
    this.hudPositionY = 0.11;//(50 / 100) * 2 - 1;
    this.hudPositionZ = -0.3;

    this.lastHealth = 100;
    this.health = 100;
    this.score = 0;

    this.camera = null;
    this.currentCamera = null;
    this.actualCamera = 0;
    this.hud = null;
    this.hudRobot = null;

    this.fly = [];
    this.createLights ();
    this.createMarker();
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
    
    //HUD creation
    this.hud = new HUD(new THREE.LineBasicMaterial({ color: 0x00ff00 }), this.health);
    this.hudRobot = new HUD(new THREE.LineBasicMaterial({ color: 0x00ff00 }), this.health);
    this.camera.add(this.hud);
    this.hud.position.set(this.hudPositionX, this.hudPositionY, this.hudPositionZ);
    this.hudRobot.position.set(this.hudPositionX, this.hudPositionY, this.hudPositionZ);

    this.currentCamera = this.camera;

    this.add(this.currentCamera);
  }

  // It creates the marker
  createMarker() {
    var text = document.createElement('div');
    text.id = "marker";
    text.style.position = 'absolute';
    text.style.width = 1;
    text.style.height = 1;
    text.innerHTML = this.score;
    text.style.top = 100 + 'px';
    text.style.left = 100 + 'px';
    text.style.fontSize = 50 + 'px';
    document.body.appendChild(text);
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
    var model = new THREE.Object3D();
    var loader = new THREE.TextureLoader();
    var texture = null;

    //It creates the flying objects
    var behaviour = null;
    for (var i = 0; i < this.maxFly; ++i) {
      if (Math.floor(Math.random() * 10) < 5) {
        behaviour = true;
        texture = loader.load ("imgs/cesped.jpg");
      } else {
        behaviour = false;
        texture = loader.load ("imgs/fuego.jpg");
      }
      this.fly[i] = new FlyObj(new THREE.MeshPhongMaterial ({map: texture}), behaviour);
      model.add(this.fly[i]);
    }

    //It creates the robot
    texture = loader.load ("imgs/r2d2.png");
    this.robot = new Robot(new THREE.MeshPhongMaterial ({map: texture}));
    model.add (this.robot);
    
    //It creates the floor
    texture = loader.load ("imgs/carretera.jpg");
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
    

    for (var i = 0; i < this.maxFly; ++i) {
      this.fly[i].update();
    }

    this.manageCollitions();

    if (this.health <= 0)
      alert("GAME OVER");
  }


  //It changes the hud's texture
  changeHUDTexture(image) {
    this.currentCamera.remove(this.hud);
    this.currentCamera.remove(this.hudRobot);

    this.hud = new HUD(new THREE.LineBasicMaterial({ color: image }), this.health);
    this.hudRobot = new HUD(new THREE.LineBasicMaterial({ color: image }), this.health);
    this.hud.position.set(this.hudPositionX, this.hudPositionY, this.hudPositionZ);
    this.hudRobot.position.set(this.hudPositionX, this.hudPositionY, this.hudPositionZ);

    if (this.actualCamera == 1) this.currentCamera.add(this.hud);
    if (this.actualCamera == 0) this.currentCamera.add(this.hudRobot);
  }

  //Manages the HUD's lifebar
  manageHUD () {
    if (this.lastHealth < 50 && this.health >= 50) {
      this.changeHUDTexture(0x00ff00);
    }
    else if (this.lastHealth >= 20 && this.health < 20) {
      this.changeHUDTexture(0xff0000);
    }
    else if ((this.lastHealth < 20 && this.health >=20) || ( this.lastHealth >= 50 && this.health <= 50)) {
      this.changeHUDTexture(0xffa500);
    }
  }

  //It set's the score
  setScore() {
    var text = document.getElementById("marker");
    text.innerHTML = this.score;
  }


  // It manages the collitions between the objects and the robot
  manageCollitions () {
    var paramRobot = this.robot.getParameters();
    for (var i = 0; i < this.maxFly; ++i) {
      var paramFly = this.fly[i].getParameters();
      var distance = Math.sqrt(Math.pow((paramFly.x - paramRobot.pos.x),2) + Math.pow((paramFly.y - paramRobot.pos.y),2)
        + Math.pow((paramFly.z - paramRobot.pos.z),2));

      if (distance <= (paramRobot.radio + paramFly.radio)) {
        this.fly[i].setCollision();
        this.lastHealth = this.health;

        if (!paramFly.behaviour) {
          this.health -= 10;
          if (this.health < 0) this.health = 0;
        } else if (paramFly.behaviour) {
          var scorePlus = Math.floor(Math.random()*(5+1))
          this.health += 5 - scorePlus;
          this.score += scorePlus;
          this.setScore();
          if(this.health > 100) this.health = 100;
        }
        this.manageHUD();
        this.hud.changeSize(this.health);
        this.hudRobot.changeSize(this.health);
      }
    }
  }
  
  //All the Robot movement funcs
  moveForwRobot () {
    if (this.robot.position.z > -246) this.robot.position.z -= 2;
  }

  moveBackRobot () {
    if (this.robot.position.z < 46) this.robot.position.z += 2;
  }

  moveLeftRobot () {
    if (this.robot.position.x > -94) this.robot.position.x -= 2;
  }

  moveRightRobot () {
    if (this.robot.position.x < 94) this.robot.position.x += 2;
  }

  rotateRobot(type) {
    this.robot.rotateRobot(type);
  }

  moveRobotTank(type) {
    this.robot.moveRobotTank(type);
  }

  //It changes the game's view
  changeView() {
    if (this.actualCamera == 0) {
      this.currentCamera.remove(this.hud);
      this.currentCamera = this.robot.camera;
      this.currentCamera.add(this.hudRobot);

      this.actualCamera = 1;
    } else if (this.actualCamera == 1) {
      this.currentCamera.remove(this.hudRobot);
      this.currentCamera = this.camera;
      this.currentCamera.add(this.hud);

      this.actualCamera = 0;
    }
  }

  /// It returns the camera
  /**
   * @return The camera
   */
  getCamera () {
    return this.currentCamera;
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

