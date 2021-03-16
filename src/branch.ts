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
    private levels: number,
    public section: number = 0,
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
        //delete this.elements[i];  //I'm not sure whether it reduces or increases complexity...
      }
    }
    if (this.long <= 0) {
      return;
    }
    var endpoint = this.start.clone();
		var sumlength:number = 0;
    var radiae = [];
    for (let i = 0; i < this.sections.length; i++) {
      radiae[i] = Math.sqrt(this.score(i)) * this.s('endwidth');
    }
    for (let i = 0; i < this.sections.length; i++) {
      let section = this.sections[i];
			let r:number = section.r;
			sumlength += section.r;
			if (sumlength > this.long) {
				r = this.long - sumlength + r;
			}
			if (r <= 0 || !radiae[i]) {
				break;
			}
			let halfsection = section.clone().setLength(r/2);
      let element:Element = document.createElement('a-cone');
      element.setAttribute('height', String(r));
      element.setAttribute('segments-height', '1');
      element.setAttribute('segments-radial', String(Math.min(16, Math.max(3, Math.floor(100*radiae[i])))));
      element.setAttribute('radius-top', String(radiae[i]));
      element.setAttribute('radius-bottom', String(i ? radiae[i-1] : radiae[i]));
      element.setAttribute('color', '#8e7a72');
      element.setAttribute('src', '#barkTexture');
      element.setAttribute('material', 'roughness:1;metalness:0;');
      element.setAttribute('repeat', Math.ceil(radiae[i]/0.1 + 0.1) + ' ' + Math.ceil(r/0.2));
      //add half section
      endpoint.add(halfsection);
      //add place center
      element.setAttribute('position', endpoint.x + ' ' + endpoint.y + ' ' + (endpoint.z));
      //add half section
      endpoint.add(halfsection);
      element.setAttribute('rotation', section.phi + ' ' + section.theta + ' 0',);
      root.appendChild(element);
      this.elements[i] = element;
      if (sumlength >= this.long) {
        //add leaf
        var leaf = document.createElement('a-plane');
        leaf.setAttribute('width', '0.05');
        leaf.setAttribute('height', '0.1');
        leaf.setAttribute('color', '#3a5f0b');
        leaf.setAttribute('position', '0 ' + String(r/2) + ' 0');
        leaf.setAttribute('rotation', '0 0 90');
        leaf.setAttribute('side', 'double');
        element.addEventListener('loaded', function (evt) {
          evt.srcElement.appendChild(leaf);
        });
        break;
      }
    }
  }
	
	public grow(meters:number) {
		var previous = this.long;
		this.long += meters;
		this.long = Math.max(0, Math.min(this.long, this.direction.r));
		if (this.long === previous) {
			return;
		}
    if (this.long && this.sections.length < this.levels) {
      this.populate();
    }
		var a:Branch = this;
		this.branches.forEach(function (b:Branch) {
			var out:number = b.start.distanceTo(a.start);
			var ratio:number = out / a.long;
			var subgrowth;
			if (ratio > 1) {
				subgrowth = -b.long;
			} else {
				subgrowth = meters * a.tree().polyratio(ratio);
			}
      subgrowth = Math.min(subgrowth, meters);  //do not grow more than the parent branch
			b.grow(subgrowth);
		});
	}

  public score(i:number = 0):number {
    var base:number =
      this.branches
      .filter(function (branch) {
        return branch.section === i;
      })
      .reduce(
        function (sum, branch) {return sum + branch.score();},
        0
      )
    ;
    if (i <= this.sections.length - 1) {
      base += this.score(i+1);
    }
    return base ? base : (this.long > (this.s('endwidth') * 2) ? 1 : 0);
  }

  public populate() {
    //set sections
    for (let i = 0; i < this.levels; i++) {
      this.sections[this.sections.length] = new Vector()
        .setFromSpherical(this.direction.r / this.levels, this.s('bend'), Math.random() * 360)
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
          Math.max(1, this.levels - 1),
          i,
        );
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
      i: this.section,
      ls: this.levels,
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
        self,
        b.ls,
        b.i,
      ).restore(b)
    );
    return this;
  }


}