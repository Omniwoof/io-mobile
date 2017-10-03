import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
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
  currentPollData;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    private db: AngularFireDatabase,
    public toastCtrl: ToastController,
    public screenOrientation: ScreenOrientation,
    public platform: Platform) {
      if (this.platform.is('mobile'||'tablet')){
    this.screenOrientation.unlock();
  }
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
    this.currentPollData = db.list('/results', {
      query: {
        orderByChild: 'pollID',
        equalTo: this.pollID
      }
    })
    // this.buildPoll()

}

buildPoll(){
  this.result = this.fb.group({
    pollID: [this.poll.$key, ],
    title: [this.poll.title, Validators.required],
    button: [this.poll.button , Validators.required],
    clientID: [this.poll.clientID, Validators.required],
    clientNickName: [this.poll.clientNickName, Validators.required],
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
      title: multiData.title,
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
openPoll(poll, pollID, pollCreated){
  this.navCtrl.push('ChartPage', {
    poll: poll,
    pollID: pollID,
    pollCreated: pollCreated
  });
}

addData(result){
  const datapoints = 100
  let resultArray = []
  // let resultArray = []
  let testArray = []
  // console.log('result',result)
  // let newResult = result.value
  // console.log('newResult',newResult)

  for (let i = 0; i < datapoints; i++ ){

    const now = new Date().getTime()
    let newNow = now - Math.trunc(Math.random()*9000000000)
    let newResult = {
      created: newNow,
      button: result.value.button,
      clientID: result.value.clientID,
      pollID: result.value.pollID,
      title: result.value.title,
      options: []
      // [{
      //   controlType: result.value.options[0].controlType,
      //   label1: result.value.options[0].label1,
      //   label2: result.value.options[0].label2,
      //   max: result.value.options[0].max,
      //   slideName: result.value.options[0].slideName,
      //   value: Math.trunc(Math.random()*10)
      // }]
      }
    if (this.poll.options){
      this.poll.options.forEach((x, index) => {
        // console.log('option', x)
        if (x.controlType == 'slider'){
          newResult.options.push({
            controlType: x.controlType,
            label1: x.label1,
            label2: x.label2,
            max: x.max,
            slideName: x.slideName,
            value: Math.trunc(Math.random()*10)
          })
        }
        if(x.controlType == 'multi'){
          // let choiceLength = x.choices.length
          // console.log('choiceLength',choiceLength)
          let choiceArray = []
          x.choices.forEach((y,i) => {
            // console.log('Choices', y)
            let random = false
            if(Math.trunc(Math.random()*10)>5){random = true}
            let choice = y.choice
            let chosen = random
            choiceArray.push({choice: choice, chosen: chosen})
            // console.log('choiceArray', choiceArray)
          })
          newResult.options.push({
            controlType: x.controlType,
            choices: choiceArray
          })
        }
      })
    }
    // console.log("newResult prepush",newResult)
    resultArray.push(newResult)
  }
  // console.log('resultArray: ', resultArray)
  const newResArray = resultArray.sort((a,b )=>{
    let dateA = a.created
    let dateB = b.created
    if (dateA < dateB){
      return -1
    }
    if (dateA > dateB){
      return 1
    }
    return 0
  })
  // console.log('newResArray',newResArray)
  newResArray.forEach(x => {
    // console.log('newResArray',x)
    setTimeout(()=>{this.results.push(x)}, 10);

  })
  console.log('Data Generated')
}

clearData(){
  this.currentPollData.forEach(x => {
    // console.log("X",x)
    x.forEach(y => {
      this.results.remove(y.$key)
    })

  })
  console.log('Data Cleared')

}


}
