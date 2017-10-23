import Vector from './Vector';
import Branch from './Branch';
import * as H from './Helpers';

export default class Tree {
  private branches: Branch[] = [];
	private firstlevel: Branch[] = [];
  private x: number;
  private z: number;
  public deep: number = 0;
  private settings: { [key: string]: any } = {
    thicknessratio: 40,	//length-to-thickness ration for branches
    levels: 5,  //main trunk parts, each section has outgrowing subbranches
    depth: 5,  //max recursion depth of sub-subbranches
    branches: [1, 1, true],	//first-level branches
    subbranches: [1, 3, true],	//outgrowing branches at each point
    bend: [0, 15, false],	//bend of each branch section
    outbend: [20, 50],	//bend of subbranches
    height: 3,	//max height
    firmness: 1,	//branch weight support capability ... between 0 and 1 ... 0=rambling; 1=tree
    verticalaffinity: 0.3, //how much branches prefer to grow upwards ... between 0 and 1 ... 0=don't care ... 1=only up
    growthrate: 1, //metres/year
    fullgrown: 1500,
    shape: {
      poly: [-0.0, -0.5, 0, 7.2, 0, -5],
      deviation: 0,
    },
  };

  public constructor(options: { [key: string]: any }) {
    for (let key in options) {
      this.settings[key] = options[key];
    }
  }

  private populate() {
    var trunkcount = this.s('branches');
		var rotation = H.randomrange(0, 360, false);
    for (var i = 0; i < trunkcount; i++) {
      new Branch(
        new Vector(),
        new Vector().setFromSpherical(
          this.s('height'),
          this.s('bend'),
          rotation + 360*(i+1)/trunkcount
        ),
        this
      ).populate(this.s('levels'));
    }
  }

  public place(x: number, z: number) {
    this.populate();
    this.x = x;
    this.z = z;
  }

  public render() {
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].render(document.querySelector('a-scene'));
    }
  }

  public s(key: string) {
    var val = this.settings[key.toLowerCase()];
    if (Array.isArray(val)) {
			return H.randomrange(val[0], val[1], val[2]);
    } else {
      return val;
    }
  }
	
	public grow(meters:number):Tree {
		this.firstlevel.forEach(function (b:Branch) {
			b.grow(meters);
		});
		return this;
	}

  public tree():Tree {
    return this;
  }

  public addbranch(branch: Branch) {
    this.branches[this.branches.length] = branch;
		if (branch.deep === 1) {
			this.firstlevel[this.firstlevel.length] = branch;
		}
  }

  public store(): {[key: string]:any} {
    return {
      b: this.firstlevel.map(b => b.store()),
      x: this.x,
      z: this.z,
      s: this.settings,
    };
  }
  
  public restore(data: {[key: string]:any}): Tree {
    this.settings = data.s;
    this.x = data.x;
    this.z = data.z;
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