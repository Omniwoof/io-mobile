import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as firebase from 'firebase';


/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class NotificationsProvider {
  schedules;
  currentUserID;
  listSched = [];
  fivesecs;
  notes;
  // parse = require('date-fns/parse');
  constructor(
              // public http: Http,
              public platform: Platform,
              public localNotifications: LocalNotifications,
              public alertCtrl: AlertController,
              public _auth: AuthService,
              public db: AngularFireDatabase
              ) {
    // console.log('Hello NotificationsProvider Provider');
    this.schedules = db.list('/schedules')
    const schedule = db.list('/schedules', {
      query: {
        orderByChild: 'clientID',
        equalTo: this._auth.currentUser
      }
    })
    const currentSched = schedule.subscribe(sched => this.schedFactory(sched))
    // // this.localNotifications.schedule(this.listSched)
    // this.fivesecs = new Date().getTime()+5000
    // alert(this.fivesecs)
    // this.currentUserID = this._auth.currentUser.uid



    this.platform.ready()
    .then((ready)=> {
      // this.localNotifications.on('trigger', (notification, state) => {
      //   let alert = this.alertCtrl.create({
      //     title: notification.title,
      //     subTitle: notification.text
      //   })
      //   alert.present()
      // })
    })
  }
addNotification(title, pollID, at, every, firstat){
  // console.log('Notification test', title)
  this.schedules.push({
    created: firebase.database.ServerValue.TIMESTAMP,
    clientID: this._auth.currentUser.uid,
    pollID: pollID,
    //data for the notification, id generated later
    // id: key,
    title: title,
    text: 'Your question is ready to be answered.',
    at: at,
    every: every,
    firstat: firstat
  })
  // this.localNotifications.schedule({
  //   id: key,
  //   title: title,
  //   text: 'Schedule for this poll has been changed.',
  //   at: new Date(new Date().getTime()+5000 )
  // })
}
schedFactory(sched){
  this.localNotifications.clearAll()
  // console.log("sched triggered")
  sched.forEach((val, i) => {
    // console.log("Val: ", val)
    const atSplit = val.at.split(':')
    const cTime:Date = new Date()
    let newAt:Date = cTime
    if(cTime.getHours() < atSplit[0]
    || cTime.getHours() == atSplit[0]
    && cTime.getMinutes() < atSplit[1])
     {
      newAt.setHours(atSplit[0])
      newAt.setMinutes(atSplit[1])
      newAt.setSeconds(0)
      newAt.setDate(cTime.getDate())
    }else {
      newAt.setHours(atSplit[0])
      newAt.setMinutes(atSplit[1])
      newAt.setSeconds(0)
      newAt.setDate(cTime.getDate()+1)
    }
                        const newNote = {
                          data: { pollID: val.pollID },
                          id: i,
                          title: val.title,
                          text: val.text,
                          at: newAt,
                          firstAt: val.firstAt,
                          every: val.every,
                          color: '456681',
                        }
                        // console.log('New: ', newNote)
                        this.listSched.push(newNote)
                      })
    this.localNotifications.schedule(this.listSched)
}
showNotes(){
  console.log("Show Notes")
  const shNotes = this.localNotifications.getAllIds()
  console.log("shNotes:", shNotes)
  this.localNotifications.getTriggered(function (noti) {
    alert(noti.length);
});
  // Promise.all(shNotes).then(x => console.log(x))
  // shNotes.then(x => console.log("Get All TESTING", x))
}
}
