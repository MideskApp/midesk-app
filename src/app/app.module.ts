import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule, RequestOptions } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';

import { CookieService } from 'angular2-cookie/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'https://michat.mitek.vn:3007', options: {} };

import { SettingService } from '../common/setting.service';
import { UserService } from '../services/user.service';
import { CustomerService } from '../services/customer.service';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../services/authentication/auth.service';
import { AuthRequestOptions } from '../services/authentication/auth-request.service';
import { NotificationsService } from '../services/notifications.service';
import { SocketService } from './../common/socket.service';

import { MyApp } from './app.component';
import { HomePage } from './../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { TicketAddPage } from './../pages/ticket/ticket-add/ticket-add';
import { CustomerPage } from './../pages/customer/customer';
import { CustomerProfilePage } from './../pages/customer/customer-profile/customer-profile';
import { SettingPage } from './../pages/setting/setting';
import { TicketDetailPage } from './../pages/ticket/ticket-detail/ticket-detail';
import { CustomerAddPage } from './../pages/customer/customer-add/customer-add';
import { NotificationsPage } from './../pages/notifications/notifications';

import { ModalAssign } from '../components/modal/modal-assign/modal-assign';
import { ModalRequester } from '../components/modal/modal-requester/modal-requester';
import { ModalProperties } from '../components/modal/modal-properties/modal-properties';

import { ModalSearchTicket } from '../components/modal/modal-search-ticket/modal-search.component';
import { PopoverSort } from '../components/popover/popover-sort/popover-sort';
import { PopoverChannel } from '../components/popover/popover-channel/popover-channel';
import { PopoverCategory } from '../components/popover/popover-category/popover-category';
import { PopoverStatus } from '../components/popover/popover-status/popover-status';
import { PopoverPriority } from '../components/popover/popover-priority/popover-priority';

import { GetFirstCharacter } from '../pipes/get-first-character.pipe';
import { ConvertLengthTitle } from '../pipes/convert-length-title.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CustomerPage,
    CustomerProfilePage,
    CustomerAddPage,
    SettingPage,
    LoginPage,
    TicketAddPage,
    TicketDetailPage,
    NotificationsPage,
    ModalAssign,
    ModalRequester,
    ModalProperties,
    ModalSearchTicket,
    GetFirstCharacter,
    ConvertLengthTitle,
    SafeHtmlPipe,
    PopoverSort,
    PopoverChannel,
    PopoverCategory,
    PopoverStatus,
    PopoverPriority
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SocketIoModule.forRoot(config),
  ],
  exports:[
    GetFirstCharacter,
    ConvertLengthTitle,
    SafeHtmlPipe,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CustomerPage,
    CustomerProfilePage,
    CustomerAddPage,
    SettingPage,
    LoginPage,
    TicketAddPage,
    TicketDetailPage,
    NotificationsPage,
    ModalAssign,
    ModalRequester,
    ModalProperties,
    ModalSearchTicket,
    PopoverSort,
    PopoverChannel,
    PopoverCategory,
    PopoverStatus,
    PopoverPriority
  ],
  providers: [
    CookieService,
    SettingService,
    UserService,
    TicketService,
    CustomerService,
    AuthService,
    NotificationsService,
    StatusBar,
    SplashScreen,
    LocalNotifications,
    FCM,
    SocketService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: RequestOptions,
      useClass: AuthRequestOptions  //automatically appending headers to every request.
    }
  ]
})
export class AppModule {}
