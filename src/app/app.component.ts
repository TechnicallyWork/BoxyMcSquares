
// 3rd Party
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import * as PIXI from 'pixi.js';

// Custom
import { Game } from './game/game';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

	/** The container for pixi */
	@ViewChild('pixiContainer') pixiContainer: ElementRef;


	constructor(
		private eventManager: EventManager,
	) {
	}

	/** Initializes after the view & adds the game view to the pixi container */
	public ngAfterViewInit() {
		this.eventManager.addGlobalEventListener('window', 'load', (event) => {
			const height = event.currentTarget.innerHeight;
			const width = event.currentTarget.innerWidth;

			const game = new Game(width, height);
			this.pixiContainer.nativeElement.appendChild(game.view);

			this.eventManager.addGlobalEventListener('window', 'resize', (resizeEvent) => {
				game.resize(resizeEvent.currentTarget.innerWidth, resizeEvent.currentTarget.innerHeight);
			})
		})
	}

}
