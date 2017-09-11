import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Import Services
import { AuthService} from '../providers/auth-service/auth-service'

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyATKEmJiyr6yVcfwjZzFFQ-DSyDAy3wxUg",
  authDomain: "inside-outcomes.firebaseapp.com",
  databaseURL: "https://inside-outcomes.firebaseio.com",
  projectId: "inside-outcomes",
  storageBucket: "inside-outcomes.appspot.com",
  messagingSenderId: "580517917925"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    GooglePlus,
    ScreenOrientation,
    LocalNotifications
  ]
})
export class AppModule {}
