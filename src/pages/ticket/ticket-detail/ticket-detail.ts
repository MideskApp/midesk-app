import { Component } from '@angular/core';
import { NavParams, NavController, ModalController, PopoverController, AlertController, ActionSheetController } from 'ionic-angular';
import { TicketService } from './../../../services/ticket.service';
import { ModalAssign } from'./../../../components/modal/modal-assign/modal-assign';
import { SettingService } from './../../../common/setting.service';
import { AuthService} from './../../../services/authentication/auth.service';
import { PopoverPriority } from './../../../components/popover/popover-priority/popover-priority';
import { PopoverStatus } from './../../../components/popover/popover-status/popover-status';
import { ModalMacro } from '../../../components/modal/modal-macro/modal-macro';
import { DataService } from '../../../common/data.service';
import { MessageService } from '../../../common/message.service';

@Component({
  selector: 'page-ticket-detail',
  templateUrl: 'ticket-detail.html'
})
export class TicketDetailPage {
	status:any=[
      { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
      { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
      { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
      { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false }
  ];
  checkStatus={
    new: { id : 1, name : 'Mở mới', value : 'new', color : '#C8C800', alias: 'n', checked: false  },
    open: { id : 2, name : 'Đang mở', value : 'open', color : '#C80000', alias: 'o', checked: false },
    pending: { id : 3, name : 'Đang chờ', value : 'pending', color : '#15BDE9', alias: 'p', checked: false },
    solved: { id : 4, name : 'Đã xử lý', value : 'solved', color : '#CCCCCC', alias: 's', checked: false }
  };
  checkPriority:any;
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
  statusDefault:any={
    name:'',
    alias:'',
    value:''
  };
  priorityDefault:any={
    name:'',
    color:''
  };
  privateNote = 0;
  reChoose = false;
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
    private _authService: AuthService,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private actsheetCtrl: ActionSheetController,
    private _dataService: DataService,
    private _msgService: MessageService
  	){
    this.urlFile = this._settingService._baseUrl+'/public/upload/';
    // let loader = this.loadingCtrl.create({
    //   duration:100
    // });
    // loader.present();
    _dataService.createLoading({duration:100}).present();
  }
  ionViewWillLoad() {
    this.priority = this._authService.getPriority();
    this.checkPriority = this.priority;
    this.initTicketDetail();
  }
  initTicketDetail(){
    let navData = (this.navParamsCtrl.get('data'));
    this._ticketService.getTicketDetail(navData).subscribe(res=>{
      console.log(res.success);
      if(res.code == 200){
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
        for(let i=0;i<this.status.length;i++){
          if(this.ticketDefault.status==this.status[i].value){
            this.statusDefault = this.status[i];
            break;
          }
        }
        for(let i=0;i<this.priority.length;i++){
          if(this.ticketDefault.priority==this.priority[i].id){
            this.priorityDefault = this.priority[i];
            break;
          }
        }
        this.ticketDetail = res.detail;
        }
        else{
          let alert = this.alertCtrl.create({
            subTitle:'Không tìm thấy phiếu',
            buttons:[{
              text:'Quay lại',
              handler: data=>{
                this.navCtrl.pop();
              }
            }],
            enableBackdropDismiss:false
          })
          alert.present();
        }
    });
  }
  openModalAssign() {
    let data = {selected_teamId:this.ticketInfo.assign_team,selected_memberId:this.ticketInfo.assign_agent};
    let contactModal = this.modalCtrl.create(ModalAssign,{data:data});
    contactModal.onDidDismiss(data=>{
      if(data!=null && typeof data != undefined){
        console.log(data);
        if(this.ticketInfo.assign_team==data.assign_team.team_id){
          if(data.assign_agent.id!=''){
            this.ticketUpdate['assign_agent']=data.assign_agent.id;
            this.assign = data.assign_agent.name;
            this.avatar = data.assign_agent.color;
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
            this.avatar = data.assign_agent.color;
            //chọn user xử lý trong team khác
          }
          else{
            this.ticketUpdate['assign_agent']=0;
            this.assign = data.assign_team.team_name;
            this.ticketUpdate['assign_team']=data.assign_team.team_id;
            this.reChoose = true;
            this.avatar = data.assign_team.color;
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
   openMacro(){
    let macroModal = this.modalCtrl.create(ModalMacro);
    macroModal.present();
   }  
   openActionSheet(){
    let action:any;
    if(this.ticketInfo.is_delete == 0){
      action = this.actsheetCtrl.create({
        buttons: [
          {
            text: 'Theo dõi phiếu',
            icon: 'logo-rss',
            handler: () => {
              this._dataService.createToast('Đã theo dõi',2000,'success-toast');
            }
          },
          {
            text: 'Hủy theo dõi',
            icon: 'logo-rss',
            handler: () => {
              this._dataService.createToast('Đã theo dõi',2000,'fail-toast');
            }
          },
          {
            text: 'Xóa phiếu',
            icon: 'trash',
            handler: () => {
              this.presentAlert();
            }
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    }else if(this.ticketInfo.is_delete == 1){
      action = this.actsheetCtrl.create({
        buttons: [
          {
            text: 'Xóa vĩnh viễn',
            icon: 'trash',
            handler: () => {
              alert('Tính năng đang phát triển');
            }
          },
          {
            text: 'Phục hồi phiếu',
            icon: 'refresh',
            handler: () => {
              this.presentAlert();
            }
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    }
    action.present();
   }
   changePriority(){
    let popoverPriority = this.popoverCtrl.create(PopoverPriority,{data:this.ticketInfo.priority},{cssClass:"custom-priority",enableBackdropDismiss:true})
    popoverPriority.onDidDismiss(data=>{
      if(data!=null && typeof data!=undefined){
       this.ticketInfo.priority = data.priority.id;
       this.priorityDefault = data.priority;
       if(this.ticketDefault.priority!=data.priority.id){
        this.ticketUpdate['priority']=this.ticketInfo.priority;
       }
       else{
         delete this.ticketUpdate['priority'];
       }
      }
      this.countChange = Object.keys(this.ticketUpdate).length;
    })
    popoverPriority.present();
     
   }
   changeStatus(){
    let popoverStatus = this.popoverCtrl.create(PopoverStatus,{data:this.ticketInfo.status},{cssClass:"custom-status",enableBackdropDismiss:true})
    popoverStatus.onDidDismiss(data=>{
      if(data!=null && typeof data!=undefined){
       this.ticketInfo.status = data.status.value;
       this.statusDefault = data.status;
       if(this.ticketDefault.status!=data.status.value){
        this.ticketUpdate['status']=this.ticketInfo.status;
       }
       else{
         delete this.ticketUpdate['status'];
       }
      }
      this.countChange = Object.keys(this.ticketUpdate).length;
    })
    popoverStatus.present();
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
     let loader = this._dataService.createLoading({content:this._msgService._msg_loading});
     loader.present();
     this._ticketService.actionTicket({dataTicket:this.ticketUpdate,dataDetail:this.ticketUpdateDetail,ticketId: ticketId, private:this.privateNote}).subscribe(res=>{
         loader.dismiss();
         if(res.code==200){
           this._dataService.createToast(res.message,2000,'success-toast');
          //  let success = 'success-toast';
          //  this.presentToast(res.message,success);
           this.initTicketDetail();
           this.ticketUpdate = {};
           this.ticketUpdateDetail = {};
           this.content = '';
           this.countChange = 0;
         }
         else{
          //  let fail = 'fail-toast';
          //  this.presentToast(res.message,fail);
           this._dataService.createToast(res.message,2000,'fail-toast');
         }
         this.reChoose = false;
     })   
   }
  //  presentToast(mess,css) {
  //   let toast = this.toastCtrl.create({
  //     message: mess,
  //     duration: 3000,
  //     position: 'bottom',
  //     cssClass: css
  //   });
  //   toast.onDidDismiss(() => {
  //     console.log('Dismissed toast');
  //   });
  //   toast.present();
  // }
  presentAlert(){
    // let alert = this.alertCtrl.create({
    //   message:'Are you sure?',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => {
    //       }
    //     },
    //     {
    //       text: 'Oke',
    //       handler: data => {
    //         this.trashOrResolveTicket();
    //       }
    //     }
    //   ]
    // })
    // alert.present();
    let alert = this._dataService.createAlertWithHandle(this._msgService._msg_ticket_confirm);
    alert.present();
    alert.onDidDismiss(data=>{
      if(data){
        this.trashOrResolveTicket();
      }
    })
  }
  trashOrResolveTicket(){
    let id = this.navParamsCtrl.get('data').id;
    console.log(id);
    this._ticketService.trashOrResolveTicket(id).subscribe(res=>{
      if(res.code==200){
        this.initTicketDetail();
        //this.presentToast('Cập nhật thành công','success-toast');
        this._dataService.createToast(this._msgService._msg_update_success,2000,'success-toast');
        this._dataService.publishEvent('UPDATE TICKET');
        //this._event.publish('UPDATE TICKET');
      }
    });
  }
  ionViewWillEnter(){
    let self = this;
    this._dataService.listenEvent('MACRO').subscribe(data=>{
        if(data['assignName']!='') {
            this.assign = data['assignName'];
            this.avatar = '#4F4F4F';
        }
        else{
            if(data['teamName']!=''){
                this.assign = data['teamName'];
                this.avatar = '#2979ff';
            } 
        }
        Object.keys(data['dataMacro']).forEach(function(key) {
            if(key == 'private' || key == 'public'){
              self.privateNote = data['dataMacro'][key];
              self.ticketUpdateDetail['content'] = data['dataMacro']['content'];
              self.content = data['dataMacro']['content'];
            }
            else if(key == 'status'){
              if(self.ticketInfo.status != data['dataMacro'][key]){
                self.status = self.checkStatus[data['dataMacro'][key]];
                self.statusDefault = self.status;
                self.ticketInfo.status = data['dataMacro'][key];
                self.ticketUpdate[key] = data['dataMacro'][key];
              }
            }else if(key == 'priority'){
              if(self.ticketInfo.priority!= data['dataMacro'][key]){
                self.ticketUpdate[key] = data['dataMacro'][key];
                self.priority = self.checkPriority[data['dataMacro'][key]-1];
                self.priorityDefault = self.priority;
                self.ticketInfo.priority = data['dataMacro'][key];
              }
            }else if(key == 'assign_agent'){
              if(self.ticketInfo.assign_agent != data['dataMacro'][key]){
                self.ticketUpdate[key] = data['dataMacro'][key];
              }
            }else if(key == 'assign_team'){
              if(self.ticketInfo.assign_team != data['dataMacro'][key]){
                self.ticketUpdate[key] = data['dataMacro'][key];
              }
            }
        });
        self.countChange = Object.keys(self.ticketUpdate).length + Object.keys(self.ticketUpdateDetail).length; 
    })
    // this._event.subscribe('MACRO',data=>{
    //   if(data.assignName!='') {
    //     this.assign = data.assignName;
    //     this.avatar = '#4F4F4F';
    //   }
    //   else{
    //     if(data.teamName!=''){
    //       this.assign = data.teamName;
    //       this.avatar = '#2979ff';
    //     } 
    //   }
    //   console.log(data.dataMacro);
    //   Object.keys(data.dataMacro).forEach(function(key) {
    //     if(key == 'private' || key == 'public'){
    //       self.privateNote = data.dataMacro[key];
    //       self.ticketUpdateDetail['content'] = data.dataMacro['content'];
    //       self.content = data.dataMacro['content'];
    //     }
    //     else if(key == 'status'){
    //       if(self.ticketInfo.status != data.dataMacro[key]){
    //         self.status = self.checkStatus[data.dataMacro[key]];
    //         self.statusDefault = self.status;
    //         self.ticketInfo.status = data.dataMacro[key];
    //         self.ticketUpdate[key] = data.dataMacro[key];
    //       }
    //     }else if(key == 'priority'){
    //       if(self.ticketInfo.priority!= data.dataMacro[key]){
    //         self.ticketUpdate[key] = data.dataMacro[key];
    //         self.priority = self.checkPriority[data.dataMacro[key]-1];
    //         self.priorityDefault = self.priority;
    //         self.ticketInfo.priority = data.dataMacro[key];
    //       }
    //     }else if(key == 'assign_agent'){
    //       if(self.ticketInfo.assign_agent != data.dataMacro[key]){
    //         self.ticketUpdate[key] = data.dataMacro[key];
    //       }
    //     }else if(key == 'assign_team'){
    //       if(self.ticketInfo.assign_team != data.dataMacro[key]){
    //         self.ticketUpdate[key] = data.dataMacro[key];
    //       }
    //     }
    //   });
    //   console.log(self.ticketUpdate);
    //   self.countChange = Object.keys(self.ticketUpdate).length + Object.keys(self.ticketUpdateDetail).length;
    // })
  }
}


