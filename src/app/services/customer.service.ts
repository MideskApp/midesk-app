import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
//import { AuthService } from './authentication/auth.service';
//import { User } from './../models/user';
import { SettingService } from './../common/setting.service';

@Injectable()
export class CustomerService {
	constructor(private _http: Http, private _settingGlobal: SettingService) {

    }
    getListCustomer(dataPage:number){
    	return this._http.get(this._settingGlobal._api_customer_getList+dataPage)
    		.map(this.extractData)
    		.catch(this.handleError);
    }
    getCustomerProfile(customerId:number){
        return this._http.get(this._settingGlobal._api_customer_profile+customerId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    updateCustomer(data:any){
        return this._http.put(this._settingGlobal._api_customer_update,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    addCustomer(data:any){
        return this._http.post(this._settingGlobal._api_customer_add,data)
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