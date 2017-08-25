import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPollPage } from './new-poll';

@NgModule({
  declarations: [
    NewPollPage,
  ],
  imports: [
    IonicPageModule.forChild(NewPollPage),
  ],
})
export class NewPollPageModule {}
