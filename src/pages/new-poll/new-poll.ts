import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
import { NgSwitch } from '@angular/common';
import 'rxjs/add/operator/debounceTime';

/**
 * Generated class for the NewPollPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-poll',
  templateUrl: 'new-poll.html',
})
export class NewPollPage {
  clientID;
  clientNickName;
  options;
  poll: FormGroup;
  polls: FirebaseListObservable<any>;
  pollID;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fb: FormBuilder,
              private db: AngularFireDatabase,
              public toastCtrl: ToastController) {
    this.clientID = this.navParams
      .get('clientID');
    this.clientNickName = this.navParams
    .get('clientNickName')
    this.polls = db.list("/polls")
    this.buildPoll()
    this.poll.valueChanges.debounceTime(3000).subscribe(data => {
      console.log('Form changes', data)
      //TODO: Add validation
      this.polls.update(this.pollID, data)
      this.saveSuccess()
    })
  }

  buildPoll(){
    this.poll = this.fb.group({
      title: ["Untitled", Validators.required],
      button: ["Submit", Validators.required],
      clientID: [this.clientID, Validators.required],
      // TODO: Change to clientNickName
      clientNickName: [this.clientNickName, Validators.required],
      pollCreated: firebase.database.ServerValue.TIMESTAMP,
      options: this.fb.array([])
    })
    console.log("poll: ",this.poll)
    this.polls.push(this.poll.value._value)
      .then(poll => {this.pollID = poll.key
                    this.saveSuccess()})
  }

  createSlider():
    FormGroup {
      return this.fb.group({
        controlType: "slider",
        label1: ["", Validators.required],
        label2: ["", Validators.required],
        max: ["5", Validators.required],
        slideName: ["", Validators.required],
        value: ""
      });
    }
  addSlider(): void {
    console.log('Slider Triggered!')
    this.options = this.poll.get('options') as FormArray
    this.options.push(this.createSlider())
    // this.items = this.result.get('sliders') as FormArray;
    // this.items.push(this.createSliders(this.pollData.sliders.slider[i]));
    console.log('Slider Added!')
    this.logIt()

  }
  createMulti(): FormGroup {
    return this.fb.group({
      controlType: "multi",
      title: ["", Validators.required],
      choices: this.fb.array([this.createChoice()])
    })
  }
  createChoice(): FormGroup {
    return this.fb.group({
      choice: ["", Validators.required],
      chosen: false
    })
  }
  addMulti(): void {
      this.options = this.poll.get('options') as FormArray;
      console.log('Options! ', this.options)
      this.options.push(this.createMulti());
      console.log('Multi Created!')
      this.logIt()
      // this.options = this.poll.get('options')[0].get('choices') as FormArray;
      // this.options.push(this.createChoice())
  }
  addChoice(i){
    console.log('i = ', i)
    this.options = this.poll.get('options') as FormArray;
    const choices = this.options.at(i).get('choices') as FormArray;
    console.log('Options! ', this.options)
    console.log('Choices!', choices)
    choices.push(this.createChoice())
  }
  logIt(){
    console.log("poll: ",this.poll)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NewPollPage');
  }
  // updateResult(value){
  //   //submit form and new /results
  //   console.log(value);
  //   this.polls.update(this.pollID, value._value)
  //     .then(success => this.saveSuccess())
  //   console.log('Valid Submission! ', value._value)
  // }
  saveSuccess() {
  let toast = this.toastCtrl.create({
    message: 'Data saved',
    duration: 1000
    // autoFocus: true
  });
  // TODO: Promise isn't working, not thenable apparently
  toast.present()
  //manual work around to stop input losing focus when presenting toast
    // .then(toast => this.input.setFocus());
}
  deletePoll() {
    let toast = this.toastCtrl.create({
      message: 'Deleted',
      duration: 1000
    });
    this.polls.remove(this.pollID).then(deleted => {
      toast.present()
        .then(toast => this.navCtrl.pop());
    })
  }
}
