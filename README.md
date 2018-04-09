
# BoxyMcSquares

This project was made as a part of a video series showing how to create a mobile game using Cordova, Angular, and PIXI.js

To view more information about the project, check out the videos on YouTube or go to [Technically Work's Website](https://technicallywork.com)

## Prerequisites

* [NodeJS/NPM](https://nodejs.org/en/) is required
* [Angular CLI](https://cli.angular.io/) must be installed
* To build Android/iOS, [Cordova](https://cordova.apache.org/) must be installed
* Android SDK needs to be installed to build to Android
* iOS SDK needs to be installed to build to iOS
* You must be on a Mac to build to iOS

Download all the files (clone this repo)

Go to the directory of files and install the needed dependencies

```
npm install
```


## Running the app locally on your computer

Run the Angular Devlopment Server that's built in with the Angular CLI

```
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Building the app to Android/iOS

Build Angular using the Angular CLI build command. This needs to be done every time the code is updated.

```
ng build --prod
```

The build artifacts will be stored in the `cordova/www` directory. Use the `-prod` flag for a production build.

Change the directory to the cordova directory

```
cd cordova
```

Add a platform (either android or ios) to cordova. Both platforms can be added if on a mac.
This only needs to be done once. 

```
cordova platform add android
```

Run the cordova build command for either platform - android/ios. This needs to be done every time the code is updated.

```
cordova build android
```

This will create the apk/ipa file that can be installed on a device.

You can also emulate the app locally on your computer

```
cordova run android
```

This will start an emulator on your computer (if you have it setup properly)

