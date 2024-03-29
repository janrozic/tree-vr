import Vector from './Vector';
import Branch from './Branch';
import './growable.js';
import * as H from './Helpers';

export default class Tree {
  private branches: Branch[] = [];
	private firstlevel: Branch[] = [];
	private element: H.AframeElement;
  private position:Vector;
  public deep: number = 0;
  private settings: { [key: string]: any } = {
    endwidth: 0.008,	//last branches width
    levels: 6,  //main trunk parts, each section has outgrowing subbranches
    depth: 6,  //max recursion depth of sub-subbranches
    branches: [1, 1, true],	//first-level branches
    subbranches: [1, 3, true],	//outgrowing branches at each point
    bend: [0, 25, false],	//bend of each branch section
    outbend: [20, 80],	//bend of subbranches
    height: 3,	//max height
    firmness: 0.7,	//branch weight support capability ... between 0 and 1 ... 0=rambling; 1=tree
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
        this,
        this.s('levels'),
      );
    }
  }

  public place(scene: HTMLElement, position:Vector):Tree {
    this.position = position;
    this.populate();
		if (!this.element) {
			this.element = document.createElement('a-entity');
			Object(this.element).tree = this;
			this.element.setAttribute('growable', this.s('height'));
        this.element.setAttribute('geometry', {
        primitive:'cylinder',
        radius:1,
        height:0.05,
        segmentsHeight:1,
      });
			this.element.setAttribute('material', {
        shader: 'flat',
        color: 'green',
        transparent: true,
        opacity: 0.7,
        visible:false,
      });
		}
		this.element.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
    scene.appendChild(this.element);
    return this;
  }

  public render():Tree {
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].render(this.element);
    }
    return this;
  }

	public polyratio(ratio:number):number {
		var value:number = 0;
		var poly = this.s('shape').poly;
		for (var i = 0; i < poly.length; i++) {
			value += poly[i] * Math.pow(ratio, i);
		}
		return value;
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
      p: this.position.store(),
      s: this.settings,
    };
  }
  
  public restore(data: {[key: string]:any}): Tree {
    this.settings = data.s;
    this.position = new Vector().restore(data.p);
    var self = this;
    data.b.map(
    (b:{[key: string]:any}) =>
    new Branch(
        new Vector().restore(b.s),
        new Vector().restore(b.d),
        self,
        this.s('levels'),
      ).restore(b)
    );
    return this;
  }
}