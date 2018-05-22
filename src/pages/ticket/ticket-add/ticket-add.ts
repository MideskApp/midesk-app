import { Component} from '@angular/core';
import { NavController, NavParams, ModalController, PopoverController,ToastController, LoadingController, AlertController  } from 'ionic-angular';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { File } from '@ionic-native/file';
import { AuthService } from './../../../services/authentication/auth.service';
import { TicketService } from './../../../services/ticket.service';
import { ModalAssign } from'./../../../components/modal/modal-assign/modal-assign';
import { ModalRequester } from './../../../components/modal/modal-requester/modal-requester';
import { ModalProperties } from './../../../components/modal/modal-properties/modal-properties';
import { PopoverCategory } from './../../../components/popover/popover-category/popover-category';
import { PopoverStatus } from './../../../components/popover/popover-status/popover-status';
import { PopoverPriority } from './../../../components/popover/popover-priority/popover-priority';
import { TicketDetailPage} from './../ticket-detail/ticket-detail';


@Component({
  selector: 'page-ticket-add',
  templateUrl: 'ticket-add.html'
})
export class TicketAddPage {
  page = 1;
  ticketParams = {
     assign_agent:'',
     assign_team:'',
     requester:'',
     requester_type:'',
     title:'', 
     priority:'',
     status:'',
     category:'',
     file:null,
     content:'',
  }
  filterCategory={
    dataItems:[],
    dataChoose:[],
    selected:0,
    loadMore:false,
    dataChildItems:{},
  }
  privateNote:any = 0;
  priority:any={};
  status:any={};
  categoryName = '';
  requesterName = '';
  assign = '';
  cateId = 0;
  fileName='';
  submitCreate = false;
  avatar='';
  constructor(
  	public navCtrl: NavController,
    private navParams: NavParams,
  	private _ticketService: TicketService,
  	private modalCtrl : ModalController,
    private popoverCtrl : PopoverController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private _authService: AuthService
  	){
  }
  ionViewWillLoad(){
    this.priority = this._authService.getPriority();
    let navData = this.navParams.get('data');
    if(navData != null && typeof navData != undefined){
        this.requesterName = navData.requesterName;
        this.ticketParams.requester = navData.requester;
        this.ticketParams.requester_type = navData.requester_type;
    }
  }
  changeCategory(){
    console.log(this.filterCategory.selected);
    this._ticketService.getTicketCategory(this.filterCategory.selected).subscribe(res=>{
      if(res.data!=null){
        console.log(res.data);
        this.filterCategory.dataChildItems = res.data;
      }
    });
    //this.filterCategory.dataChoose.push()
  }
  openModalRequester(){
    let requesterModal = this.modalCtrl.create(ModalRequester,{data:this.ticketParams.requester});
    requesterModal.onDidDismiss(data=>{
      if(!data.cancel){
        this.requesterName = data.requester.name;
        this.ticketParams.requester = data.requester.id;
        this.ticketParams.requester_type = data.requester.level;
      }
    })
    requesterModal.present();
  }
  openModalAssign() {
    let data = {selected_teamId:this.ticketParams.assign_team,selected_memberId:this.ticketParams.assign_agent};
    let contactModal = this.modalCtrl.create(ModalAssign,{data:data});
    contactModal.onDidDismiss(data=>{
      if(data!=null && typeof data != undefined){
        if(data.assign_agent.id==''){
          this.assign = data.assign_team.team_name;
          this.ticketParams.assign_team = data.assign_team.team_id;
          //this.avatar = '#2979ff';
          this.avatar = data.assign_team.color;
        }else{
          this.assign = data.assign_agent.name;
          this.ticketParams.assign_team = data.assign_team.team_id;
          this.ticketParams.assign_agent = data.assign_agent.id;
          //this.avatar = '#4F4F4F';
          this.avatar = data.assign_agent.color;
        }
      }
    })
    contactModal.present();
 	}
  openPopoverStatus(){
    let popoverStatus = this.popoverCtrl.create(PopoverStatus,{data:this.ticketParams.status},{cssClass:"custom-status",enableBackdropDismiss:true})
    popoverStatus.onDidDismiss(data=>{
      if(data!=null && typeof data!=undefined){
        this.ticketParams.status = data.status.value;
        this.status = data.status;
      }
    })
    popoverStatus.present();
  }
  openPopoverPriority(){
    let popoverPriority = this.popoverCtrl.create(PopoverPriority,{data:this.ticketParams.priority},{cssClass:"custom-priority",enableBackdropDismiss:true})
    popoverPriority.onDidDismiss(data=>{
      if(data!=null && typeof data!=undefined){
       this.ticketParams.priority = data.priority.id;
       this.priority = data.priority;
      }
    })
    popoverPriority.present();
  }
  openPopoverCategory(){
    let categoryPopover = this.popoverCtrl.create(PopoverCategory,{data:[]},{cssClass:"custom-popup",enableBackdropDismiss:false});
    categoryPopover.onDidDismiss(data=>{
      if(!data.cancel){
        this.ticketParams.category='';
        this.categoryName='';
        console.log(data);
          for(let i = 0; i<data.data.length;i++){
            //this.ticketParams.category+=data.data[i].id+',';
            this.categoryName +=data.data[i].name+'/';
          }
          //this.ticketParams.category = data.data[data.data.length-1].id;
      }
    })
    categoryPopover.present();
  }
  openModalProperties(){
    let propertiesModal = this.modalCtrl.create(ModalProperties);
    propertiesModal.onDidDismiss(data=>{
      if(typeof data!= undefined && data!=null){
          this.ticketParams.category = data.category;
      }
    })
    propertiesModal.present();
  }
  onChangeUpload($event){
    this.ticketParams.file = $event.target.files[0];
    this.fileName = $event.target.files[0].name;
  }
  createTicket(){
    console.log(this.ticketParams.category);
    //this.ticketParams.category=this.ticketParams.category.slice(0,this.ticketParams.category.length-1);
    // let loader = this.loadingCtrl.create({
    //   content: "Vui lòng chờ...",
    // });
    // console.log(this.ticketParams);
    // var formData = new FormData();
    // formData.append('title',this.ticketParams.title);
    // formData.append('assign_agent',this.ticketParams.assign_agent);
    // formData.append('assign_team',this.ticketParams.assign_team);
    // formData.append('priority',this.ticketParams.priority);
    // formData.append('requester',this.ticketParams.requester);
    // formData.append('requester_type',this.ticketParams.requester_type);
    // formData.append('status',this.ticketParams.status);
    // formData.append('content',this.ticketParams.content);
    // formData.append('private',this.privateNote);
    // if(this.ticketParams.file!=null){
    //   //var file:File = this.ticketParams.file;
    //   formData.append('file',this.ticketParams.file,this.ticketParams.file.name);
    // }
    // loader.present().then(()=>{
    //     this._ticketService.createTicket(formData).subscribe(res=>{
    //     loader.dismiss();
    //     if(res.code==200){
    //       this.presentToast(res.message,'success-toast');
    //       this.resetInput();
    //       var seft = this;
    //       setTimeout(function(){
    //         let presentAlert = seft.alertCtrl.create({
    //         subTitle:'Bạn có muốn đến phiếu vừa tạo không?',
    //         buttons:[
    //           {
    //             text: 'Cancel',
    //           },
    //           {
    //             text: 'OK',
    //             handler: data=>{

    //               seft.navCtrl.push(TicketDetailPage,{data:res.data.ticket});
    //             }
    //           }
    //         ]
    //       })
    //       presentAlert.present();
    //       },1500);
    //     }
    //     else this.presentToast(res.message,'fail-toast');
    //   });
    // })
  }
  clearAssign(){
    this.ticketParams.assign_agent = '';
    this.ticketParams.assign_team = '';
    this.assign= '';
  }
  clearRequester(){
    this.ticketParams.requester = '';
    this.requesterName = '';
  }
  presentToast(mess,css) {
    let toast = this.toastCtrl.create({
      message: mess,
      duration: 2000,
      position: 'bottom',
      cssClass: css
    });
    toast.present();
  }
  resetInput(){
    this.ticketParams = {
     assign_agent:'',
     assign_team:'',
     requester:'',
     requester_type:'',
     title:'', 
     priority:'',
     status:'',
     category:'',
     file:null,
     content:'',
    }
    this.clearAssign();
    this.clearRequester();
  } 
}


