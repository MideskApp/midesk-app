import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

//import { SettingService } from './../../common/setting.service';
import { CookieService } from 'angular2-cookie/core';
import { User } from './../../models/user';

export const TOKEN_NAME: string = 'jwt_token';

@Injectable()
export class AuthService {
    private isloggedIn: boolean = false;
    private loggedInUser: any; //User
    constructor(
        public _cookieService: CookieService,
        //public _settingGlobal: SettingService
        ) {
    }

    getToken(): string {
        return this._cookieService.get(TOKEN_NAME);
    }

    setUserAuthenticated(userLogin): boolean {
        if (typeof userLogin.success != 'undefined' && userLogin.success.token != '') {
            this.isloggedIn = true;
            this.loggedInUser = userLogin.success;
            this._cookieService.putObject('curuser', { info: this.loggedInUser.user, user_log: this.loggedInUser.user_log });
            this._cookieService.putObject('curgroup',{ group: this.loggedInUser.group, team: this.loggedInUser.team_info });
            this._cookieService.putObject('priority',{ priority: this.loggedInUser.priority });
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
    getLoggedInUserTeam() {
        if (this._cookieService.getObject('curgroup')) {
            this.loggedInUser = this._cookieService.getObject('curgroup')['team'];
        }
        return this.loggedInUser;
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