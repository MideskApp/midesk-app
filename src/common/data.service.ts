import { AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { NumberFormatStyle } from '@angular/common';

@Injectable()
export class DataService {
    constructor(
        public alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController
    ) {}
    createAlertWithHandle(msgContent:string){
        var alert = this.alertCtrl.create({
            message: msgContent,
            buttons:[
                {
                    text: 'Hủy',
                    handler: () => {
                       alert.dismiss(false);
                       return false;
                    }
                },
                {
                    text: 'Đồng ý',
                    handler: () => {
                        alert.dismiss(true);
                        return false;
                    }
                }
            ]
        })
        return alert;
    }
    createAlertWithoutHandle(msgContent:string){
        let alert = this.alertCtrl.create({
            message: msgContent,
            buttons: [{text: 'Đóng'}]
        })
        alert.present();
    }
}