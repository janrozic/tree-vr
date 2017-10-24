export interface AframeElement extends HTMLElement {
  setAttribute(type: string, newValue: any): void;
}

export function randomrange(min:number, max:number, int:boolean):number {
	if (int) {
		return Math.round(Math.random() * (max - min) + min);
	} else {
		return Math.random() * (max - min) + min;
	}
}