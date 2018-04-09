
// 3rd Party
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs';


export class ShotClock {

	/** The PIXI container for the shot clock - where all the graphics will be added */
	public view: PIXI.Container = new PIXI.Container();

	/** An stream of events that happen in the shot clock - emits whenever the shotclock reaches 0 */
	public events$: Subject<boolean> = new Subject<boolean>();

	/** The Javascript timer used to check when the shot clock reaches 0 */
	private timer: any;

	/** The epoch time (in milliseconds) that the timer started */
	private timerStartTime: number;


	constructor(
		private length: number,
	) {

		// Draw the actual shot clock box
		const graphics = new PIXI.Graphics();
		graphics
			.beginFill(0x000000)
			.drawRect(0, 0, 1000, 10)
			.endFill()

		this.view.addChild(graphics);
	}

	/** Resets the clock back to the beginning */
	public resetShotClock() {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.events$.next(true);
			this.resetShotClock();
		}, this.length);
		this.timerStartTime = new Date().getTime();
	}

	/** Renders the progress of the shot clock by changing the scale of the box */
	public render(deltaTime: number, width: number, height: number) {
		const timeSinceStarted = new Date().getTime() - this.timerStartTime;
		const progress = timeSinceStarted / this.length;

		this.view.scale.x = (width / 1000) * (1 - progress);
	}

}
