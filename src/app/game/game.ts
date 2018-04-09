
// 3rd Party
import * as PIXI from 'pixi.js';

// Custom
import { Level } from './level';


export class Game {

	/** The PIXI canvas */
	public view: HTMLCanvasElement;

	/** The PIXI application */
	private pixiApp: PIXI.Application;

	/** Info about the current level */
	private currentLevel: Level;

	/** The width of the game canvas */
	private windowWidth: number;

	/** The height of the game canvas */
	private windowHeight: number;

	/** The result of the previous game. Used to show the correct text after each game. */
	private lastGamePlayed: string;


	constructor(
		private width: number,
		private height: number,
	) {
		this.pixiApp = new PIXI.Application(width, height);
		this.pixiApp.renderer.autoResize = false;
		this.pixiApp.renderer.backgroundColor = 0xFFFFFF;
		this.view = this.pixiApp.renderer.view;
		this.windowHeight = height;
		this.windowWidth = width;
		this.pixiApp.ticker.add((deltaTime: number) => {
			this.render(deltaTime);
		})
		this.newLevel(1);
	}

	/** Resize the PIXI renderer */
	public resize(width: number, height: number) {
		this.windowHeight = height;
		this.windowWidth = width;
		this.pixiApp.renderer.resize(width, height);
	}

	/** Renders the current level */
	public render(deltaTime: number) {
		this.currentLevel.render(deltaTime, this.windowWidth, this.windowHeight)
	}

	/** Removes the previous level and creates a new one in its place */
	public newLevel(levelNumber: number) {
		if (this.currentLevel) {
			this.pixiApp.stage.removeChild(this.currentLevel.view);
			this.pixiApp.stage.removeAllListeners();
			this.pixiApp.stage.removeChildren();
			this.currentLevel.destroy();
		}
		this.currentLevel = new Level(levelNumber);
		this.pixiApp.stage.addChild(this.currentLevel.view);
		this.currentLevel.events$
			.subscribe((event: string) => {
				if (event === 'lost') {
					this.lastGamePlayed = 'lost';
					this.newLevel(levelNumber);
				} else if (event === 'won') {
					this.lastGamePlayed = 'won';
					this.newLevel(levelNumber + 1);
				}
			})


		// Creates a blur effect to blur the squares when the menus are showing
		const blur = new PIXI.filters.BlurFilter();
		blur.blur = 15;
		this.currentLevel.view.filters = [blur];


		// Adds simple text to the app
		let wording;
		if (!this.lastGamePlayed) {
			wording = 'Start Game';
		} else if (this.lastGamePlayed === 'won') {
			wording = 'Play Level ' + levelNumber;
		} else if (this.lastGamePlayed === 'lost') {
			wording = 'Try Again';
		}
		const text = new PIXI.Text(wording, {
			fontFamily: 'Arial',
			fontSize: 36,
			fontWeight: 'bold',
			fill: 'white',
			align: 'center',
			dropShadow: true,
			dropShadowDistance: 1,
			dropShadowBlur: 1,
		})
		text.anchor.x = .5;
		text.anchor.y = .5;
		text.x = this.windowWidth / 2;
		text.y = this.windowHeight / 2;
		text.interactive = true;
		text.buttonMode = true;



		// Adds a simple white background with transparency over the squares
		const background = new PIXI.Graphics();
		background
			.beginFill(0xFFFFFF)
			.drawRect(0, 0, this.windowWidth, this.windowHeight)
			.endFill()
		background.alpha = .2;
		background.interactive = true;
		background.buttonMode = true;


		// Handles the interaction logic for the text & background
		text.on('pointerdown', (event) => {
			this.pixiApp.stage.removeChild(text);
			this.pixiApp.stage.removeChild(background);
			blur.blur = 0;
			this.currentLevel.startLevel();
		})
		background.on('pointerdown', (event) => {
			this.pixiApp.stage.removeChild(text);
			this.pixiApp.stage.removeChild(background);
			blur.blur = 0;
			this.currentLevel.startLevel();
		})

		// Adds the background and text to the screen
		this.pixiApp.stage.addChild(background);
		this.pixiApp.stage.addChild(text);
	}


}
