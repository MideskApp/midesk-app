import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, ModalController, Select, ToastController  } from 'ionic-angular';
import { TicketService } from './../../../app/services/ticket.service';
import { ModalAssign } from'./../../ticket/ticket-add/modal-assign/modal-assign';
import { SettingService } from './../../../app/common/setting.service';
//import { ModalRequester } from './../../ticket/ticket-add/modal-requester/modal-requester';
//import { PopoverCategory } from './../../ticket/ticket-add/popover-category/popover-category';
//import { UserService } from './../../../app/services/user.service';
//import { GetFirstCharacter } from './../../../app/pipes/get-first-character.pipe';
//import { ConvertLengthTitle } from './../../../app/pipes/convert-length-title.pipe';
//import { SafeHtmlPipe } from './../../../app/pipes/safe-html.pipe';
//import * as $ from 'jquery';

@Component({
  selector: 'page-ticket-detail',
  templateUrl: 'ticket-detail.html'
})
export class TicketDetailPage {
  @ViewChild('actionSheet') actionSheet: Select;
	status:any=[
      { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
      { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
      { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
      { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false }
  	];
  assign='';
  avatar='';
  countChange = 0;
  priority:any=[];
	ticketDetail:any=[];
  ticketInfo:any={};
  ticketUpdate:any={};
  ticketUpdateDetail:any={};
	ticketParams = {
     assign_agent:'',
     assign_team:'',
     requester:'',
     requester_type:'',
     title:'', 
     priority:0,
     status:'',
     category:'',
  }
  ticketDefault={
    priority:0,
    status:'',
    agent_name:'',
    team_name:'',
    assign_agent:0,
    assign_team:0,
  }
  //ticketDefault=[];
  reChoose = false;
  show = false;
  requesterName = '';
  loading = false;
  content = '';
  urlFile ='';
  contentCompact = ''; 
  constructor(
  	public navCtrl: NavController,
  	private _ticketService: TicketService,
    private _settingService: SettingService,
  	private modalCtrl : ModalController,
    private navParamsCtrl : NavParams,
    private toastCtrl: ToastController,
  	){
    this.urlFile = this._settingService._baseUrl+'/public/upload/';
  }
  ionViewWillLoad() {
    this._ticketService.getPriority().subscribe(res=>{
      this.priority = res;
    })
    this.initTicketDetail();
  }
  initTicketDetail(){
     let navData = (this.navParamsCtrl.get('data'));
    //console.log(navData.id);
    this.loading = true;
    this._ticketService.getTicketDetail(navData).subscribe(res=>{
      this.ticketInfo = res.success;
      this.ticketDefault.priority = res.success.priority;
      this.ticketDefault.status = res.success.status;
      this.ticketDefault.agent_name = res.success.agent_name;
      this.ticketDefault.team_name = res.success.team_name;
      this.ticketDefault.assign_agent = res.success.assign_agent;
      this.ticketDefault.assign_team = res.success.assign_team;
      if(typeof this.ticketInfo.agent_name !='undefined'){
        this.assign = this.ticketInfo.agent_name;
        this.avatar = '#4F4F4F';
      }
      else if(typeof this.ticketInfo.team_name != 'undefined'){
        this.assign = this.ticketInfo.team_name;
        this.avatar = '#2979ff';
      }
      if(this.ticketInfo.request != null){
        this.requesterName = this.ticketInfo.request;
      }
      this.ticketDetail = res.detail;
      this.loading = false;
    });
  }
  openModalAssign() {
    let data = {selected_teamId:this.ticketInfo.assign_team,selected_memberId:this.ticketInfo.assign_agent};
    let contactModal = this.modalCtrl.create(ModalAssign,{data:data});
    contactModal.onDidDismiss(data=>{
      if(data!=null && typeof data != undefined){
        if(this.ticketInfo.assign_team==data.assign_team.team_id){
          if(data.assign_agent.id!=''){
            this.ticketUpdate['assign_agent']=data.assign_agent.id;
            this.assign = data.assign_agent.name;
            this.avatar = '#4F4F4F';
            this.reChoose = true;
            //chọn user trong team hiện tại
          }else{
            console.log('không chọn agent');
          }
        }
        else{
          if(data.assign_agent.id!=''){
            this.ticketUpdate['assign_agent']=data.assign_agent.id;
            this.assign = data.assign_agent.name;
            this.ticketUpdate['assign_team']=data.assign_team.team_id;
            this.reChoose = true;
            this.avatar = '#4F4F4F';
            //chọn user xử lý trong team khác
          }
          else{
            this.ticketUpdate['assign_agent']=0;
            this.assign = data.assign_team.team_name;
            this.ticketUpdate['assign_team']=data.assign_team.team_id;
            this.reChoose = true;
            this.avatar = '#2979ff';
            //chọn team xử lý trong team khác
          }
        }
      }
      this.countChange = Object.keys(this.ticketUpdate).length;
    })
    contactModal.present();
   }
   showMore(index,i){
     //console.log(index);
     if(index.compactContent!=''){
       this.ticketDetail[i].showMore=!index.showMore;
     }
   }  
   openActionSheet(){
     this.actionSheet.open();
   }
   changePriority(){
     if(this.ticketDefault.priority!=this.ticketInfo.priority){
        this.ticketUpdate['priority']=this.ticketInfo.priority;
     }
     else{
       delete this.ticketUpdate['priority'];
     }
     this.countChange = Object.keys(this.ticketUpdate).length;
   }
   changeStatus(){
     if(this.ticketDefault.status!=this.ticketInfo.status){
        this.ticketUpdate['status']=this.ticketInfo.status;
     }
     else{
       delete this.ticketUpdate['status'];
     }
     this.countChange = Object.keys(this.ticketUpdate).length;
   }
   reChooseAssign(){
     delete this.ticketUpdate['assign_agent'];
     delete this.ticketUpdate['assign_team'];
     this.ticketInfo.assign_agent = this.ticketDefault.assign_agent;
     this.ticketInfo.assign_team = this.ticketDefault.assign_team;
     this.reChoose = false;
     if(typeof this.ticketInfo.agent_name !='undefined'){
        this.assign = this.ticketInfo.agent_name;
        this.avatar = '#4F4F4F';
      }
      else if(typeof this.ticketInfo.team_name != 'undefined'){
        this.assign = this.ticketInfo.team_name;
        this.avatar = '#2979ff';
      }
     this.countChange = Object.keys(this.ticketUpdate).length;
   }
   onComment(){
    if(this.content!=''){
      this.ticketUpdateDetail['content']=this.content;
    }
    else{
      delete this.ticketUpdateDetail['content']
    }
    this.countChange = Object.keys(this.ticketUpdateDetail).length + Object.keys(this.ticketUpdate).length;
   }
   actionTicket(){
     let ticketId = this.navParamsCtrl.get('data').id;
     this._ticketService.actionTicket({dataTicket:this.ticketUpdate,dataDetail:this.ticketUpdateDetail,ticketId: ticketId}).subscribe(res=>{
         if(res.code==200){
           let success = 'success-toast';
           this.presentToast(res.message,success);
           this.initTicketDetail();
           this.ticketUpdate = {};
           this.ticketUpdateDetail = {};
           this.content = '';
           this.countChange = 0;
         }
         else{
           let fail = 'fail-toast';
           this.presentToast(res.message,fail);
         }
         this.reChoose = false;
     })   
   }
   presentToast(mess,css) {
    let toast = this.toastCtrl.create({
      message: mess,
      duration: 3000,
      position: 'bottom',
      cssClass: css
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }  
}


