import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { UserService } from './../../../../app/services/user.service';

/**
 * Generated class for the ModalRequesterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'modal-requester',
  templateUrl: 'modal-requester.html',
})
export class ModalRequester {
  requesters = [];
  selected_requester={
    id:0,
    name:'',
    picture:'',
    level:'',
    phone:'',
    email:'',
  };
  selected_requesterId = 0;
  loading = false;
  modelSearchRequester = {
    text:'',
    dataItems:[],
  };
  modelRequester={
    dataItems:[],
    dataPage:1,
    dataTotal:0,
    loadMore:false,
    searchText:'',
  };
  modelSearch={
    dataItems:[],
    dataPage:1,
    dataTotal:0,
    loadMore:false,
    searchText:'',
    dataLoading:true,
  };
  constructor(
  	public navParams: NavParams, 
  	private viewCtrl: ViewController,
  	private _userService: UserService) {
  }
  closeModal(){
      this.viewCtrl.dismiss({cancel:true});
  }
  ionViewWillLoad() {
    let data = this.navParams.get('data');
    // console.log(data);
    this.selected_requesterId = data;
    // this.selected_memberId = data.selected_memberId;
    // this.selected_teamId = data.selected_teamId;
    this.loading = true;
    this._userService.getListRequester(this.modelRequester).subscribe(res=>{
        //this.requesters = res.data;
        this.modelRequester.dataItems = res.data;
        if(res.next_page_url!==null) this.modelRequester.loadMore = true;
        else this.modelRequester.loadMore = false;
        this.loading = false;
    });
  }
  doInfinite(infiniteScroll){
  	this.modelRequester.dataPage += 1;
  	this._userService.getListRequester(this.modelRequester).subscribe(res=>{
  		this.modelRequester.dataItems.push(...res.data);
      if(res.next_page_url!==null) this.modelRequester.loadMore = true;
      else this.modelRequester.loadMore = false;
  		infiniteScroll.complete();
  	})
  }
  onSearchRequester($event){
    if($event.keyCode==13){
      this.loading = true;
      this.modelRequester.dataPage = 1;
      this._userService.getListRequester(this.modelRequester).subscribe(res=>{
        this.modelRequester.dataItems = res.data;
        this.modelRequester.dataTotal = res.total;
        if(res.next_page_url!==null) this.modelRequester.loadMore = true;
        else this.modelRequester.loadMore = false; 
        this.loading = false;
      })
    }
  }
  selectRequester(index){
    this.selected_requester = index;
    this.selected_requesterId = index.id;
    this.viewCtrl.dismiss({'requester':this.selected_requester});
  }
  clearSearch(){
    this.loading = true;
    this.modelRequester.searchText = '';
    this.modelRequester.dataTotal = 0;
    this.modelRequester.dataPage = 1;
    this._userService.getListRequester(this.modelRequester).subscribe(res=>{
        this.modelRequester.dataItems = res.data;
        if(res.next_page_url!==null) this.modelRequester.loadMore = true;
        else this.modelRequester.loadMore = false; 
        this.loading = false;
    })
  }
  onCancel($event){
    this.loading = true;
    this.modelRequester.dataTotal = 0;
    this.modelRequester.searchText = '';
    this.modelRequester.dataPage = 1;
    this._userService.getListRequester(this.modelRequester).subscribe(res=>{
        this.modelRequester.dataItems = res.data;
        if(res.next_page_url!==null) this.modelRequester.loadMore = true;
        else this.modelRequester.loadMore = false; 
        this.loading = false;
    })
  }
}
