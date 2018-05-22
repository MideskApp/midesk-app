import { AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController
    ) {}
    // presentAlert(msgContent:string,handleWhenYes:any,handleWhenNo:any){
    //     var alert = this.alertCtrl.create({
    //         message: msgContent,
    //         buttons:[
    //             {
    //                 text: 'Đồng ý',
    //                 handler: handleWhenYes
    //             },
    //             {
    //                 text: 'Hủy',
    //                 handler: handleWhenNo
    //             }
    //         ]
    //     })
    //     alert.present();
    // }
}