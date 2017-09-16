import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
/**
 * Generated class for the AddNotificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-notification',
  templateUrl: 'add-notification.html',
})
export class AddNotificationPage {
  pollID: string;
  pollTitle: string;
  notification: FormGroup;
  filteredSched;
  schedules: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _np: NotificationsProvider,
              public fb: FormBuilder,
              public db: AngularFireDatabase
            ) {

              this.pollID = this.navParams.get('pollID')
              this.pollTitle = this.navParams.get('pollTitle')
              this.schedules = db.list('/schedules')
              this.buildPoll()
              this.filteredSched = _np.listSched.filter(obj => {
                console.log('OBJ,',obj, this.pollID)
                return obj.pollID == this.pollID
              })
              console.log("filteredSched:",this.filteredSched)
  }


  buildPoll(){
    console.log('Poll being built')
    this.notification = this.fb.group({
      created: firebase.database.ServerValue.TIMESTAMP,
      pollID: this.pollID,
      //data for the notification, id generated later
      // id: key,
      title: this.pollTitle,
      text: 'Schedule for this poll has been changed.',
      // at: new Date(new Date().getTime()),
      every: '',
      firstAt: '',
      at: ''
    })
  }
  addNotif(notification){
    console.log('notification:',notification)
    this._np.addNotification(notification.title, notification.pollID, notification.at, notification.every, notification.firstAt)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNotificationPage');
  }

}
