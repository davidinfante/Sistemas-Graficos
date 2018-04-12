/**
 * @author David Infante, Jose Ariza
 * 
 */

class HUD extends THREE.Object3D {

  constructor (aMaterial, health) {
    super();

    this.sizeX = 0.1;
    this.sizeY = 0.02;
    this.material = aMaterial;
    this.rectangle = null;
    
    this.add (this.createRoot(health));
  }
  
  // It creates de tree's root
  createRoot(health) {
    var root = new THREE.Object3D();
    root.castShadow = false;
    root.autoUpdateMatrix = false;
    root.updateMatrix();
    root.add(this.createLifebar(health));
    root.add(this.createContainer());
    return root;
  }

  // It creates the life bar
  createLifebar(health) {
    this.rectangle = new THREE.Mesh(new THREE.BoxGeometry (this.sizeX, this.sizeY, 0.0), this.material);
    this.rectangle.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.sizeX/2, 0, 0));
    
    this.rectangle.scale.x = health/100;
    this.rectangle.castShadow = false;

    return this.rectangle;
  }

  // It creates the container
  createContainer() {
    var container = new THREE.Mesh(new THREE.BoxGeometry (this.sizeX*1.025, this.sizeY*1.1, 0.0), new THREE.LineBasicMaterial({ color: 0x000000 }));
    container.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.sizeX/2., 0, -0.0001));
    
    container.castShadow = false;

    return container;
  }

  changeSize(health) {
    this.rectangle.scale.x = health/100;
  }
  
}