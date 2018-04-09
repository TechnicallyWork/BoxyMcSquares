
// 3rd Party
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs';
import * as hsl2rgb from 'pure-color/convert/hsl2rgb';

// Custom
import { Square } from './square';
import { SquareExplosion } from './square-explosion';
import { ShotClock } from './shot-clock';


export class Level {

	/** The container of the level */
	public view: PIXI.Container = new PIXI.Container();

	/** An observable that emits the events that happen in the level */
	public events$: Subject<any> = new Subject<any>();

	/** The current squares in play */
	private squares: Square[] = [];

	/** The current explosions in play */
	private explosions: SquareExplosion[] = [];

	/** The shot clock bar graphics at the top of the app */
	private shotClock: ShotClock;


	constructor(
		private levelNumber: number,
	) {
		this.addSquares(20);

		// Create a new shot clock. This could be 
		this.shotClock = new ShotClock(3000);
		this.view.addChild(this.shotClock.view);
		this.shotClock.events$
			.subscribe(() => {
				this.addSquares(1);
				this.shotClock.resetShotClock();
				this.checkGameOver();
			})
	}


	/** Starts the game level. This is where the scoring logic would eventually go */
	public startLevel() {
		this.shotClock.resetShotClock();
	}


	/** Renders the squares and explosions (and other future components) */
	public render(deltaTime: number, width: number, height: number) {
		this.squares.forEach((square: Square) => {
			square.render(deltaTime, width, height);
		})
		this.explosions.forEach((explosion: SquareExplosion) => {
			explosion.render(deltaTime);
		})
		this.shotClock.render(deltaTime, width, height);
	}


	/** Cleans up the level graphics/event listeners */
	public destroy() {
		this.events$.complete();
		this.squares.forEach((square: Square) => {
			square.destroy();
		});
		this.squares = [];
	}

	/** Add squares to the stage and subscribes to the square events */
	private addSquares(amount: number) {
		for (let index = 0; index < amount; index++) {

			// Generate the different square attributes like size, velocity, color...
			const size = (5 / this.levelNumber) * .1;
			const velocity = (this.levelNumber * 2) + 100;
			const hue = Math.random() * 360;
			const saturation = 75;
			const lightness = 65;

			// Conver the color to the proper format
			const color: number[] =
				hsl2rgb([hue, saturation, lightness])
					.map((value: number) => value / 255)
			const colorHex = PIXI.utils.rgb2hex(color);

			// Create the square and add it to the view
			const square = new Square(size, velocity, colorHex);
			this.view.addChild(square.view);
			this.squares.push(square);

			// Subscribe the the square events - to handle when a square is tapped
			const squareIndex = this.squares.length - 1;
			square.tapped$
				.subscribe((tapped: boolean) => {
					this.shotClock.resetShotClock();

					if (squareIndex === this.squares.length - 1) {
						// The user tapped the correct square, so remove it from the screen
						this.view.removeChild(square.view);
						square.destroy();
						this.squares.pop();
						const explosion = new SquareExplosion(square.x, square.y, square.size, square.color);
						this.explosions.push(explosion);
						this.view.addChild(explosion.view);
					} else {
						// The user tapped the wrong square, so add more squares
						this.addSquares(2);
					}
					this.checkGameOver();
				})
		}
	}

	/** Checks the game over status */
	private checkGameOver() {
		if (this.squares.length >= 30) {
			this.events$.next('lost');
		} else if (this.squares.length === 0) {
			this.events$.next('won');
		}
	}

}
