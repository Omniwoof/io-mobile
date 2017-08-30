import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as firebase from 'firebase/app';

/**
 * Generated class for the ClientPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client',
  templateUrl: 'client.html',
})
export class ClientPage {
  clientNickName;
  clientID;
  polls: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public db: AngularFireDatabase) {
    this.clientID = this.navParams
      .get('clientID');
    this.clientNickName = this.navParams
    .get('clientNickName')
    this.polls = db.list('/polls', {
      query: {
        orderByChild: 'clientID',
        equalTo: this.clientID
      }
    })
    console.log(this.polls)
  }

  openPoll(poll, pollID){
    this.navCtrl.push('ChartPage', {
      poll: poll,
      pollID: pollID
    });
  }
  newPoll(){
    this.navCtrl.push('NewPollPage',{
      clientID: this.clientID,
      clientNickName: this.clientNickName
    })
  }
  removeItem(poll){
    console.log('deleting: ', poll);
    this.polls.remove(poll);
  }
  //TODO: Finish this.
  editItem(poll) {
    console.log('Editing ', poll)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientPage');
  }

}
