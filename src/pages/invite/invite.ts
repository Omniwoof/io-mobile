import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

/**
 * Generated class for the InvitePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invite',
  templateUrl: 'invite.html',
})
export class InvitePage {
  invite: FormGroup
  clients: FirebaseListObservable<any[]>;
  auth;
  user;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fb: FormBuilder,
              public afAuth: AngularFireAuth,
              public db: AngularFireDatabase) {
    this.auth = afAuth.auth;
    this.user = this.auth.currentUser
    this.clients = db.list('/clients')
    this.invite = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      clientNickName:['', [Validators.required]],
      clientRef: ['']
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvitePage');
  }
  onSubmit(submission) {
    if (submission.status == 'VALID'){
      console.log('Valid Submission! ', submission.value.email)
      this.clients.push({
        clientEmail: submission.value.email,
        clientNickName: submission.value.clientNickName,
        clientRef: submission.value.clientRef,
        counsellor: this.user.displayName,
        counsellorID: this.user.uid
      })
      //OK! Now push email, username, counsellor uid and userame to /clients
    }else{
      console.log('Invalid Submission!')
    }
  }

  clearInvite(){
    this.invite.reset();
  }
}
