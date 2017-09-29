import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Content } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import 'rxjs/add/operator/map'
import Plotly from 'plotly.js'
// import date-fns from 'date-fns.js'
// declare var Plotly: any;
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
  pollCreated;
  ori;
  chartData: FirebaseListObservable<any>;
  optionsData = [];
  chart;
  encodedUri;
  data = [];
  xData = [];
  yData = [];
  format = require('date-fns/format')
  isSameDay = require('date-fns/is_same_day');
  diffInCalendarDays = require('date-fns/difference_in_calendar_days')
  eachDay = require('date-fns/each_day')

  @ViewChild('chart') el: ElementRef;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public db: AngularFireDatabase,
              public screenOrientation: ScreenOrientation,
              public platform: Platform) {
    this.pollData = this.navParams
      .get('poll');
    // console.log('PollData: ',this.pollData)
    this.pollID = this.navParams
      .get('pollID');
    // console.log('PollID: ', this.pollID)
    this.pollCreated = this.navParams
      .get('pollCreated')
    this.chartData = db.list('/results', {
      query: {
        orderByChild: 'pollID',
        equalTo: this.pollID
      }
    })
    // console.log('ChartData: ', this.chartData)
    this.chartData.subscribe(chart => {
      this.chart = chart
      this.getChartData(chart)
    })
  }
