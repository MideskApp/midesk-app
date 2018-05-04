import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { NotificationsService } from './../../services/notifications.service';
import { TicketDetailPage } from './../ticket/ticket-detail/ticket-detail';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams, 
  	private _notifyService: NotificationsService,
    private loadingCtrl: LoadingController,
  	) {
  }
  modelNotify={
  	dataItems:[],
  	dataPage:1,
  	dataTotal:0,
    loadMore:false,
    loading:false
  }
  ionViewDidLoad() {
    this.initListNotifications();
  }
  initListNotifications(){
    this.modelNotify.loading = true;
  	this._notifyService.initListNotifications(this.modelNotify.dataPage).subscribe(res=>{
    	this.modelNotify.dataItems = res.data;
    	this.modelNotify.dataTotal = res.total;
      if(res.next_page_url!==null) this.modelNotify.loadMore = true;
      else this.modelNotify.loadMore = false;
      this.modelNotify.loading = false;
    })
  }
  loadMoreNotification(){
    this.modelNotify.dataPage+=1;
    this.modelNotify.loading = true;
    this._notifyService.initListNotifications(this.modelNotify.dataPage).subscribe(res=>{
      this.modelNotify.dataItems.push(...res.data);
      if(res.next_page_url!==null) this.modelNotify.loadMore = true;
      else this.modelNotify.loadMore = false;
      this.modelNotify.loading = false;
    })
  }
  updateViewNotify(index,i){
    let loader = this.loadingCtrl.create({
      spinner:'dots',
    })
    loader.present();
  	this._notifyService.updateViewNotifications(index.id).subscribe(res=>{
  		if(res.code==200){
  			//this.initListNotifications();
        this.modelNotify.dataItems[i].seen = 1;
        //this.events.publish('updateNotify',this.modelNotify.dataTotal);
        loader.dismiss();
  		}
  	})
  }
  deleteViewNotify(index,i){
    let loader = this.loadingCtrl.create({
      spinner:'dots',
    })
    loader.present();
  	this._notifyService.deleteViewNotifications(index.id).subscribe(res=>{
  		if(res.code==200){
  			//this.presentToast(res.message,'success-toast');
        this.modelNotify.dataItems[i].del = 1;
      //this.initListNotifications();
      //this.events.publish('updateNotify',this.modelNotify.dataTotal);
      loader.dismiss();
  		}
  	})
  }
  viewTicketDetail(index,i){
  	let custom = (JSON.parse(index.custom));
    this._notifyService.updateViewNotifications(index.id).subscribe(res=>{
      //this.initListNotifications();
      this.modelNotify.dataItems[i].seen = 1;
    });
    this.navCtrl.push(TicketDetailPage,{data:custom});

  }
  doRefresh(refresher){
    // this.modelNotify.dataPage=1;
    // this.initListNotifications();
    // refresher.complete();
  }
  // presentToast(mess,css) {
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

}
