import { Component } from '@angular/core';
import { NavParams, ViewController, PopoverController } from 'ionic-angular';
import { PopoverCategory } from './../../../ticket/ticket-add/popover-category/popover-category';

@Component({
	selector: 'modal-properties',
	templateUrl: 'modal-properties.html',
})
export class ModalProperties{
	constructor(
		public navParams: NavParams,
		private viewCtrl: ViewController,
		private popoverCtrl: PopoverController
	){
	}
	ionViewWillLoad() {

	}
	closeModal(){
      this.viewCtrl.dismiss();
  	}
  	openPopoverCategory(){
  		let categoryPopover = this.popoverCtrl.create(PopoverCategory,{data:[]},{cssClass:"custom-popup",enableBackdropDismiss:false});
	    // categoryPopover.onDidDismiss(data=>{
	    //   if(!data.cancel){
	    //     this.ticketParams.category='';
	    //     this.categoryName='';
	    //       for(let i = 0; i<data.data.length;i++){
	    //         this.ticketParams.category+=data.data[i].id+',';
	    //         this.categoryName +=data.data[i].name+' ';
	    //       }
	    //   }else{
	    //     console.log(111212);
	    //   }
	    // })
	    categoryPopover.present();
  	}
}