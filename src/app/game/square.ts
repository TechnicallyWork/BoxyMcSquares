
// 3rd Party
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs';


export class Square {

	/** The container of the square */
	public view: PIXI.Container = new PIXI.Container();

	/** Emits the tap events for the square */
	public tapped$: Subject<boolean> = new Subject<boolean>();

	/** The current x position of the square */
	public x: number;

	/** The current y position of the square */
	public y: number;

	/** The current area/size of the square in pixels */
	public size: number;

	/** The current X velocity of the square */
	private velX: number;

	/** The current Y velocity of the square */
	private velY: number;

	/** How far along the entry animation is (in percent) */
	private animationProgress: number;


	constructor(
		private targetSize: number,
		private vel: number,
		public color: number,
	) {

		// Pick a random X/Y velocity with a given variability
		const variability = .1;
		this.velX = (Math.random() > .5 ? 1 : -1) * this.vel + (Math.random() * (this.vel * variability))
		this.velY = (Math.random() > .5 ? 1 : -1) * this.vel + (Math.random() * (this.vel * variability))

		this.draw();
		this.animationProgress = 0;
	}


	/** Moves the square in position and renders the square */
	public render(deltaTime: number, width: number, height: number) {

		// Square should be proportional the area of the screen (not just width OR height)
		this.size = this.targetSize * Math.sqrt(width * height);

		// Check if the square doesn't have a position yet.
		if (typeof this.x !== 'number') {
			this.x = Math.random() * (width - (this.size / 2));
			this.y = Math.random() * (height - (this.size / 2));
		} else {
			this.x += this.velX * (deltaTime / 16.666);
			this.y += this.velY * (deltaTime / 16.666);
		}

		// Check if the square has reached/passed any boundaries
		if (this.x >= width - this.size / 2) {
			this.velX = Math.abs(this.velX) * -1;
		}
		if (this.x <= this.size / 2) {
			this.velX = Math.abs(this.velX);
		}
		if (this.y >= height - this.size / 2) {
			this.velY = Math.abs(this.velY) * -1;
		}
		if (this.y <= this.size / 2) {
			this.velY = Math.abs(this.velY);
		}

		// Move the actual container of the square to the proper position
		this.view.x = this.x;
		this.view.y = this.y;

		// Handle the scaling of the square (also check if it needs to be animated)
		if (this.animationProgress < 1) {
			this.view.scale.x = (this.size / 1000) * this.ease(this.animationProgress);
			this.view.scale.y = (this.size / 1000) * this.ease(this.animationProgress);
			this.animationProgress += .05;
		} else {
			this.view.scale.x = this.size / 1000;
			this.view.scale.y = this.size / 1000;
		}
	}


	/** Cleans up the listeners */
	public destroy() {
		this.tapped$.complete();
		this.view.removeAllListeners();
	}


	/** Creates the square graphics, listens to events from the square, and adds it to the stage */
	private draw() {
		const square = new PIXI.Graphics();
		square
			.beginFill(this.color)
			.drawRoundedRect(0, 0, 1000, 1000, 200)
			.endFill()

		square.pivot.x = 500;
		square.pivot.y = 500;

		this.view.interactive = true;
		this.view.buttonMode = true;
		this.view.on('pointerdown', (event) => {
			this.tapped$.next(true);
		});
		this.view.addChild(square);
	}


	/** Adds easing to animation by alterating a given t (between 0-1) */
	private ease(t: number) {
		const s = 1.70158
		return --t * t * ((s + 1) * t + s) + 1
	}

	/** Adds a bounch easing to animation by alterating a given t (between 0-1) */
	private bounce(t: number) {
		const a = 4.0 / 11.0
		const b = 8.0 / 11.0
		const c = 9.0 / 10.0

		const ca = 4356.0 / 361.0
		const cb = 35442.0 / 1805.0
		const cc = 16061.0 / 1805.0

		const t2 = t * t

		return t < a
			? 7.5625 * t2
			: t < b
				? 9.075 * t2 - 9.9 * t + 3.4
				: t < c
					? ca * t2 - cb * t + cc
					: 10.8 * t * t - 20.52 * t + 10.72
	}

	/** Adds an elastic easing to animation by alterating a given t (between 0-1) */
	private elastic(t: number) {
		return Math.sin(-13.0 * (t + 1.0) * Math.PI / 2) * Math.pow(2.0, -10.0 * t) + 1.0
	}

}
