
// 3rd Party
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Custom
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.log(err));
