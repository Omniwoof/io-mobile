import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable  } from 'angularfire2/database';
import * as firebase from 'firebase';


/**
 * Generated class for the PollPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-poll',
  templateUrl: 'poll.html',
})


export class PollPage {
  pollData: FirebaseObjectObservable<any>;
  pollID;
  poll;
  data;
  result: FormGroup;
  results: FirebaseListObservable<any[]>;
  items;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    private db: AngularFireDatabase,
    public toastCtrl: ToastController) {
    this.pollID = this.navParams
      .get('pollID');
      console.log("PollID: ", this.pollID)
    this.pollData = db.object('/polls/'+ this.pollID)
    this.pollData.subscribe(poll => {this.poll = poll;
      console.log("poll: ", poll);
      this.buildPoll();
      if (poll.options){this.buildOptions()}
      })
    console.log("PollData: ", this.pollData)
    this.results = db.list('/results')
    // this.buildPoll()

}

buildPoll(){
  this.result = this.fb.group({
    pollID: [this.poll.$key, ],
    title: this.poll.title,
    button: this.poll.button,
    clientID: [this.poll.clientID, Validators.required],
    clientName: [this.poll.clientNickName, Validators.required],
    created: firebase.database.ServerValue.TIMESTAMP,
    options: this.fb.array([])
  })

  console.log('FormBuilder: ', this.result)
}
buildOptions(){
  this.poll.options.forEach((option, index) => {
    switch(option.controlType){
      case "slider":  {
        // this.addSliders()
        this.items = this.result.get('options') as FormArray;
        this.items.push(this.createSliders(option));
        break;
      }
      case "multi": {
        this.items = this.result.get('options') as FormArray;
        this.items.push(this.createMulti(option));
        option.choices.forEach((choice, i) => {
          const item = this.items.at(index).get('choices') as FormArray;
          item.push(this.createChoice(option.choices[i]));
        })
        break;
      }
    }
  })
  console.log("Options Added: ", this.result)
  console.log("result.get('options'): ", this.result.get('options'))
}


  ionViewDidLoad() {
    console.log('ionViewDidLoad PollPage');
  }
  addResult(value){
    console.log(value);
    this.results.push(value._value)
      .then(success => this.saveSuccess())
    console.log('Valid Submission! ', value._value)
  }
  createSliders(slideData):
    FormGroup {
      return this.fb.group({
        controlType: slideData.controlType,
        label1: slideData.label1,
        label2: slideData.label2,
        max: slideData.max,
        slideName: slideData.slideName,
        value: ''
      });
    }
  addSliders(): void {
    console.log('Slider Triggered!')
    // console.log('Slider Length: ', this.pollData.sliders.slider.length)
    // for (var i=0; i<this.pollData.sliders.slider.length; i++){
    this.items = this.result.get('options') as FormArray;
    // this.items.push(this.createSliders(this.pollData.sliders.slider[i]));
    console.log('Slider Added!')
  // }
  }
  createMulti(multiData): FormGroup {
    return this.fb.group({
      controlType: multiData.controlType,
      choices: this.fb.array([])
    })
  }
  createChoice(choice): FormGroup {
    return this.fb.group({
      choice: choice.choice,
      chosen: false
    })
  }
  addMulti(): void {
    // console.log('Multi Length: ', this.pollData.multi.choices.length)
    // for (var i=0; i<this.pollData.multi.choices.length; i++){
    //   this.items = this.result.get('multi') as FormArray;
    //   this.items.push(this.createMulti(this.pollData.multi.choices[i]));
    //   console.log('Multi Created!')
    // }
  }

  saveSuccess() {
  let toast = this.toastCtrl.create({
    message: 'Data saved',
    duration: 1000
  });
  // TODO: Promise isn't working, not thenable apparently
  toast.present()
    .then(toast => this.navCtrl.pop());
}
}
