import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNotificationPage } from './add-notification';

@NgModule({
  declarations: [
    AddNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNotificationPage),
  ],
})
export class AddNotificationPageModule {}