ngOnInit() {
  this.screenOrientation.onChange().subscribe(
     () => {

        const element = this.el.nativeElement
        const style = {
          // title: this.chart[0].title,
          // height: this.platform.width(),
          // width: this.platform.height(),
        }
        // Plotly.purge(element)
        // this.lineChart()
        Plotly.Plots.resize(document.getElementById("chart"));
     }
  );

}

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ChartPage');
  }

  lineChart() {
    const selectorOptions = {
    buttons: [{
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1m'
    }, {
        step: 'month',
        stepmode: 'backward',
        count: 6,
        label: '6m'
    }, {
        step: 'year',
        stepmode: 'todate',
        count: 1,
        label: 'YTD'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1y'
    }, {
        step: 'all',
    }],
};

    const element = this.el.nativeElement
    let data = this.data
    const layout = {
      // title: this.chart[0].title,
      autosize: true
    }

    if (this.platform.is('core')){
      let style = {
        // title: this.chart[0].title,
        xaxis: {
            rangeselector: selectorOptions,
            rangeslider: {}
        },
        yaxis: {
            fixedrange: true
        }
        // margin: { t: 0 },
        // width: this.platform.width(),
        // height: this.platform.height(),
        // margin: { t: 150, b:120 }
        // hovermode: 'closest'
      }
      //TODO: Eww..
      Plotly.plot( element, data, layout, {showLink: false})
    }else{
      let style = {
        // title: this.chart[0].title,
        xaxis: {
            rangeselector: selectorOptions,
            // rangeslider: {}
        },
        yaxis: {
            fixedrange: true
        }
      }
      // Plotly.plot( element, data, style, {showLink: false})
      Plotly.plot( element, data, layout, {showLink: false})
    }
    //TODO: The plot data or layout can be retrieved from the <div> element in which the plot was drawn
    // Try placing title reference in the div and then getting the chart to pull the width/height from the div
    //Showlink property hides Plot.ly cloud functions.

  }

  compositeChart(data) {
    const element = this.el.nativeElement
    const style = {
      margin: { t: 0 }
    }
    Plotly.plot( element, data, style )
  }

  getChartStructure(chartData){
    // console.log('chartData subscribe: ', chartData)
    const struct = ['frequency']
    if (chartData.length>0 && chartData[0].options){
      chartData[0].options.forEach(opt => struct.push(opt.controlType))
    }
    // console.log('chartStructure: ', struct)
    return struct
  }

  getChartData(chartData){
    // console.log('chartData')
    let struct = this.getChartStructure(chartData)

    struct.forEach((type, i) => {
      switch (type) {
        case 'frequency':
        this.getFrequency()
          break
        case 'slider':
        //i-1 is because the case frequency always get's done first
        //but doesn't exist in chart.options
          this.getSlider(i-1)
          break
        case 'multi':
          this.getMulti(i-1)
          break
      }
    })
    if (this.chart.length>0){this.lineChart()}
    return struct
  }

  getFrequency(){
    // console.log('getFrequency')
    const yData = this.chart.map(y => 1)
    const pollType = 'frequency'
    const title = 'Frequency'
    this.xData = this.chart.map(x => new Date(x.created))
    // console.log('yData: ', yData )
    // console.log('xData: ',this.xData )
    this.aggregateSum(yData, pollType, title)
  }
  getSlider(i){
    // console.log('getSlider')
    const yData = this.chart.map(y => y.options[i].value)
    const pollType = 'slider'
    const title = this.chart[0].options[i].slideName
    // console.log('Slide title: ',title)
    this.xData = this.chart.map(x => new Date(x.created))
    // console.log('yData: ', yData )
    // console.log('xData: ',this.xData )
    this.aggregateSum(yData, pollType, title)
  }
  getMulti(i){
    // console.log('getMulti')
    const yData = this.chart.map(y => y.options[i].choices.map(c=>c))
    const pollType = 'multi'
    //TODO: include choiceTitles in prefix for titles in case of multiple multi-choices
    const choiceTitles = yData[0].map(x => x.choice)
    const choiceVals = yData.reduce((titles,array) => {
      // console.log("choiceValsarray ", array[0].choice)
      array.forEach((x,i)=>{
        // console.log(x.choice)
        titles[array[i].choice] = titles[array[i].choice] || []
        titles[array[i].choice].push(~~array[i].chosen)
      })
      return titles
    }, {})
    // console.log('yDataMulti: ', yData)
    // console.log('choiceTitles: ', choiceTitles)
    // console.log('choiceVals: ', choiceVals, choiceVals.length)
    // console.log('choiceVals.length: ',choiceVals.length)
    for (i=0; i<choiceVals.length; i++){
      // console.log('test yData')
    }
    for (let prop in choiceVals) {
      // console.log(`titles.${prop} = ${choiceVals[prop]}`);
      let yData = choiceVals[prop]
      let title = prop;
      this.aggregateSum(yData, pollType, title)
    }
  }

  aggregateSum(yData, pollType, title){
    // let pollType = pollType
    // console.log('TYPE TEST: ', pollType)
    //These arrays are where the final chart data is generated from the functions below
    let aggX: Array<string> = []
    let aggY: Array<number> = []
    let aggRemovedX: Array<string> = []
    let accY: Array<number> = []

    // checks if there are days inbetween data points and fills them with 0 for y
    this.xData.forEach((data, i) => {
        if (this.isSameDay(this.xData[i-1], data)){
          switch (pollType) {
            case 'frequency':
              aggY[aggY.length-1] = aggY[aggY.length-1]+yData[i]
              break
            case 'slider':
              // accY.push(aggY[aggY.length-1])
              // console.log(yData[i])
              if (!accY[0]){accY.push(yData[i-1])}
              accY.push(yData[i])
              // accY.push(1)
              // accY.push(2)
              // console.log('Accy: ', accY, accY.length, aggY[aggY.length-1])
              // console.log('accY.reduce: ', accY.reduce((a,b) => a+b), accY.length, accY.reduce((a,b) => a+b)/accY.length)
              aggY[aggY.length-1] = accY.reduce((a,b) => a+b) / accY.length
              // aggRemovedX[aggRemovedX.length-1] = aggRemovedX[aggRemovedX.length-1] + ", " + yData[i]
              break
            case 'multi':
              aggY[aggY.length-1] = aggY[aggY.length-1]+yData[i]
              break
          }
          // aggY[aggY.length-1] = aggY[aggY.length-1]+yData[i]
          if (aggRemovedX[aggRemovedX.length-1]){
            // if (pollType=='frequency'){
            // aggRemovedX[aggRemovedX.length-1] = aggRemovedX[aggRemovedX.length-1] + ", " + this.format(data , 'h:m:s A')
            // }else{
            //   aggRemovedX[aggRemovedX.length-1] = aggRemovedX[aggRemovedX.length-1] + ", " + yData[i]
            // }
            switch (pollType) {
              case 'frequency':
                aggRemovedX[aggRemovedX.length-1] = aggRemovedX[aggRemovedX.length-1] + ", " + this.format(data , 'h:m:s A')
                break
              case 'slider':
                aggRemovedX[aggRemovedX.length-1] = aggRemovedX[aggRemovedX.length-1] + ", " + yData[i]
                break
              case 'multi':
                aggRemovedX[aggRemovedX.length-1] = aggRemovedX[aggRemovedX.length-1] + ", " + this.isTrue(yData[i])
                break
            }
            // console.log('AggX(remx):', aggX)
            // console.log('AggY(remx):', aggY)
            // console.log("aggRemovedX combined", aggRemovedX.length)
          }else{
            aggRemovedX.pop()
            switch (pollType) {
              case 'frequency':
                aggRemovedX.push(this.format(this.xData[i-1] , 'h:m:s A')+", "+ this.format(data , 'h:m:s A'))
                break
              case 'slider':
                aggRemovedX.push(yData[i-1] +", "+ yData[i])
                break
              case 'multi':
                const y1 = this.isTrue(yData[i-1])
                const y2 = this.isTrue(yData[i])
                aggRemovedX.push(y1 +", "+ y2)
                break
            }
            // if (pollType=='frequency'){
            //   aggRemovedX.push(this.format(this.xData[i-1] , 'h:m:s A')+", "+ this.format(data , 'h:m:s A'))
            // }else{
            //   console.log('slider remx', aggY[i-1] +", "+ aggY[i])
            //   aggRemovedX.push(yData[i-1] +", "+ yData[i])
            // }
            // console.log('AggX(remx):', aggX)
            // console.log('AggY(remx):', aggY)
            // console.log("aggRemovedX pushed", aggRemovedX.length)
          }
          // console.log('Remx: ', aggRemovedX)
        }else{
          let formDay = this.format(data, 'YYYY-MM-DD')
          aggX.push(formDay)
          aggY.push(yData[i])
          aggRemovedX.push(null)
          accY = []
          // console.log('AggX(remx):', aggX)
          // console.log('AggY(remx):', aggY)
          // console.log("aggRemovedX added", aggRemovedX.length)
          let needDays = this.diffInCalendarDays(aggX[aggX.length-1],aggX[aggX.length-2])
          // console.log('Add more days: ', needDays)
          if (needDays>1){
            this.addZeroDays(aggX, aggY, aggRemovedX)
            }
          // }

        // console.log('AggyX/Y', aggX, aggY, "Same? ", this.isSameDay(this.xData[i-1], data))
      }
    })
    let daysFromCreation = this.diffInCalendarDays(aggX[0], new Date(this.pollCreated))
    // console.log('Days from Creation ',daysFromCreation)
    if (daysFromCreation>1){
      this.addZeroDaysBefore(aggX, aggY, aggRemovedX)
      // console.log('AggX(final):', aggX)
      // console.log('AggY(final):', aggY)
      // console.log('aggRemovedX(final)',aggRemovedX)
    }
    this.addToDataArray(title, aggX, aggY, aggRemovedX, pollType)
  }

  addZeroDays(aggX, aggY, aggRemovedX){
    let missingDays = this.eachDay(aggX[aggX.length-2],aggX[aggX.length-1])
    missingDays.shift()
    missingDays.pop()
    let formatArray = missingDays.map(day => this.format(day, 'YYYY-MM-DD'))
    // console.log("missingDays", formatArray)
    // let yZeros = Array.apply(null, Array(missingDays.length)).map(Number.prototype.valueOf,0);
    let yZeros = (new Array(missingDays.length)).fill(null)
    // let remXNulls = Array.apply(null, Array(missingDays.length)).map(Number.prototype.valueOf,null)
    let remXNulls = (new Array(missingDays.length)).fill(null);
    aggX.splice(aggX.length-1, 0, ...formatArray)
    aggY.splice(aggY.length-1, 0, ...yZeros)
    aggRemovedX.splice(aggRemovedX.length-1, 0, ...remXNulls)
    // console.log('yZeros: ', yZeros)
    // console.log('aggX',aggX)
    // console.log('aggY',aggY)
    // console.log('aggRemovedX',aggRemovedX)
    return {aggX:aggX, aggY:aggY, aggRemovedX:aggRemovedX}
  }

  addZeroDaysBefore(aggX, aggY, aggRemovedX){
    let missingDays = this.eachDay(new Date(this.pollCreated),aggX[0])
    missingDays.pop()
    let formatArray = missingDays.map(day => this.format(day, 'YYYY-MM-DD'))
    // console.log('missingDays2: ',missingDays)
    // let yZeros = Array.apply(null, Array(missingDays.length)).map(Number.prototype.valueOf,0);
    let yZeros = (new Array(missingDays.length)).fill(null)
    // let remXNulls = Array.apply(null, Array(missingDays.length)).map(Number.prototype.valueOf,null)
    let remXNulls = (new Array(missingDays.length)).fill(null);
    // console.log('yZeros: ', yZeros)
    aggX.splice(0, 0, ...formatArray)
    aggY.splice(0, 0, ...yZeros)
    aggRemovedX.splice(0, 0, ...remXNulls)
    // console.log('aggX',aggX)
    // console.log('aggY',aggY)
    // console.log('aggRemovedX',aggRemovedX)
    return {aggX:aggX, aggY:aggY, aggRemovedX:aggRemovedX}
  }

  addToDataArray(title, xDataArray, yDataArray, text, pollType){
    const multiText = []

    switch (pollType) {
      case 'multi':
        text.forEach(x => {
          if (x){
            multiText.push(false)
          }else{
            multiText.push(true)
          }
        })
        // console.log('Text: ', text)
        // console.log('multiText: ', multiText)
        this.data.push({x: xDataArray, y: yDataArray, type: 'bar', name: title, text: text, textposition: 'auto', connectgaps: true})
        break
      default:
        this.data.push({x: xDataArray, y: yDataArray, type: 'line', mode: 'lines+markers', marker: {size: 12}, name: title, text: text, textposition: 'auto', connectgaps: true})
        // this.data.push({x: xDataArray, y: yDataArray, type: 'line', mode: 'lines+markers+text',  marker: {size: 12}, name: title, text: text, textposition: 'auto', connectgaps: true})
        break
  }
    // this.data.push({x: xDataArray, y: yDataArray, type: 'scatter', name: title, text: text})
    // console.log("Data Array Added! this.data.length: ", this.data.length, this.data)

  }
  genCSV(data){
    let csvContent = "data:text/csv;charset=utf-8,";
    data.forEach((row, i) => {
      // console.log('row: ',row)
      // let dataString = row.push(",");
      // csvContent += i < data.length ? dataString+ "\n" : dataString;
      csvContent += i < data.length ? row+ "\n" : row;
      this.encodedUri = encodeURI(csvContent);
      // console.log('Uri: ', this.encodedUri)
      // window.open(encodedUri);
    })
  }
  isTrue(val){
    if (val === 0){
      return false
    }else{
      return true
    }
  }

}

