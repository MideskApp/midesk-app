import { Component} from '@angular/core';
import { NavController, ModalController, PopoverController  } from 'ionic-angular';
import { TicketService } from './../../../app/services/ticket.service';
import { ModalAssign } from'./../../ticket/ticket-add/modal-assign/modal-assign';
import { ModalRequester } from './../../ticket/ticket-add/modal-requester/modal-requester';
import { PopoverCategory } from './../../ticket/ticket-add/popover-category/popover-category';
//import { UserService } from './../../../app/services/user.service';
//import { GetFirstCharacter } from './../../../app/pipes/get-first-character.pipe';
//import { ConvertLengthTitle } from './../../../app/pipes/convert-length-title.pipe';

@Component({
  selector: 'page-ticket-add',
  templateUrl: 'ticket-add.html'
})
export class TicketAddPage {
  page = 1;
  ticketParams = {
     // assign_agent:0,
     // assign_team:0,
     // requester:0,
     assign_agent:'',
     assign_team:'',
     requester:'',
     requester_type:'',
     title:'', 
     priority:'',
     status:'',
     category:'',
  }
  filterCategory={
    dataItems:[],
    dataChoose:[],
    selected:0,
    loadMore:false,
    dataChildItems:{},
  }
  categoryName = '';
  requesterName = '';
  assignName = '';
  assignTeam = '';
  cateId = 0;
  newItem = `
    `;  
  constructor(
  	public navCtrl: NavController,
  	private _ticketService: TicketService,
  	private modalCtrl : ModalController,
    private popoverCtrl : PopoverController,
    //private _userService: UserService,
  	){
    //  this._userService.getListRequester().subscribe(res=>{
    //       this.requesters = res.data;
    // });
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
      if(!data.cancel){
        this.assignTeam = data.assign_team.team_name;
        this.ticketParams.assign_team = data.assign_team.team_id;
        this.assignName = data.assign_agent.name;
        this.ticketParams.assign_agent = data.assign_agent.id;
      }
    })
    contactModal.present();
 	}
  openPopoverCategory(){
    let categoryPopover = this.popoverCtrl.create(PopoverCategory,{data:[]},{cssClass:"custom-popup",enableBackdropDismiss:false});
    categoryPopover.onDidDismiss(data=>{
      if(!data.cancel){
        this.ticketParams.category='';
        this.categoryName='';
          for(let i = 0; i<data.data.length;i++){
            this.ticketParams.category+=data.data[i].id+',';
            this.categoryName +=data.data[i].name+' ';
          }
      }else{
        console.log(111212);
      }
    })
    categoryPopover.present();
  }
  createTicket(){
    console.log(this.ticketParams);
    // if(this.ticketParams.file!==null){
    //   var file:File = this.ticketParams.file[0];
    // }
    var formData = new FormData()
    formData.append('title',this.ticketParams.title);
    formData.append('assign_agent',this.ticketParams.assign_agent);
    formData.append('assign_team',this.ticketParams.assign_team);
    formData.append('priority',this.ticketParams.priority);
    formData.append('requester',this.ticketParams.requester);
    formData.append('requester_type',this.ticketParams.requester_type);
    formData.append('status',this.ticketParams.status);
    this._ticketService.createTicket(formData).subscribe(res=>{
      console.log(res);
    });
  }
  clearAssign(){
    this.ticketParams.assign_agent = '';
    this.ticketParams.assign_team = '';
    this.assignTeam = '';
    this.assignName = '';
  }
  clearRequester(){
    this.ticketParams.requester = '';
    this.requesterName = '';
  }
}


