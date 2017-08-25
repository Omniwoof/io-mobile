import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

/**
 * Generated class for the ClientsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-clients',
  templateUrl: 'clients.html',
})
export class ClientsPage {
  clients: FirebaseListObservable<any>;
  public currentUser: firebase.User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public db: AngularFireDatabase,
              public _auth: AuthService,
              private afAuth: AngularFireAuth,) {
    afAuth.authState.subscribe((user: firebase.User) => {
      this.currentUser = user
      this.clients = db.list('/clients', {
        query: {
          orderByChild: 'counsellorID',
          equalTo: user.uid
        }
      })
    })
  }

  openClient(client){
    this.navCtrl.push('ClientPage', {
      clientID: client.clientID,
      clientNickName: client.clientNickName
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientsPage');
  }

}
