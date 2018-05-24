import { AccountPage } from './../pages/account/account';
import { SocketService } from './../common/socket.service';
import { NotificationsService } from './../services/notifications.service';
import { TicketDetailPage } from './../pages/ticket/ticket-detail/ticket-detail';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from './../pages/home/home';
import { SettingPage } from './../pages/setting/setting';
import { CustomerPage } from './../pages/customer/customer';
import { NotificationsPage } from './../pages/notifications/notifications';
import { LoginPage } from './../pages/login/login';
import { TicketAddPage } from './../pages/ticket/ticket-add/ticket-add';
import { AuthService } from '../services/authentication/auth.service';
import { DataService } from '../common/data.service';
import { MessageService } from '../common/message.service';

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
  avatarName:string;
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    private _authService: AuthService,
    private _dataService: DataService,
    private _msgService: MessageService,
    private _notifyService:NotificationsService,
    private loadingCtrl: LoadingController,
    private _fcm: FCM,
    private _localNotification: LocalNotifications,
    private _socketService: SocketService,
    public _event: Events,
    ) {
    
    this.listenEventNewNotifi();
    this._event.subscribe('UPDATE PROFILE',data=>{
      this.loggedInUser = this._authService.getLoggedInUser();
      this.avatarName = this._authService.getLoggedInUser().lastname;
      this.avatarName = this.avatarName.substr(0,1);  
    });
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Thông Báo', component: NotificationsPage, icon:'notifications-outline', badge:'33'},
      { title: 'Tạo Phiếu Mới', component: TicketAddPage, icon:'create', badge:''},
      { title: 'Khách Hàng', component: CustomerPage, icon:'people', badge:''},
      { title: 'Tài Khoản', component: AccountPage, icon:'contact', badge:''},
      { title: 'Cài Đặt', component: SettingPage, icon:'settings', badge:''},
    ];

  }
  ngOnInit(){
    
  }
  initializeApp() {
    this.platform.ready().then(() => {
      if(this._authService.isUserLoggedIn()){
        this._notifyService.countNewNotifications().subscribe(res=>{ this.countNotify = res;});
        this.loggedInUser = this._authService.getLoggedInUser();
        this.avatarName = this._authService.getLoggedInUser().lastname;
        this.avatarName = this.avatarName.substr(0,1); 
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
    let promt = this._dataService.createAlertWithHandle(this._msgService._msg_user_logout);
    promt.present();
    promt.onDidDismiss(data=>{
      if(data){
        this.presentLoading();
        this._socketService.disconnect();
        this._authService.logoutUser();
        window.location.reload();
      }
    })
  }
  listenEventNewNotifi(){
    this._socketService.listenEvent('NEW NOTIFI').subscribe(data=>{
      this._notifyService.countNewNotifications().subscribe(res=>{ this.countNotify = res;});
      this.token = this._authService.getFCMToken();
      if(this._authService.enableNotify()){
        this.pushNotifications(data);
      }
    });
  }
  pushNotifications(data){
    console.log(data);
    let userId = this._authService.getLoggedInUser().id;
    if(data[0]['del_agent'] != userId && data[0]['view'] != userId){
      let team = JSON.parse(this._authService.getLoggedInRoom()).array_team;
      let userLevel = this._authService.getLoggedInUser().level;
      team = team.split(',');
      let title = data[0]['title'];
      var regex = /(<([^>]+)>)/ig;
      let custom = JSON.parse(data[0]['custom']);
      title = title.replace(regex, "");
      let array = {
        title: title,
        id:custom.id,
        ticket_id: custom.ticket_id,
        notify_id: data[0]['id']
      }
      let body={
        "notification":{
          "title":"Bạn có thông báo mới!",
          "body":title,
          "sound":"default",
          "click_action":"FCM_PLUGIN_ACTIVITY",
          "icon":"fcm_push_icon",
          "forceStart": "1"
        },
        "data":array,
        "to":this.token,
        "priority":"high",
        "restricted_package_name":""
      } 
      if(userLevel=='agent'){
        if(userId == data[0]['id_user'] || team.indexOf(data[0]['id_team'],0)!=-1){
          this._notifyService.sendNotification(body).subscribe();
        }
      }else{
        this._notifyService.sendNotification(body).subscribe();
      }
    }
  }
  initLocalNotification(data){
    //let vibrate = this._authService.enableVibrate();
    this._localNotification.schedule({
      id:2,
      title:'Bạn có thông báo mới!',
      text:data.title,
      led:'66CC00',
      vibrate:true,
      data:{
        id:data.id,
        ticket_id:data.ticket_id,
        notify_id:data.notify_id
      }
    })
  }
  receiveNotification(){
    if(this._authService.enableNotify()){
      this._fcm.onNotification().subscribe(res=>{
        this.initLocalNotification(res);
      })
    }
  }
}