export function randomrange(min:number, max:number, int:boolean):number {
	if (int) {
		return Math.round(Math.random() * (max - min) + min);
	} else {
		return Math.random() * (max - min) + min;
	}
}