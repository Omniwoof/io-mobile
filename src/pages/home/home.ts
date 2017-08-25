import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as firebase from 'firebase/app';
// import { Platform } from 'ionic-angular';
// import { GooglePlus } from '@ionic-native/google-plus';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
clients: FirebaseListObservable<any>;
polls: FirebaseListObservable<any>;
// userProfile:any = null;
public currentUser: firebase.User;
// udata;
// displayName;

  constructor(public navCtrl: NavController,
              public db: AngularFireDatabase,
              public _auth: AuthService,
              // private gp: GooglePlus,
              // private platform: Platform,
              private afAuth: AngularFireAuth,
    ) {
      // this._auth.currentUser.subscribe()

      afAuth.authState.subscribe((user: firebase.User) => {
        this.currentUser = user
        this.polls = this.db.list('/polls', {
          query: {
            orderByChild: 'clientID',
            equalTo: user.uid
          }
      })
      this.clients = db.list('/clients', {
        query: {
          orderByChild: 'counsellorID',
          equalTo: user.uid
        }
      })
      })
      // afAuth.authState.subscribe((user: firebase.User) => {
      //   if (!user) {
      //     this.userProfile = null;
      //     return;
      //   }
      //   this.userProfile = user;
      // })
  }
  openPoll(poll){
    this.navCtrl.push('PollPage', {
      poll: poll
    });
  }
  openClientList(){
    this.navCtrl.push('ClientsPage')
  }
//   loginUser(): void {
//   this.gp.login().then( res => {
//     firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
//       .then( success => {
//         console.log("Firebase success: " + JSON.stringify(success));
//       })
//       .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
//     }).catch(err => console.error("Error: ", err));
// }

//   signInWithGoogle() {
//     if (this.platform.is('cordova')) {
//       return this.gp.login()
//       .then( res => {
//         const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
//         return firebase.auth().signInWithCredential(googleCredential);
//       } )
//       .catch(err => console.error(err));
//     }
//     else {
//       return this.afAuth.auth
//       .signInWithPopup(new firebase.auth.GoogleAuthProvider())
//       .then(res=> console.log(res));
//     }
//
//   // this._auth.signInWithGoogle()
//   //   .then(() => this.onSignInSuccess());
// }
//
// private onSignInSuccess(): void {
//   console.log("Google display name ",this._auth.displayName());
//   console.log("Google ID ", this._auth.currentUser);
// }
  testClick(){
    alert('Working!')
  }

}
