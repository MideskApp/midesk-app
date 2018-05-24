import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/authentication/auth.service';
import { UserService } from '../../services/user.service';
import { CookieService } from 'angular2-cookie/core';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  enableNotify:boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _authService: AuthService,
    private _userService: UserService,
    private _cookieService: CookieService
  ) {
    this.enableNotify = this._authService.enableNotify();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
    console.log(this.enableNotify);
  }
  changeStatusNotify(){
    console.log(this.enableNotify);
    let flag = (this.enableNotify==true)?'1':'0';
    this._cookieService.put('enableNotify',flag);
  }

}
