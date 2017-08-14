import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';

@Injectable()
export class AuthService {
  public currentUser: firebase.User;

  constructor(public afAuth: AngularFireAuth,
    private gp: GooglePlus,
    private platform: Platform
  ) {
    afAuth.authState.subscribe((user: firebase.User) => this.currentUser = user);
  }

  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  signInWithGoogle() {
    if (this.platform.is('cordova')) {
      this.gp.login({
        'webClientId': '580517917925-8hi8rrv1upgb04acg2c342ad0q3mpvgh.apps.googleusercontent.com',
        'offline': true
      })
      .then( res => {
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        return firebase.auth().signInWithCredential(googleCredential);
      } )
      .catch(err => console.error(err));
    }
    else {
      return this.afAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(res=> console.log(res));
    }

  // this._auth.signInWithGoogle()
  //   .then(() => this.onSignInSuccess());
}

  signOut(): void {
    this.afAuth.auth.signOut();
  }

  get displayName(): string {
    if (this.currentUser !== null) {
      return this.currentUser.displayName;
    } else {
      return '';
    }
  }
  get displayID(): any {
    if (this.currentUser !== null) {
      return this.currentUser.uid;
    } else {
      return '';
    }
  }
  get currentUserId(): any {
  return this.authenticated ? this.currentUser.uid : '';
}
}
