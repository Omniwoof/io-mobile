import { Observable } from 'rxjs/Observable';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';
// import { Events } from 'ionic-angular';

import { Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
// import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class AuthService {
  public currentUser: firebase.User;
  user: Observable<firebase.User>
  // clients: FirebaseListObservable<any>;
  // polls: FirebaseListObservable<any>;

  constructor(public afAuth: AngularFireAuth,
    private gp: GooglePlus,
    private platform: Platform
    // public events: Events
    // public _ngZone: NgZone,
    // public db: AngularFireDatabase
  ) {
    this.user = afAuth.authState
    afAuth.authState.subscribe((user: firebase.User) => {
                      this.currentUser = user

                      // this.genData()
                      });
    // this._ngZone.run(() => {console.log('Inside Started!')
    //                         this.signInWithGoogle()});
  }

  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  signInWithGoogle() {
    // console.log('TESTING SIGNIN FIRST')
    // this._ngZone.run(() => {
    if (this.platform.is('cordova')) {
      // console.log('TESTING SIGNIN CORDOVA')
      this.gp.login({
        'webClientId': '580517917925-8hi8rrv1upgb04acg2c342ad0q3mpvgh.apps.googleusercontent.com',
        'offline': true
      })
      .then( res => {
        // console.log('TESTING SIGNIN THEN')
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        return firebase.auth().signInWithCredential(googleCredential);
      } )
      //TODO: (1) Fix this awful hack. See (2) for more details.
      .then(()=>location.reload())
      .catch(err => console.error(err));
    }
    else {
      // console.log('TESTING SIGNIN ELSE')
      return this.afAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(res=> {
        console.log("Res: ",res)
        // this.events.publish('updateScreen');
        //TODO: (2) Fix this *awful* hack. It's here because firebase observables aren't returning
        //values to *ngFor lists. This just refreshes the page after a successful login.
        location.reload()
    });
    }

  // this._auth.signInWithGoogle()
  //   .then(() => this.onSignInSuccess());
// })
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
// genData(){
//   console.log('this.currentUser',this.currentUser)
//   this.polls = this.db.list('/polls', {
//     query: {
//       orderByChild: 'clientID',
//       equalTo: this.currentUser.uid
//     }
// })
//   this.clients = this.db.list('/clients', {
//   query: {
//     orderByChild: 'counsellorID',
//     equalTo: this.currentUser.uid
//   }
// })
// // this.events.publish('updateScreen');
// }


}
