import { Component, ViewChild, Injectable } from '@angular/core';
import { NavController, Select, Platform, ModalController, PopoverController, /*Events*/ } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from './../../services/authentication/auth.service';
import { TicketService } from './../../services/ticket.service';
import { TicketDetailPage } from './../ticket/ticket-detail/ticket-detail';
import { ModalSearchTicket } from './../../components/modal/modal-search-ticket/modal-search.component';
import { PopoverSort } from './../../components/popover/popover-sort/popover-sort';
import { PopoverChannel } from './../../components/popover/popover-channel/popover-channel';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
@Injectable()
export class HomePage {
  @ViewChild('sectionSelect') sectionSelect: Select;
  @ViewChild('popoverChannel') popoverChannel: Select;
  arraySort:any=[
      { id: 'desc', name: 'Mới nhất', value: 'desc' },
      { id: 'asc', name: 'Cũ nhất', value: 'asc' },
  ];
  arrayFilter:any=[
      { id:'filter1', name:'Yêu cầu tạo bởi bạn', value:'yêu cầu được tạo bởi bạn' },
      { id:'filter3',name:'Yêu cầu chưa phân công', value: 'yêu cầu chưa phân công' },
      { id:'filter4', name:'Yêu cầu đang chờ xử lý', value: 'yêu cầu đang chờ xử lý' },
      { id:'filter5', name:'Yêu cầu đã xử lý', value: 'yêu cầu đã xử lý' },
      { id:'filter6', name:'Yêu cầu chưa giải quyết', value: 'yêu cầu chưa giải quyết' }
  ];
  status:any=[
      { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
      { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
      { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
      { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false }
  ];
  priority=[];
  filterTicket:any={
  	filterBy:'yêu cầu được tạo bởi bạn',
  	sortBy:'desc'
  };
  modelTicket:any={
  	dataItems:[],
  	dataPage:1,
    dataLoading:false,
    dataTotal:0,
    loadMore:false,
    filterBy:'yêu cầu được tạo bởi bạn',
    sortBy:[],
    channel:'all',
  };
  countNotify:any;
  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private _ticketService: TicketService,
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private modalCtrl: ModalController,
    private _authService: AuthService
    ) {
  }
  ionViewWillLoad(){
    this.initListTicket();
    this.priority = this._authService.getPriority();
    var aaaa = this._authService.getLoggedInListTeam();
    if(aaaa!=''){
      this.arrayFilter.push({ id:'filter2',name:'Yêu cầu chưa giải quyết trong bộ phận', value: 'yêu cầu chưa giải quyết trong bộ phận' });
    } 
  }
  initListTicket(){
    this.modelTicket.dataLoading = true;
    this._ticketService.getListTicket(this.modelTicket).subscribe(res=>{
      this.modelTicket.dataItems = res.data;
      if(res.next_page_url!==null) this.modelTicket.loadMore = true;
      else this.modelTicket.loadMore = false;
      this.modelTicket.dataLoading = false;
    });
  }
  doRefresh(refresher) {
      this.modelTicket.dataPage = 1;
      this.modelTicket.dataTotal = 0;
      this.initListTicket();
      refresher.complete();
  }
  doInfinite(infiniteScroll){
  	this.modelTicket.dataPage += 1;
  	this._ticketService.getListTicket(this.modelTicket).subscribe(res=>{
  		this.modelTicket.dataItems.push(...res.data);
  		if(res.next_page_url!==null) this.modelTicket.loadMore = true;
      else this.modelTicket.loadMore = false;
      this.modelTicket.dataLoading = false;
      infiniteScroll.complete();
  	})
  }
  openModal(){
    let contactModal = this.modalCtrl.create(ModalSearchTicket);
    contactModal.present();
  }
  doSort(){
  	this.sectionSelect.open();
  }
  clickTicket(index){
  	console.log(index);
    this.navCtrl.push(TicketDetailPage,{data:index});
  }
  doFilter(){
    this.modelTicket.dataItems=[];
    this.modelTicket.dataPage=1;
    this.modelTicket.dataTotal=0;
    this.initListTicket();
    console.log(this.modelTicket.filterBy);
  }
  openPopoverSort(myEvent) {
    let data = {priority:this.priority,status:this.status}
    let popover = this.popoverCtrl.create(PopoverSort,data,{cssClass:"custom-sort",enableBackdropDismiss: true });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data=>{
      if(typeof data!=undefined && data!=null){
        this.modelTicket.sortBy=data;
        this.modelTicket.dataPage=1;
        this.modelTicket.dataTotal=0;
        this.initListTicket();
      }
      //
      console.log(data);
      //
    });
  }
  openPopoverChannel(myEvent){
    let data = this.modelTicket.channel;
    let popover = this.popoverCtrl.create(PopoverChannel,{data:data},{cssClass:"custom-channel",enableBackdropDismiss: true });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data=>{
      if(typeof data!=undefined && data !=null){     
        this.modelTicket.channel = data.channel;
        this.modelTicket.dataPage=1;
        this.modelTicket.dataTotal=0;
        this.initListTicket(); 
      }
    });
  }
  testNotification(){
    let body ={
      "notification":{
      "title":"New Notification has arrived",
      "body":"Notification Body",
      "sound":"default",
      "click_action":"FCM_PLUGIN_ACTIVITY",
      "icon":"fcm_push_icon"
      },
      "data":{
        "param1":"value1",
        "param2":"value2"
      },
      "to":"/topics/all",
      "priority":"high",
      "restricted_package_name":""
    }
    this._ticketService.pushNotifications(body).subscribe();
  }
}
