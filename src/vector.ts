import * as THREE from 'three';

export default class Vector {
  private vector: THREE.Vector3 = new THREE.Vector3();
  private static up:  THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  private locked: boolean = false;
  public _x: number = 0;
  public _y: number = 0;
  public _z: number = 0;
  public _r: number = 0;
  public _phi: number = 0;
  public _theta: number = 0;

  get x():number {return this._x;}
  set x(n: number) {this.willSet();this._x = n;this.recalculateFrom3();}
  get y():number {return this._y;}
  set y(n: number) {this.willSet();this._y = n;this.recalculateFrom3();}
  get z():number {return this._z;}
  set z(n: number) {this.willSet();this._z = n;this.recalculateFrom3();}
  get r():number {return this._r;}
  set r(n: number) {this.willSet();this._r = n;this.recalculateFromSpherical();}
  get phi():number {return this._phi;}
  set phi(n: number) {this.willSet();this._phi = n;this.recalculateFromSpherical();}
  get theta():number {return this._theta;}
  set theta(n: number) {this.willSet();this._theta = n;this.recalculateFromSpherical();}

  private willSet():void {
    if (this.locked) {
      throw 'Vector is locked';
    }
  }
	
	private recalculateFrom3() {
		this.vector.setX(this._x);
		this.vector.setY(this._y);
		this.vector.setZ(this._z);
		this.recalculate();
	}
	
	private recalculateFromSpherical() {
		this.setFromSpherical(this._r, this._phi, this._theta);
	}

  public lock():Vector {
    this.locked = true;
    return this;
  }

  public constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.vector.x = x;
    this.vector.y = y;
    this.vector.z = z;
    this.recalculate();
  }

  public setFromSpherical(long: number, phi: number, theta: number): Vector {
    this._r = long;
    this._phi = phi;
    this._theta = theta;
    this.vector.setFromSpherical(
      new THREE.Spherical(long, this.rad(phi), this.rad(theta))
    );
    this._x = this.vector.x;
    this._y = this.vector.y;
    this._z = this.vector.z;
    return this;
  }

  public setFromObject(xyz: {[key: string]:any}): Vector {
    this._x = xyz.x;
    this._y = xyz.y;
    this._z = xyz.z;
    this.recalculateFrom3();
    return this;
  }

  public store(): {[key: string]:any} {
    return {
      x: this._x,
      y: this._y,
      z: this._z,
    };
  }

  public restore(data: {[key: string]:any}): Vector {
    this._x = data.x;
    this._y = data.y;
    this._z = data.z;
    this.recalculateFrom3();
    return this;
  }
  
  public getCopy(): THREE.Vector3 {
    return this.vector.clone();
  }
	
	public getSafe(): THREE.Vector3 {
		if (this.locked) {
			return this.vector;
		} else {
			return this.getCopy();
		}
	}

  public clone(): Vector {
    return new Vector(this.x, this.y, this.z);
  }

  public add(vector: Vector): Vector {
    this.vector.add(vector.getSafe());
    this.recalculate();
    return this;
  }

  public sub(vector: Vector): Vector {
    this.vector.sub(vector.getSafe());
    this.recalculate();
    return this;
  }
	
	public distanceTo(b:Vector): number {
		return this.vector.distanceTo(b.getSafe());
	}

  public multiplyScalar(scalar:number): Vector {
    this.vector.multiplyScalar(scalar);
    this.recalculate();
    return this;
  }
	
	public setLength(length:number): Vector {
    this.vector.setLength(length);
    this.recalculate();
    return this;
	}

  public addRotation(rotatedVector: Vector): Vector {
    this.vector.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        Vector.up,
        rotatedVector.getCopy().normalize()
      )
    );
    this.recalculate();
    return this;
  }

  //private methods
  private recalculate(): void {
    this._x = this.vector.x;
    this._y = this.vector.y;
    this._z = this.vector.z;
    var spherical = new THREE.Spherical().setFromVector3(this.vector);
    this._r = spherical.radius;
    this._phi = this.deg(spherical.phi);
    this._theta = this.deg(spherical.theta);
  }
  //helper functions
  private normaldeg(d: number): number {
    var angle = d % 360;
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  }
  private deg(r: number): number {
    return this.normaldeg(180 * r / Math.PI);
  }
  private rad(d: number): number {
    return Math.PI * this.normaldeg(d) / 180;
  }
}