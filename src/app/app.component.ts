import { NotificationsService } from './../services/notifications.service';
import { TicketDetailPage } from './../pages/ticket/ticket-detail/ticket-detail';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { Socket } from 'ng-socket-io';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController } from 'ionic-angular';
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
    private _notifyService:NotificationsService,
    private _socket: Socket,
    private loadingCtrl: LoadingController,
    _fcm: FCM,
    _localNotification: LocalNotifications
    ) {
    // _socket.on('NEW NOTIFI',data=>{
    //   this._notifyService.countNewNotifications().subscribe(res=>{ this.countNotify = res;});
    //   let del_agent = data[0]['del_agent'];
    //   let view = data[0]['view'];
    //   let userId = _authService.getLoggedInUser().id;
    //   let title = data[0]['title'];
    //   var regex = /(<([^>]+)>)/ig
    //   title = title.replace(regex, "");
    //   let custom = JSON.parse(data[0]['custom']);
    //   if(del_agent != userId && view != userId){ //thong bao tu nguoi khac tao
    //     _localNotification.schedule({
    //       id:1,
    //       title:'Bạn có thông báo mới!',
    //       text:title,
    //       data:custom
    //     })
    //   }
    //   else{
    //     console.log('NOT');
    //   }
    // }) 
    _fcm.subscribeToTopic('all');
    _fcm.onNotification().subscribe(data=>{
      alert(1);
      _localNotification.schedule({
        id:2,
        title:data.title,
        text:data.body,
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
        //let room = this._authService.getLoggedInRoom();
        // this._socket.connect();
        // this._socket.emit('room',room);
        // this._socket.on('NEW NOTIFI',data=>{
        //   console.log(data);
        // })
        this._notifyService.countNewNotifications().subscribe(res=>{ this.countNotify = res;});
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
  presentLoading() {
    let loader = this.loadingCtrl.create({
    });
    loader.present();
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
            this.presentLoading();
            this._socket.disconnect();
            this._authService.logoutUser();
            window.location.reload();
          }
        }
      ]
    });
    prompt.present();
  }
}