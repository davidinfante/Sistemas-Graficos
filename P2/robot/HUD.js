/**
 * @author David Infante, Jose Ariza
 * 
 */

class HUD extends THREE.Object3D {

  constructor (aMaterial, sizeX, sizeY) {
    super();

    this.sizeX = (sizeX === undefined ? 0.1 : sizeX);
    this.sizeY = (sizeY === undefined ? 0.02 : sizeY);
    this.material = aMaterial;
    
    this.add (this.createRoot());
  }
  
  // It creates de tree's root
  createRoot() {
    var root = new THREE.Object3D();
    root.castShadow = false;
    root.autoUpdateMatrix = false;
    root.updateMatrix();
    root.add(this.createLifebar());
    return root;
  }

  // It creates the life bar
  createLifebar() {
    var rectangle = new THREE.Mesh(new THREE.BoxGeometry (this.sizeX, this.sizeY, 0.0), this.material);

    rectangle.castShadow = false;
    rectangle.autoUpdateMatrix = false;

    rectangle.updateMatrix();

    return rectangle;
  }
  
}