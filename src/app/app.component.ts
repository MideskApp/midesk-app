import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from './../pages/home/home';
import { SettingPage } from './../pages/setting/setting';
import { CustomerPage } from './../pages/customer/customer';
//import { ListPage } from './../pages/list/list';
import { LoginPage } from './../pages/login/login';
import { TicketAddPage } from './../pages/ticket/ticket-add/ticket-add';
import { AuthService } from './services/authentication/auth.service';
//import { User } from './models/user';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  loggedInUser = {};
  logged = false;
  pages: Array<{title: string, component: any, icon: string}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    private _auth: AuthService,
    private alertCtrl: AlertController,
    public events : Events,
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      //{ title: 'Home', component: HomePage, icon: 'home' },
      //{ title: 'List', component: ListPage, icon: 'notifications-outline'},
      { title: 'Add Ticket', component: TicketAddPage, icon:'create'},
      { title: 'Customer', component: CustomerPage, icon:'people'},
      { title: 'Settings', component: SettingPage, icon:'settings'},
    ];

  }
  ngOnInit(){
    
  } 
  initializeApp() {
    this.platform.ready().then(() => {
      if(this._auth.isUserLoggedIn()){
        this.logged = true;
        //this.nav.setRoot(HomePage);
        this.loggedInUser = this._auth.getLoggedInUser();
        this.rootPage = HomePage;
      }else{
        this.logged = false;
        this.loggedInUser = {};
        //this.nav.setRoot(LoginPage);
        this.rootPage = LoginPage;
      } 
      console.log(this.nav)
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // if(this.platform.is('android')){
      //   this.fcm.subscribeToTopic('all');
      //   this.fcm.getToken().then(token=>{
      //     alert(token);
      //   })
      //   this.fcm.onNotification().subscribe(data=>{
      //     if(data.wasTapped){
      //       console.log("Received in background");
      //     } else {
      //       console.log("Received in foreground");
      //       this.alertCtrl.create({
      //         message: data.message
      //       }).present();
      //     };
      //   })
      //   this.fcm.onTokenRefresh().subscribe(token=>{
      //     alert(token);
      //   });
      // }
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
            this._auth.logoutUser();
            // this.nav.setRoot(LoginPage);
            // this.rootPage = LoginPage;
            window.location.reload();
          }
        }
      ]
    });
    prompt.present();
  }
}
