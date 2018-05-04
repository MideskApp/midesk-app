import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { SettingService } from './../common/setting.service';

@Injectable()
export class NotificationsService {

    constructor(private _http: Http, private _settingGlobal: SettingService) {

    }
    initListNotifications(dataPage:number){
    	return this._http.get(this._settingGlobal._api_notifications_getList+dataPage)//, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateViewNotifications(notifyId:number){
        return this._http.get(this._settingGlobal._api_notifications_updateView+notifyId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    deleteViewNotifications(notifyId:number){
        return this._http.get(this._settingGlobal._api_notifications_deleteView+notifyId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError = (error: any) => {
        if (error.status == 400 || error.status == 401 || error.status == 403) {
            // localStorage.clear();
        }
        else if (error.status == 406) {
            return Observable.of(JSON.parse(error._body));
        }
        return Observable.of([]);
    }
}