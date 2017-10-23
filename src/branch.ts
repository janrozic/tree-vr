import Vector from './Vector';
import Tree from './Tree';
import * as H from './Helpers';

export default class Branch {
  private sections: Vector[] = [];
  private branches: Branch[] = [];
  private elements: Element[] = [];
  public deep: number;
	private long: number = 0;

  public constructor(
    private start: Vector,
    private direction: Vector,
    private parent: Branch | Tree,
  ) {
    this.deep = parent.deep + 1;
    this.parent.addbranch(this);
		this.direction.phi *= 1 - this.s('verticalaffinity');
    this.direction.lock();
    this.start.lock();
  }

  public addbranch(branch: Branch):void {
    this.branches[this.branches.length] = branch;
    this.tree().addbranch(branch);
  }

  public render(root: Element):void {
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i] && this.elements[i].parentNode) {
        this.elements[i].parentNode.removeChild(this.elements[i]);
      }
    }
    var endpoint = this.start.clone();
		var sumlength:number = 0;
    for (let i = 0; i < this.sections.length; i++) {
      let section = this.sections[i];
			let r:number = section.r;
			sumlength += section.r;
			if (sumlength > this.long) {
				r = this.long - sumlength + r;
				i = this.sections.length;	//got to end of loop
			}
			if (r <= 0) {
				break;
			}
			let radius:number = this.long / this.s('thicknessratio');
			if (radius < 0.01) {
				continue;
			}
			let halfsection = section.clone().setLength(r/2);
      let element:Element = document.createElement('a-cone');
      element.setAttribute('height', String(r));
      element.setAttribute('segments-height', '1');
      element.setAttribute('segments-radial', String(Math.min(3, Math.max(3, Math.floor(100*radius)))));
      element.setAttribute('radius-top', String(0.7*radius));
      element.setAttribute('radius-bottom', String(radius));
      element.setAttribute('color', '#a36859');
      //add half section
      endpoint.add(halfsection);
      //add place center
      element.setAttribute('position', endpoint.x + ' ' + endpoint.y + ' ' + (endpoint.z - 3));
      //add half section
      endpoint.add(halfsection);
      element.setAttribute('rotation', section.phi + ' ' + section.theta + ' 0',);
      root.appendChild(element);
      this.elements[i] = element;
    }
  }
	
	public grow(meters:number) {
		var previous = this.long;
		this.long += meters;
		this.long = Math.max(0, Math.min(this.long, this.direction.r));
		if (this.long === previous) {
			return;
		}
		var a:Branch = this;
		this.branches.forEach(function (b:Branch) {
			var out:number = b.start.distanceTo(a.start);
			var ratio:number = out / a.long;
			var subgrowth;
			if (ratio > 1) {
				subgrowth = -b.long;
			} else {
				subgrowth = meters * a.polyratio(ratio);
			}
			b.grow(subgrowth);
		});
	}
	
	public polyratio(ratio:number):number {
		var value:number = 0;
		var poly = this.s('shape').poly;
		for (var i = 0; i < poly.length; i++) {
			value += poly[i] * Math.pow(ratio, i);
		}
		return value;
	}

  public populate(levels: number) {
    //set sections
    for (let i = 0; i < levels; i++) {
      this.sections[this.sections.length] = new Vector()
        .setFromSpherical(this.direction.r / levels, this.s('bend'), Math.random() * 360)
        .addRotation(this.direction)
      ;
    }
    if (this.deep >= this.s('depth')) {
      return;
    }
    //set subbranches
    var endpoint = this.start.clone();
    for (let i = 0; i < this.sections.length; i++) {
      endpoint.add(this.sections[i]);
      let count = this.s('subbranches');
			let rotation = H.randomrange(0, 360, false);
      for (let j = 0; j < count; j++) {
        let out = new Vector().setFromSpherical(
            this.direction.r * 0.68,
            this.s('outbend'),
            (j+1)*360/count + rotation,
          )
          .addRotation(this.direction)
        ;
        new Branch(
          endpoint.clone(),
          out,
          this,
        ).populate(Math.max(1, levels - 1));
      }
    }
  }

  private s(key: string) {
    return this.tree().s(key);
  }

  public tree(): Tree {
    return this.parent.tree();
  }

  public store(): {[key: string]:any} {
    return {
      b: this.branches.map(b => b.store()),
      l: this.long,
      s: this.start.store(),
      d: this.direction.store(),
      cs: this.sections.map((v: Vector) => v.store()),
    };
  }

  public restore(data: {[key: string]:any}): Branch {
    this.long = data.l;
    this.sections = data.cs.map((v:any) => new Vector().restore(v));
    var self = this;
    data.b.map(
      (b:{[key: string]:any}) =>
      new Branch(
        new Vector().restore(b.s),
        new Vector().restore(b.d),
        self
      ).restore(b)
    );
    return this;
  }


}