//
// buildChartData(){
//   console.log('this.Chart: ', this.chart)
//   if (this.chart){
//     this.xData = this.chart.map(x => new Date(x.created))
//     this.yData = this.chart.map(y => 1)
//     this.chart.forEach(chartData => this.optionsData.push(chartData))
//     this.optionsData.forEach((data, i) => {
//       console.log('data: ', data)
//       let options = data.options
//       options.forEach((option, index) => {
//         console.log('Option details: ', option)
//         switch (option.controlType) {
//           case 'slider':
//             console.log("Slider data found!", index)
//             console.log("Slider value: ", option.value)
//             //do slider stuff
//             break
//           case 'multi':
//           //TODO Save multi.title in results
//             console.log("Multi data found!", index)
//             console.log("Muli choices: ", option.choices)
//             let multiTitle = option.title
//             let results = []
//             let currentList = []
//             option.choices.forEach((result, mIndex) => {
//               let currentArray = results[mIndex]
//               currentList.push(result.chosen)
//               console.log('currentList: ', currentList)
//               currentArray = [result.choice, [currentList]]
//               console.log('currentArray: ', currentArray)
//               results[mIndex] = currentArray
//             })
//             console.log('Results! ', results)
//             results.forEach(res => {
//               console.log('res: ',res[0], this.xData, res[1])
//               this.aggregateSum(res[1])
//               // this.addToDataArray(res[0], this.xData, res[1])
//             })
//             // console.log([choices.choice, choices.chosen])
//             //do multi stuff
//             break
//         }
//       })
//     })
//   }
//     console.log('PreAgg Options: ', this.optionsData)
//     console.log('PreAgg Xdata: ', this.xData)
//   this.genCSV(this.xData)
//   if (!this.chart[0].options){
//     console.log("button only detected!")
//     this.aggregateSum(this.yData)
//   }
//   this.lineChart()
//   // this.sameDay()
// }
