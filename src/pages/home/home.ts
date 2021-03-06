import { Component, NgZone } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
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
// showPoll:boolean = false;
// zone;
// udata;
// displayName;

  constructor(public navCtrl: NavController,
              public db: AngularFireDatabase,
              public _auth: AuthService,
              // private gp: GooglePlus,
              private platform: Platform,
              private afAuth: AngularFireAuth,
              private _np: NotificationsProvider,
              public localNotifications:LocalNotifications,
              // public _ngZone: NgZone,
              private events: Events
    ) {
      // this._auth.currentUser.subscribe()
      // this.zone = new _ngZone
      // this._ngZone.run(() =>
      afAuth.authState.subscribe((user: firebase.User) => {
        // console.log("afAuth.authState.subscribe UPDATED")
        this.currentUser = user
        this.genData()
      })

      // _auth.user.subscribe(() => {
      //     console.log('USER SUB UPDATED')
      //
      //     // this.genData()
      // })
// )



      // if(showPoll==false){location.reload()}
      // this.showPoll=true
      this.platform.ready()
      .then((ready)=> {
        this.localNotifications.on('click', (notification, state) => {
          // console.log("notification:", notification)
          // console.log("notification.text:", notification.text)
          // console.log("notification.data:", JSON.parse(notification.data))
          const data = JSON.parse(notification.data)
          // console.log("notification.data.pollID:", data.pollID)
          this.navCtrl.push('PollPage', {
            pollID: data.pollID
          });
          // let alert = this.alertCtrl.create({
          //   title: notification.title,
          //   subTitle: notification.text
          // })
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
    // console.log("poll clicked: ", poll)
    this.navCtrl.push('PollPage', {
      pollID: poll.$key
    });
  }
  openInvite(){
    this.navCtrl.push('InvitePage')
  }
  openClientList(){
    this.navCtrl.push('ClientsPage')
  }
  // signInGoogle(){
  //   this._ngZone.run(() =>this._auth.signInWithGoogle())
  // }
  genData(){
    // console.log('this.currentUser',this.currentUser)
    this.polls = this.db.list('/polls', {
      query: {
        orderByChild: 'clientID',
        equalTo: this.currentUser.uid
      }
  })
    this.clients = this.db.list('/clients', {
    query: {
      orderByChild: 'counsellorID',
      equalTo: this.currentUser.uid
    }
  })
  // this.events.publish('updateScreen');
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
//   testClick(){
//     alert('Working!')
//   }
}
