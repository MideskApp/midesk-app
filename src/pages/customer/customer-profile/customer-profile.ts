import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CustomerService } from './../../../services/customer.service';
import { TicketService } from './../../../services/ticket.service';
import { TicketDetailPage } from './../../ticket/ticket-detail/ticket-detail';
import { TicketAddPage } from './../../ticket/ticket-add/ticket-add';
import { DataService } from '../../../common/data.service';
import { MessageService } from '../../../common/message.service';
/**
 * Generated class for the CustomerProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customer-profile',
  templateUrl: 'customer-profile.html',
})
export class CustomerProfilePage {
	customerProfile = {};
  customerTicket = [];
  loading = false;
  edit = false;
	section = 'segment1';
  modelEdit={
    customer:'',
    address:'',
    phone:'',
  };
  modelUpdate:any={};
  customerId:number;
  customerName:any;
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams, 
      private _customerService: CustomerService,
      private _ticketService: TicketService,
      private _dataService: DataService,
      private _msgService: MessageService
      ) {
        this.customerId = this.navParams.get('id');
    this.initCustomerProfile();
    this.initListTicketByCustomer();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerProfilePage');
    
  }
  initCustomerProfile(){
    this.loading = true;
    this._customerService.getCustomerProfile(this.navParams.get('id')).subscribe(res=>{
      this.customerProfile = res;
      this.modelEdit.customer = res.customer;
      this.modelEdit.address = res.address;
      this.modelEdit.phone = res.phone;
      this.loading = false;
    })
  }
  editProfile(){
    this.edit = true;
  }
  initListTicketByCustomer(){
    this._ticketService.getTicketByCustomer(this.customerId).subscribe(res =>{
      this.customerTicket = res;
    });
  }
  updateProfile(){
    if(Object.keys(this.modelUpdate).length>0){
      let loading = this._dataService.createLoading({content:this._msgService._msg_loading});
      loading.present();
      this._customerService.updateCustomer({dataUpdate:this.modelUpdate,customerId:this.customerId}).subscribe(res=>{
        if(res.code==200){
          this.initCustomerProfile();
          loading.setContent(res.message);
          this.edit = false;
        }
      loading.dismiss();  
      });
    }
    else this.closeEdit();
  }
  openTicketDetail(index){
    this.navCtrl.push(TicketDetailPage,{data:index});
  }
  openAddTicket(){
    let data = {
      requester:this.customerProfile['id'],
      requester_type:'customer',
      requesterName:this.customerProfile['customer']
    }
    this.navCtrl.push(TicketAddPage,{data:data});
  }
  closeEdit(){
    this.edit = false;
    this.modelEdit.customer = this.customerProfile['customer'];
    this.modelEdit.address = this.customerProfile['address'];
    this.modelEdit.phone = this.customerProfile['phone'];
  }
  onInsertData($event,$type){
    if($type=='customer'){
      if($event.target.value != this.customerProfile['customer']){
        this.modelUpdate['customer'] = $event.target.value;
      }
      else{
        delete this.modelUpdate['customer'];
      }
    }
    if($type=='phone'){
      if($event.target.value != this.customerProfile['phone']){
        this.modelUpdate['phone'] = $event.target.value;
      }
      else{
        delete this.modelUpdate['phone'];
      }
    }
    if($type=='address'){
      if($event.target.value != this.customerProfile['address']){
        this.modelUpdate['address'] = $event.target.value;
      }
      else{
        delete this.modelUpdate['address'];
      }
    }
  }

}
