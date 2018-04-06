import { Injectable } from '@angular/core';

@Injectable()
export class SettingService {
	public _baseAPIUrl = "http://localhost:8000/api/v1/";
    public _baseUrl= "http://localhost:8000";
    //Authentication
    public _api_auth_login = this._baseAPIUrl + "login";
    public _api_auth_logout = this._baseAPIUrl + "logout";
    //user service
    public _api_requester_getList = this._baseAPIUrl + 'getListRequester';
    public _api_user_getListTeam = this._baseAPIUrl + 'getListTeam';
    public _api_user_getUserInTeam = this._baseAPIUrl + 'getUserInTeam/';
    public _api_requester_search = this._baseAPIUrl + 'searchRequester';
    public _api_assigner_search = this._baseAPIUrl + 'searchAssigner';
    public _api_user_getListUserTeam = this._baseAPIUrl + 'getListUserTeam';
    //
    //ticket service
    public _api_ticket_getList = this._baseAPIUrl + 'getListTicket';
    public _api_ticket_getDetail = this._baseAPIUrl + 'getTicketDetail/';
    public _api_priority_getList = this._baseAPIUrl + 'getPriority';
    public _api_tags_getList = this._baseAPIUrl + 'getTagsByGroup';
    public _api_category_getList = this._baseAPIUrl + 'getTicketCategory/';
    public _api_search_ticket = this._baseAPIUrl + 'searchTicket';
    public _api_create_ticket = this._baseAPIUrl + 'createTicket';
    public _api_action_ticket = this._baseAPIUrl + 'actionTicket';
    //
}