import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from './../../../app/services/customer.service';

/**
 * Generated class for the CustomerAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customer-add',
  templateUrl: 'customer-add.html',
})
export class CustomerAddPage {
  private addCustomerForm : FormGroup;
	modelCustomer:any={
		customer:'',
		address:'',
		email:'',
		phone:''
	}
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private _customerService: CustomerService,
    private loadingCtrl: LoadingController
    ) {
    this.addCustomerForm = new FormGroup({
        customer: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required && Validators.email),
        phone: new FormControl('', Validators.compose([Validators.required,Validators.pattern('^[0-9]{8,15}$')]) ),
        address: new FormControl(''),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerAddPage');

  }
  addCustomer(){
    let loader = this.loadingCtrl.create({
      content:'Please wait ...',
    })
    loader.present();
    this._customerService.addCustomer(this.modelCustomer).subscribe(res=>{
      loader.setContent(res.message);
      if(res.code == 200) this.addCustomerForm.reset()
      loader.dismiss();
    });
  }
  onFormSubmit(){
  }
}
