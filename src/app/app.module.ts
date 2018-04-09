
// 3rd Party
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Custom
import { AppComponent } from './app.component';



@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
