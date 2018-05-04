import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';
import { TicketService } from './../../../services/ticket.service';


@Component({
 // <ion-col col-1 *ngIf="filterCategory.dataChoose.length>0">
 //              <ion-icon (click)="chooseCategory(item,$type='bakc')" name="arrow-round-back" style="font-size: 20px"></ion-icon>
 //            </ion-col>
 //            <ion-col text-center>Chủ đề</ion-col>
  template: `
    <ion-header style="border-bottom:0.55px solid #CCC">
        <ion-grid>
          <ion-row>
            <ion-col col-2>
              <ion-icon align-left *ngIf="filterCategory.dataChoose.length>0" (click)="chooseCategory(item,$type='back')" name="arrow-back" style="font-size: 20px">
              </ion-icon>
            </ion-col>
            <ion-col col-10>Chủ đề</ion-col>
          </ion-row>
        </ion-grid>
    </ion-header>
    <ion-content>
      <ion-spinner padding margin *ngIf="loading" name="crescent"></ion-spinner>
      <ion-list *ngIf="!loading" >
        <ion-item *ngFor="let item of filterCategory.dataItems" (click)="chooseCategory(item,$type='choose')">
        {{item.name}}
        <ion-icon item-end name="checkmark" style="font-size:1.2em" color="checked"></ion-icon>
        </ion-item>
      </ion-list>
      <ion-row *ngIf="!loading">
          <ion-col col-6 padding-left><button *ngIf="filterCategory.dataChoose.length>0" class="button-popover" ion-button block color="secondary" (click)="doCategory()">Xác nhận</button></ion-col>
          <ion-col col-6 padding-right><button class="button-popover" ion-button block color="solved" (click)="close()">Đóng</button></ion-col>
      </ion-row>
    </ion-content>

  `,
  selector:'popover-category',
})
export class PopoverCategory {
  filterCategory={
    dataItems:[],
    dataChoose:[],
    selected:0,
    loadMore:false,
    cateId:0,
    parentId:0
  }
  loading = false;
  constructor(public viewCtrl: ViewController,public navParams:NavParams,private _ticketService : TicketService) {
    this.loading = true;
    this._ticketService.getTicketCategory(this.filterCategory.parentId).subscribe(res=>{
      this.filterCategory.dataItems=res.data;
      this.loading=false;
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }
  chooseCategory(index,$type){
    if($type=='back'){
      this.loading = true;
      this.filterCategory.dataChoose.pop();
      this._ticketService.getTicketCategory(this.filterCategory.parentId).subscribe(res=>{
        this.filterCategory.dataItems = res.data;
        this.filterCategory.parentId = res.lastId;
        console.log(this.filterCategory.dataChoose);
        this.loading = false;
      })
    }
    else{
      this.loading = true;
      this.filterCategory.dataChoose.push(index);
      this._ticketService.getTicketCategory(index.id).subscribe(res=>{
        if(res.data.length>0){
          this.filterCategory.dataItems = res.data;
          this.loading = false;
        }
        else{
          this.loading = false;
          this.doCategory();
          console.log(this.filterCategory.dataChoose);
        }
        this.filterCategory.parentId = res.lastId;
        
      });
    }
  }
  doCategory(){
    let data = this.filterCategory.dataChoose;
    this.viewCtrl.dismiss({data:data});
  }
}