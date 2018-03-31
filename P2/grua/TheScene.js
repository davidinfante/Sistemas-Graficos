
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

    //-----------------
    //New Light
    //-----------------
    this.spotLight2 = null;

    this.camera = null;
    this.trackballControls = null;
    this.robot = null;
    this.ground = null;
  
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
    this.camera.position.set (60, 30, 60);
    var look = new THREE.Vector3 (0,20,0);
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
    this.spotLight.position.set( 60, 60, 40 );
    this.spotLight.castShadow = true;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width=2048;
    this.spotLight.shadow.mapSize.height=2048;
    this.add (this.spotLight);

    //-----------------
    //New Light
    //-----------------
    // add spotlight for the shadows
    this.spotLight2 = new THREE.SpotLight( 0xff0000 );
    this.spotLight2.position.set( -60, 60, 40 );
    this.spotLight2.castShadow = true;
    // the shadow resolution
    this.spotLight2.shadow.mapSize.width=2048;
    this.spotLight2.shadow.mapSize.height=2048;
    this.add (this.spotLight2);
  }
  
  /// It creates the geometric model: robot and ground
  /**
   * @return The model
   */
  createModel () {
    var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/wood.jpg");

    var model = new THREE.Object3D();
    //-----------------
    //Texture
    //-----------------
    this.robot = new Robot();
    model.add (this.robot);
    
    this.ground = new Ground ();
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
    
    //-----------------
    //New Light
    //-----------------
    this.spotLight2.visible = controls.light2onoff;
    this.spotLight2.intensity = controls.lightIntensity2;

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

  // class variables
  
  // Application modes
  TheScene.NO_ACTION = 0;
  TheScene.ADDING_BOXES = 1;
  TheScene.MOVING_BOXES = 2;

  //-----------------
  //Deleting Boxes
  //-----------------
  TheScene.DELETING_BOXES = 3;
  
  // Actions
  TheScene.NEW_BOX = 0;
  TheScene.MOVE_BOX = 1;
  TheScene.SELECT_BOX = 2;
  TheScene.ROTATE_BOX = 3;
  TheScene.END_ACTION = 10;

  //-----------------
  //Deleting Boxes
  //-----------------
  TheScene.DEL_BOX = 4;

