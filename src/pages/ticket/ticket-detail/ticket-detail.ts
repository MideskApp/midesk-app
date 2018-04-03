import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, ModalController, Select, ToastController  } from 'ionic-angular';
import { TicketService } from './../../../app/services/ticket.service';
import { ModalAssign } from'./../../ticket/ticket-add/modal-assign/modal-assign';
//import { ModalRequester } from './../../ticket/ticket-add/modal-requester/modal-requester';
//import { PopoverCategory } from './../../ticket/ticket-add/popover-category/popover-category';
//import { UserService } from './../../../app/services/user.service';
//import { GetFirstCharacter } from './../../../app/pipes/get-first-character.pipe';
//import { ConvertLengthTitle } from './../../../app/pipes/convert-length-title.pipe';
//import { SafeHtmlPipe } from './../../../app/pipes/safe-html.pipe';
import * as $ from 'jquery';

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
  assignName = '';
  assignTeam = '';
  content = '';
  constructor(
  	public navCtrl: NavController,
  	private _ticketService: TicketService,
  	private modalCtrl : ModalController,
    private navParamsCtrl : NavParams,
    private toastCtrl: ToastController,
  	){
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
    this._ticketService.getTicketDetail(navData).subscribe(res=>{
      console.log(res);
      this.ticketInfo = res.success;
      this.ticketDefault.priority = res.success.priority;
      this.ticketDefault.status = res.success.status;
      this.ticketDefault.agent_name = res.success.agent_name;
      this.ticketDefault.team_name = res.success.team_name;
      this.ticketDefault.assign_agent = res.success.assign_agent;
      this.ticketDefault.assign_team = res.success.assign_team;
      if(typeof this.ticketInfo.agent_name !='undefined'){
        this.assignName = this.ticketInfo.agent_name;
      }
      if(typeof this.ticketInfo.team_name != 'undefined'){
        this.assignTeam = this.ticketInfo.team_name;
      }
      if(this.ticketInfo.request != null){
        this.requesterName = this.ticketInfo.request;
      }
      this.ticketDetail = res.detail;
      //this.selected = res.success.priority;
    });
  }
  openModalAssign() {
    let data = {selected_teamId:this.ticketInfo.assign_team,selected_memberId:this.ticketInfo.assign_agent};
    let contactModal = this.modalCtrl.create(ModalAssign,{data:data});
    contactModal.onDidDismiss(data=>{
      if(!data.cancel){
        this.reChoose = true;
        if(this.ticketInfo.assign_team == data.assign_team.team_id){
          if(this.ticketInfo.assign_agent != data.assign_agent.id){
            this.assignName = data.assign_agent.name;
            this.ticketInfo.assign_agent = data.assign_agent.id;
            this.ticketUpdate['assign_agent']=data.assign_agent.id;
          }
          else{
            this.reChoose = false;
          }
        }
        else{
          if(data.assign_agent.id!=''){
            this.ticketUpdate['assign_agent']=data.assign_agent.id;
            this.assignName = data.assign_agent.name;
            this.ticketInfo.assign_agent = data.assign_agent.id;
            this.assignTeam = data.assign_team.team_name;
            this.ticketInfo.assign_team = data.assign_team.team_id;
            this.ticketUpdate['assign_team']= data.assign_team.team_id;
          }
          else{
            this.assignName = '';
            this.ticketInfo.assign_agent = 0; 
            this.assignTeam = data.assign_team.team_name;
            this.ticketInfo.assign_team = data.assign_team.team_id;
            this.ticketUpdate['assign_team']= data.assign_team.team_id;
            this.ticketUpdate['assign_agent']=0;
          }
        }
        // console.log(data);
        // this.reChoose = true;
        // if(data.assign_team.team_id!=0 && data.assign_agent.id==0){
        //   this.assignTeam = data.assign_team.team_name;
        //   this.ticketInfo.assign_team = data.assign_team.team_id;
        //   this.assignName = '';
        //   this.ticketInfo.assign_agent = 0; 
        //   this.ticketUpdate['assign_team']= data.assign_team.team_id;
        //   this.ticketUpdate['assign_agent']=data.assign_agent.id;
        // }
        // else if(data.assign_agent.id!=0 && data.assign_team.team_id!=0){
        //   this.ticketUpdate['assign_agent']=data.assign_agent.id;
        //   this.assignName = data.assign_agent.name;
        //   this.ticketInfo.assign_agent = data.assign_agent.id;
        //   this.assignTeam = data.assign_team.team_name;
        //   this.ticketInfo.assign_team = data.assign_team.team_id;
        //   this.ticketUpdate['assign_team']= data.assign_team.team_id; 
        // }
      }
      this.countChange = Object.keys(this.ticketUpdate).length;
    })
    contactModal.present();
   }
   showMore(index){
     this.show = !this.show;
     if(this.show){
       $('#detail-'+index).css({'display':'block'});
     }
     else{
       $('#detail-'+index).css({'display':'none'});
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
     this.assignTeam = this.ticketDefault.team_name;
     this.ticketInfo.assign_team = this.ticketDefault.assign_team;
     this.assignName = this.ticketDefault.agent_name;
     this.ticketInfo.assign_agent = this.ticketDefault.assign_agent; 
     this.countChange = Object.keys(this.ticketUpdate).length;
     this.reChoose = false;
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
     console.log(this.ticketUpdate);
     // let ticketId = this.navParamsCtrl.get('data').id;
     // console.log(ticketId);
     // this._ticketService.actionTicket({dataTicket:this.ticketUpdate,dataDetail:this.ticketUpdateDetail,ticketId: ticketId}).subscribe(res=>{
     //     if(res.code==200){
     //       let success = 'success-toast';
     //       this.presentToast(res.message,success);
     //       this.initTicketDetail();
     //       this.ticketUpdate = {};
     //       this.ticketUpdateDetail = {};
     //       this.content = '';
     //       this.countChange = 0;
     //     }
     //     else{
     //       let fail = 'fail-toast';
     //       this.presentToast(res.message,fail);
     //     }
     // })   
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


