import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Pipe, PipeTransform } from '@angular/core';

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
// @Pipe({ name: 'keys',  pure: false })
// export class KeysPipe implements PipeTransform {
//     transform(value: any, args: any[] = null): any {
//         return Object.keys(value)//.map(key => value[key]);
//     }
// }

export class PollPage {
  pollData;
  data;
  result: FormGroup;
  results: FirebaseListObservable<any[]>;
  items;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    private db: AngularFireDatabase) {
    this.pollData = this.navParams
      .get('poll');
    console.log('pollData type: ', typeof this.pollData)
    this.data = Object.keys(this.pollData).map(key => this.pollData[key])
    // this.data = Object.keys(this.pollData).map(key => Object.assign({ key }, this.pollData[key]));
    console.log('data type: ', typeof this.data)
    console.log('data: ', this.data)
    console.log('data.slider typeof: ', typeof this.data.slider)
    this.results = db.list('/results')

    // this.pollData.keys(a).forEach(key => console.log(a[key]))

    // this.pollData.subscribe(data => console.log(data))
    this.buildPoll()

  //   if(this.pollData.multi.choices){
  //   for (var i=0; i < this.pollData.multi.choices.length; i++){
  //     return this.fb.group({
  //       choice: [this.pollData.multi.choices[i], Validators.required],
  //       chosen: [false, ]
  //     })
  //   }
  // }
}

buildPoll(){
  // alert("Poll being built")
  // console.log('pollData: ', this.pollData)
  this.result = this.fb.group({
    pollID: [this.pollData.$key, ],
    clientID: [this.pollData.clientID, Validators.required],
    clientName: [this.pollData.clientName, Validators.required],
    sliders: this.fb.array([]),
    multi: this.fb.array([])
  })
  if (this.pollData.sliders){
    this.addSliders()
  }
  if (this.pollData.multi.choices){
    this.addMulti()
  }

  console.log('FormBuilder: ', this.result)
  console.log('Result.slider.controls: ', this.result.get('sliders').value.slideName)
}


  ionViewDidLoad() {
    console.log('ionViewDidLoad PollPage');
  }
  addResult(value){
    //submit form and new /results
    console.log(value);
    this.results.push(value._value);
    console.log('Valid Submission! ', value._value)
  }
  createSliders(slideData):
    FormGroup {
      return this.fb.group({
        label1: slideData.label1,
        label2: slideData.label2,
        max: slideData.max,
        slideName: slideData.slideName,
        value: ''
      });
    }
  addSliders(): void {
    console.log('Slider Triggered!')
    console.log('Slider Length: ', this.pollData.sliders.slider.length)
    for (var i=0; i<this.pollData.sliders.slider.length; i++){
    this.items = this.result.get('sliders') as FormArray;
    this.items.push(this.createSliders(this.pollData.sliders.slider[i]));
    console.log('Slider Added!')
  }
  }
  createMulti(multiData): FormGroup {
    return this.fb.group({
      choice: multiData.choice,
      chosen: false
    })
  }
  addMulti(): void {
    console.log('Multi Length: ', this.pollData.multi.choices.length)
    for (var i=0; i<this.pollData.multi.choices.length; i++){
      this.items = this.result.get('multi') as FormArray;
      this.items.push(this.createMulti(this.pollData.multi.choices[i]));
      console.log('Multi Created!')
    }
  }


}

//   this.result = this.fb.group({
//   pollID: [this.pollData.$key, ],
//   title: [this.pollData.title, [Validators.required, Validators.minLength(2)]],
//   clientID: [this.pollData.clientID, Validators.required],
//   clientName: [this.pollData.clientName, ],
//   button: [this.pollData.button, Validators.required],
//   created: [this.pollData, ],
//   sliders: this.fb.group({
//     slider: this.fb.array([
//       if(this.pollData.sliders){
//       for (var i=0; i < this.pollData.sliders.slider.length; i++){
//         return this.fb.group({
//           slideName: [this.pollData.sliders.slider[i].slideName, ],
//           max: [this.pollData.sliders.slider[i].max, ],
//           label1: [this.pollData.sliders.slider[i].label1, ],
//           label2: [this.pollData.sliders.slider[i].label2, ],
//           sliderVal: ['', ]
//         })
//       }
//       }
//     ])
//   }),
//   multi: this.fb.group({
//     question: [this.pollData.multi.question, ],
//     choices: this.fb.array([
//       // Don't init on ngOnInit, instead should init on +showChoice() button
//       // this.initChoice()
//     ])
//   })
//   });
//
// }
