import { CookieService } from 'angular2-cookie/core';
import { SocketService } from './../common/socket.service';
import { TicketService } from './../services/ticket.service';
import { NotificationsService } from './../services/notifications.service';
import { TicketDetailPage } from './../pages/ticket/ticket-detail/ticket-detail';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
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
  token:any;
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    private _authService: AuthService,
    private alertCtrl: AlertController,
    private _notifyService:NotificationsService,
    private loadingCtrl: LoadingController,
    private _cookieService: CookieService,
    private _ticketService: TicketService,
    private _fcm: FCM,
    private _localNotification: LocalNotifications,
    private _socketService: SocketService
    ) {
    // _socket.on('NEW NOTIFI',data=>{
    //   this._notifyService.countNewNotifications().subscribe(res=>{ this.countNotify = res;});
    //   console.log(JSON.parse(data[0]['custom']));
    // });
    this.listenEventNewNotifi();
    // _fcm.subscribeToTopic('all');
    // _fcm.onNotification().subscribe(data=>{
    //   // _localNotification.schedule({
    //   //   id:2,
    //   //   title:data.title,
    //   //   text:data.body,
    //   // })
    //   if(data.wasTapped){
    //     alert('receive in background');
    //   }
    //   else{
    //     alert('receive in foreground');
    //   }
    // })
    // _fcm.onTokenRefresh().subscribe(token=>{
    //   this._cookieService.put('fcm_token',token);
    // })
   
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
            this._socketService.disconnect();
            this._authService.logoutUser();
            window.location.reload();
          }
        }
      ]
    });
    prompt.present();
  }
  listenEventNewNotifi(){
    this._socketService.listenEvent('NEW NOTIFI').subscribe(data=>{
      this._notifyService.countNewNotifications().subscribe(res=>{ this.countNotify = res;});
      //this.pushNotifications();
    });
  }
  pushNotifications(){
    this.token = this._authService.getFCMToken();
    let body={
      "notification":{
        "title":"Bạn có thông báo mới!",
        "body":'Test',
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon",
        "forceStart": "1"
        },
      "data":{
        "param1":"param1",
        "param2":"param2",
      },
      "to":this.token,
      "priority":"high",
      "restricted_package_name":""
    }
    this._notifyService.sendNotification(body).subscribe();
  }
  receiveNotification(){
    this._fcm.subscribeToTopic('all');
    this._fcm.onNotification().subscribe(res=>{
      alert(1);
    })
  }
}