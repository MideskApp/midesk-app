import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

//import { SettingService } from './../../common/setting.service';
import { CookieService } from 'angular2-cookie/core';
import { User } from './../../models/user';

//import { SocketIoModule, SocketIoConfig, Socket } from 'ng-socket-io';

export const TOKEN_NAME: string = 'jwt_token';

@Injectable()
export class AuthService {
    private isloggedIn: boolean = false;
    private loggedInUser: any; //User
    constructor(
        public _cookieService: CookieService,
        //private _socket: Socket   
        //public _settingGlobal: SettingService
        ) {
    }

    getToken(): string {
        return this._cookieService.get(TOKEN_NAME);
    }
    // connectSocket(){
    //     const config: SocketIoConfig = { url: 'https://michat.mitek.vn:3007/?group=' + this.getLoggedInUser().groupid };
    //      SocketIoModule.forRoot(config);
    //       this._socket.connect();
    //       this._socket.on('connect',function(data){
    //         this._socket.emit('room', {
    //           'room' : this.getLoggedInUser().groupid, 
    //           'fullname' : this.getLoggedInUser().firstname+' '+this.getLoggedInUser().lastname, 
    //           'accountid' : this.getLoggedInUser().id, 
    //           'array_agent' : this.getLoggedInListAgent(), 
    //           'array_team' : this.getLoggedInListTeam(), 
    //           'exten' : (this.getLoggedInExtension()?this.getLoggedInExtension():'9999999') 
    //         });
    //       });
    // }
    setUserAuthenticated(userLogin): boolean {
        if (typeof userLogin.success != 'undefined' && userLogin.success.token != '') {
            this.isloggedIn = true;
            this.loggedInUser = userLogin.success;
            this._cookieService.putObject('curuser', { info: this.loggedInUser.user, user_log: this.loggedInUser.user_log });
            this._cookieService.putObject('curgroup',{ extension: this.loggedInUser.extension ,list_team: this.loggedInUser.list_team, list_agent: this.loggedInUser.list_agent });
            this._cookieService.putObject('priority',{ priority: this.loggedInUser.priority });
            this._cookieService.put(TOKEN_NAME, this.loggedInUser.token);
            //this.connectSocket();
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
    // getRedirectUrl(): string {
    //     return this.redirectUrl;
    // }

    // setRedirectUrl(url: string): void {
    //     this.redirectUrl = url;
    // }

    // getLoginUrl(): string {
    //     return this.loginUrl;
    // }

    getLoggedInUser(): User {
        if (this._cookieService.getObject('curuser')) {
            this.loggedInUser = this._cookieService.getObject('curuser')['info'];
        }
        return this.loggedInUser;
    }
    getLoggedInListTeam(){
        if (this._cookieService.getObject('curgroup')) {
            this.loggedInUser = this._cookieService.getObject('curgroup')['list_team'];
        }
        return this.loggedInUser;
    }
    getLoggedInListAgent(){
        if (this._cookieService.getObject('curgroup')) {
            this.loggedInUser = this._cookieService.getObject('curgroup')['list_agent'];
        }
        return this.loggedInUser;
    }
    getLoggedInExtension(){
        if (this._cookieService.getObject('curgroup')) {
            this.loggedInUser = this._cookieService.getObject('curgroup')['extension'];
        }
        return this.loggedInUser;
    }
    // getLoggedInUserTeam() {
    //     if (this._cookieService.getObject('curgroup')) {
    //         this.loggedInUser = this._cookieService.getObject('curgroup')['team'];
    //     }
    //     return this.loggedInUser;
    // }
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