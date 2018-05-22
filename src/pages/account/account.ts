import { UserService } from './../../services/user.service';
import { DataService } from './../../common/data.service';
import { AuthService } from './../../services/authentication/auth.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { CookieService } from 'angular2-cookie/core';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  modelUser:any={};
  modelEdit:any={};
  modelUpdate:any={};
  colorAvatar:any;
  password:any;
  confirmPassword:any;
  countEdit = 0;
  enableToggle:boolean=false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _authService: AuthService,
    private _dataService: DataService,
    private alertCtrl: AlertController,
    private _userService: UserService,
    private _cookieService: CookieService,
    private _event : Events,
  ) {
    
  }
  edit:boolean=false;
  ionViewDidLoad() {
    this.initProfileUser();
  }
  initProfileUser(){
    this.modelUser = this._authService.getLoggedInUser();
    this.colorAvatar = this.modelUser.datecreate.toString().substr(4,6);
    console.log(this.modelUser);
  }
  editAccount(){
    this.edit = true;
    this.modelEdit = Object.assign('',this.modelUser);
    this.modelUpdate = {};
  }
  closeEdit(){
    this.edit = false;
    this.modelEdit = {};
    this.modelUpdate = {};
    this.enableToggle = false;
    this.countEdit = Object.keys(this.modelUpdate).length;
  }
  submitEdit(){
    if(this.password!=this.confirmPassword){
      let alert = this.alertCtrl.create({
        message:'Mật khẩu không chính xác',
      })
      alert.present();
    }
    else{
      let alert = this.alertCtrl.create({
      message:'Vui lòng xác nhận lại',
      buttons:[
        {
          text:'Đồng ý',
          handler: data=>{
            this.updateProfileUser();
            //console.log(this.modelUpdate);
          }
        },
        {
          text:'Hủy',
          handler:data=>{}
        }
      ]
      })
      alert.present();
    }
    
  }
  onInsertData($event,$type){
    if($event.target.value != this.modelEdit[$type]){
      this.modelUpdate[$type] = $event.target.value;
    }
    else if($event.target.value == this.modelEdit[$type]){
      delete this.modelUpdate[$type];
    }
    this.countEdit = Object.keys(this.modelUpdate).length;
  }
  updateProfileUser(){
    this._userService.updateUserProfile({data:this.modelUpdate}).subscribe(res=>{
      //this.initProfileUser();
      if(res.code==200){
        this._cookieService.remove('curuser');
        this._cookieService.putObject('curuser',{info:res.data});
        this.initProfileUser();
        this._event.publish('UPDATE PROFILE');
      }
      
    })
  }
  changePassword(){
    if(this.enableToggle == true){
      let alert = this.alertCtrl.create({
        message:'Bạn sẽ cần đăng nhập lại nếu như thay đổi mật khẩu',
      })
      alert.present();
    }
  }
}
