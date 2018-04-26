import { Component } from '@angular/core';
import { NavParams, ViewController, PopoverController } from 'ionic-angular';
import { PopoverCategory } from './../../popover/popover-category/popover-category';

@Component({
	selector: 'modal-properties',
	templateUrl: 'modal-properties.html',
})
export class ModalProperties{
	categoryName = '';
	category = '';
	constructor(
		public navParams: NavParams,
		private viewCtrl: ViewController,
		private popoverCtrl: PopoverController
	){
	}
	ionViewWillLoad() {

	}
	closeModal(){
      this.viewCtrl.dismiss({category:this.category});
  	}
  	openPopoverCategory(){
  		let categoryPopover = this.popoverCtrl.create(PopoverCategory,{data:[]},{cssClass:"custom-popup",enableBackdropDismiss:true});
	    categoryPopover.onDidDismiss(data=>{
	    	if(typeof data!=undefined && data!=null){
	    		this.category = '';
	    		this.categoryName = '';
	    		for(let i = 0; i<data.data.length;i++){
	            	this.category+=data.data[i].id+',';
	            	this.categoryName +=data.data[i].name+' ';
	          	}
	    	}
	    })
	    //   if(!data.cancel){
	    //     this.category='';
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