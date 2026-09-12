import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegisterModel } from "../models/register.models/register.model";
import { environment } from "../../environments/environment";

export interface ApiMessageResponse {
    message: string;
}

@Injectable()
export class BackendService {
    constructor (
        private http: HttpClient
    ) {

    }

    registerClient(type: string, register: RegisterModel): Observable<ApiMessageResponse> {
        return this.http.post<ApiMessageResponse>(`${environment.backendContext}register/${type}`, register);
    }
}