// The flying object class
/**
 * @author David Infante, Jose Ariza
 * 
 */

class FlyObj extends THREE.Mesh {
    
    constructor(aMaterial, aBehavior) {
        super();

        this.material = aMaterial;
        this.objWidth = 8;
        this.ball = null;
        this.speed = null;
        this.timePast = null;
        this.speed = null;
        this.collision = false;
        //Good or bad :p
        this.behaviour = aBehavior;
        this.createObject();
    }

    getParameters() {
        var parameters = {x: this.ball.position.x, y: this.ball.position.y,
            z: this.ball.position.z, radio: this.objWidth/2, behaviour: this.behaviour};
        return parameters;
    }

    setCollision() {
        this.collision = true;
    }

    createObject() {
        this.ball = new THREE.Mesh (
            new THREE.SphereGeometry(this.objWidth/2, 20,20), this.material);
        this.ball.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0, 0),);
        this.setPosition();
        this.ball.castShadow = true;
        this.add(this.ball);
    }

    launch() {
        this.timePast = Date.now();
    }

    setPosition() {
        this.collision = false;
        this.speed = Math.floor((Math.random() * 100) + 10);
        this.ball.position.z = -150;
        this.ball.position.y = Math.floor((Math.random() * 15) + 5);
        this.ball.position.x = Math.floor((Math.random() * (80 + 80)) - 80);
    }

    update() {
        var timeActual = Date.now();
        this.ball.position.z += this.speed*(timeActual-this.timePast)/1000;
        this.timePast = timeActual;
        if(this.ball.position.z > 150 || this.collision == true)
            this.setPosition();
    }
}