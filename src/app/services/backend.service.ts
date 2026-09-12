import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegisterModel } from "../models/register.models/register.model";
import { environment } from "../../environments/environment";

@Injectable()
export class BackendService {
    constructor (
        private http: HttpClient
    ) {

    }

    registerClient(type: string, register: RegisterModel): Observable<string> {
        return this.http.post<string>(`${environment.backendContext}register/${type}`, register);
    }
}