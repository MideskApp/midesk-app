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


import { SettingService } from '../common/setting.service';
import { MessageService } from '../common/message.service';
import { UserService } from '../services/user.service';
import { CustomerService } from '../services/customer.service';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../services/authentication/auth.service';
import { AuthRequestOptions } from '../services/authentication/auth-request.service';
import { NotificationsService } from '../services/notifications.service';
import { DataService } from '../common/data.service';
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
import { CustomerSearchPage } from './../pages/customer/customer-search/customer-search';
import { NotificationsPage } from './../pages/notifications/notifications';
import { AccountPage } from './../pages/account/account';

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
import { GetFirstLastCharacter} from '../pipes/get-first-last-character.pipe';
import { ConvertLengthTitle } from '../pipes/convert-length-title.pipe';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { ConvertTime } from '../pipes/convert-time.pipe';
import { ConvertTimeListTicket } from '../pipes/convert-time-list-ticket.pipe';
import { SearchFilter } from '../pipes/search-filter.pipe';
const config: SocketIoConfig = { url: 'https://michat.mitek.vn:3007', options: {} };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CustomerPage,
    CustomerProfilePage,
    CustomerAddPage,
    CustomerSearchPage,
    SettingPage,
    AccountPage,
    LoginPage,
    TicketAddPage,
    TicketDetailPage,
    NotificationsPage,
    ModalAssign,
    ModalRequester,
    ModalProperties,
    ModalSearchTicket,
    GetFirstCharacter,
    GetFirstLastCharacter,
    ConvertLengthTitle,
    ConvertTime,
    ConvertTimeListTicket,
    SearchFilter,
    SafeHtmlPipe,
    PopoverSort,
    PopoverChannel,
    PopoverCategory,
    PopoverStatus,
    PopoverPriority,
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
    GetFirstLastCharacter,
    ConvertTime,
    ConvertTimeListTicket,
    SearchFilter,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CustomerPage,
    CustomerProfilePage,
    CustomerAddPage,
    CustomerSearchPage,
    SettingPage,
    AccountPage,
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
    MessageService,
    DataService,
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
