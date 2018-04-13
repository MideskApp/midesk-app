import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CustomerService } from './../../app/services/customer.service';
import { CustomerProfilePage } from'./customer-profile/customer-profile';
import { CustomerAddPage } from'./customer-add/customer-add';

/**
 * Generated class for the CustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPage {
  loading = false;
  modelCustomer:any = {
  	dataItems:[],
  	dataPage:1,
  	loadMore:false,
  };
  constructor(
  		public navCtrl: NavController, 
  		public navParams: NavParams,
  		private _customerService: CustomerService,) {
  }

  ionViewDidLoad() {
    this.initListCustomer();
  }
  initListCustomer(){
  	this.loading = true;
  	this._customerService.getListCustomer(this.modelCustomer.dataPage).subscribe(res=>{
  		console.log(res.data);
  		this.modelCustomer.dataItems = res.data;
      if(res.next_page_url!==null) this.modelCustomer.loadMore = true;
      else this.modelCustomer.loadMore = false;
  		this.loading = false;
  	})
  }
  customerProfile(index){
  	this.navCtrl.push(CustomerProfilePage,{id:index.id});
  }
  openAddCustomer(){
    this.navCtrl.push(CustomerAddPage);
  }
  doInfinite(infiniteScroll){
    this.modelCustomer.dataPage += 1;
    //this.loading = true;
    this._customerService.getListCustomer(this.modelCustomer.dataPage).subscribe(res=>{
      this.modelCustomer.dataItems.push(...res.data);
      if(res.next_page_url!==null) this.modelCustomer.loadMore = true;
      else this.modelCustomer.loadMore = false;
      //this.loading = false;
      infiniteScroll.complete();
    })
  }
  doRefresh(refresher) {
      this.modelCustomer.dataPage = 1;
      this.initListCustomer();
      refresher.complete();
  }
}
