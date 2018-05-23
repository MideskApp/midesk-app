import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

//import { SettingService } from './../../common/setting.service';
import { CookieService } from 'angular2-cookie/core';
import { User } from './../../models/user';
import { FCM } from '@ionic-native/fcm';
//import { UserService } from '../user.service';

//import { SocketIoModule, SocketIoConfig, Socket } from 'ng-socket-io';

export const TOKEN_NAME: string = 'jwt_token';

@Injectable()
export class AuthService {
    fcm_token:string;
    private isloggedIn: boolean = false;
    private loggedInUser: any; //User
    constructor(
        public _cookieService: CookieService,
        private _fcm: FCM,
        //private _userService: UserService,
        //private _socket: Socket   
        //public _settingGlobal: SettingService
        ) {
        
    }
    initFCMToken(){
        this._fcm.getToken().then(token=>{
            this.fcm_token = token;
        })
    }
    getToken(): string {
        return this._cookieService.get(TOKEN_NAME);
    }
    setUserAuthenticated(userLogin): boolean {
        if (typeof userLogin.success != 'undefined' && userLogin.success.token != '') {
            this.isloggedIn = true;
            this.loggedInUser = userLogin.success;
            if(this.loggedInUser.fcm_token==0){
                this.initFCMToken();
                this._cookieService.put('fcm_token',this.fcm_token);
            }else{
                this._cookieService.put('fcm_token',this.loggedInUser.fcm_token);
            }
            this._cookieService.putObject('curuser', { info: this.loggedInUser.user, user_log: this.loggedInUser.user_log });
            //this._cookieService.putObject('curgroup',{ extension: this.loggedInUser.extension ,list_team: this.loggedInUser.list_team, list_agent: this.loggedInUser.list_agent });
            this._cookieService.putObject('priority',{ priority: this.loggedInUser.priority });
            this._cookieService.putObject('room',{room: this.loggedInUser.room});
            
            this._cookieService.put(TOKEN_NAME, this.loggedInUser.token);
        } else {
            console.log('Empty token ---');
            this._cookieService.removeAll();
            this.isloggedIn = false;
        }
        return this.isloggedIn;
    }

    isUserLoggedIn(): boolean {
        if (this.getToken()) {
            this.isloggedIn = true;
        }
        return this.isloggedIn;
    }
    getLoggedInUser(): User {
        if (this._cookieService.getObject('curuser')) {
            this.loggedInUser = this._cookieService.getObject('curuser')['info'];
        }
        return this.loggedInUser;
    }
    getLoggedInRoom(){
        if (this._cookieService.getObject('room')) {
            this.loggedInUser = this._cookieService.getObject('room')['room'];
        }
        return this.loggedInUser;
    }
    getFCMToken():string{
        return this._cookieService.get('fcm_token');
    }
    getUserLastlogId() {
        if (this._cookieService.getObject('curuser')) {
            return this._cookieService.getObject('curuser')['user_log'].id;
        }
        return 0;
    }
    getPriority(){
        if (this._cookieService.getObject('priority')) {
            this.loggedInUser = this._cookieService.getObject('priority')['priority'];
        }
        return this.loggedInUser;
    }

    logoutUser(): void {
        this._cookieService.removeAll();
        localStorage.clear();
        // console.log(this._cookieService.getAll());
        this.isloggedIn = false;
    }
} 