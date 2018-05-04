import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, /*Events*/ } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from './../pages/home/home';
import { SettingPage } from './../pages/setting/setting';
import { CustomerPage } from './../pages/customer/customer';
import { NotificationsPage } from './../pages/notifications/notifications';
import { LoginPage } from './../pages/login/login';
import { TicketAddPage } from './../pages/ticket/ticket-add/ticket-add';
import { AuthService } from '../services/authentication/auth.service';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  loggedInUser = {};
  logged = false;
  pages: Array<{title: string, component: any, icon: string, badge:any}>;
  countNotify:any;
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    private _authService: AuthService,
    private alertCtrl: AlertController,
    _fcm: FCM,
    _localNotification: LocalNotifications
    ) {
    // const config: SocketIoConfig = { url: 'https://michat.mitek.vn:3007/?group=' + 37 };
    //   SocketIoModule.forRoot(config);
    //   _socket.connect();
    //   _socket.on('connect',function(data){
    //     _socket.emit('room', {
    //       'room' : _authService.getLoggedInUser().groupid, 
    //       'fullname' : _authService.getLoggedInUser().firstname+' '+_authService.getLoggedInUser().lastname, 
    //       'accountid' : _authService.getLoggedInUser().id, 
    //       'array_agent' : _authService.getLoggedInListAgent(), 
    //       'array_team' : _authService.getLoggedInListTeam(), 
    //       'exten' : (_authService.getLoggedInExtension()?_authService.getLoggedInExtension():'9999999') 
    //     });
    //   });
    _fcm.subscribeToTopic('all');
    _fcm.onNotification().subscribe(data=>{
      _localNotification.schedule({
        id:1,
        title:data.title,
        text:data.message,
        icon:'notifications-outline'
      })
    })
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      //{ title: 'Home', component: HomePage, icon: 'home' },
      //{ title: 'List', component: ListPage, icon: 'notifications-outline'},
      { title: 'Notifications', component: NotificationsPage, icon:'notifications-outline', badge:'33'},
      { title: 'Add Ticket', component: TicketAddPage, icon:'create', badge:''},
      { title: 'Customer', component: CustomerPage, icon:'people', badge:''},
      { title: 'Settings', component: SettingPage, icon:'settings', badge:''},
    ];

  }
  ngOnInit(){
    
  }
  initializeApp() {
    this.platform.ready().then(() => {
      if(this._authService.isUserLoggedIn()){
        this.loggedInUser = this._authService.getLoggedInUser();
        this.rootPage = HomePage;
      }else{
        this.loggedInUser = {};
        this.rootPage = LoginPage;
      } 
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.nav.setRoot(page.component);
    //this.nav.push(page.component);
    this.nav.push(page.component);
  }
  logOut(){
    this.confirmLogout();
  }
  confirmLogout(){
    let prompt = this.alertCtrl.create({
      title: 'Thông báo!',
      message: "Bạn có chắc là muốn đăng xuất?",
      buttons: [
        {
          text: 'Hủy',
          handler: data => {
          }
        },
        {
          text: 'Đồng ý',
          handler: data => {
            this._authService.logoutUser();
            window.location.reload();
          }
        }
      ]
    });
    prompt.present();
  }
}
