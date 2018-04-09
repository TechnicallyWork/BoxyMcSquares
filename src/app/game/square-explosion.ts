
// 3rd Party
import * as PIXI from 'pixi.js';


/** Info about each square in the explosion */
interface ExplodedSquare {
	container: PIXI.Container;
	velX: number;
	velY: number;
}


export class SquareExplosion {

	/** The container of the square explosion */
	public view: PIXI.Container;

	/** An array of the particles */
	private squares: ExplodedSquare[] = [];


	constructor(
		private x: number,
		private y: number,
		private size: number,
		private color: number,
	) {

		this.view = new PIXI.Container();

		for (let index = 0; index < 30; index++) {
			// Creates 30 squares with a given size/location & generates a random velocity
			const square = new PIXI.Graphics();
			square
				.beginFill(this.color)
				.drawRoundedRect(0, 0, 1000, 1000, 200)
				.endFill()

			square.scale.x = (size / 1000) * .2;
			square.scale.y = (size / 1000) * .2;
			square.x = this.x - (size * .2) / 2;
			square.y = this.y - (size * .2) / 2;
			this.squares.push({
				velX: (Math.random() > .5 ? 1 : -1) * Math.random() * 300 + 100,
				velY: (Math.random() > .5 ? 1 : -1) * Math.random() * 300 + 100,
				container: square,
			});
			this.view.addChild(square);
		}
	}


	/** Moves the explosion squares and changes their alpha every frame */
	public render(deltaTime: number) {
		this.squares.forEach((square: ExplodedSquare) => {
			square.container.x += square.velX * (deltaTime / 16.666);
			square.container.y += square.velY * (deltaTime / 16.666);
			square.container.alpha -= .9 * (deltaTime / 16.666);
		})
	}

}
