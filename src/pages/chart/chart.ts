import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ChartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})
export class ChartPage {
  pollData: FirebaseListObservable<any>;
  pollID;
  chartData: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public db: AngularFireDatabase) {
    this.pollData = this.navParams
      .get('poll');
    console.log('PollData: ',this.pollData)
    this.pollID = this.navParams
      .get('pollID');
    console.log('PollID: ', this.pollID)
    this.chartData = db.list('/results', {
      query: {
        orderByChild: 'pollID',
        equalTo: this.pollID
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChartPage');
  }

}
