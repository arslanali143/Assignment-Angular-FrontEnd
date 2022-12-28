import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICustomer } from './customer.model';
     
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })

export class CustomerService {

    private apiURL = "https://localhost:44316/api/";

    constructor(private http : HttpClient){}

  getCustomerData(firstName: string, lastName : string) {
      return this.http.get<ICustomer>(`${this.apiURL}Customer/GetCustomer?firstName=${firstName}&lastName=${lastName}`);
  }

    saveCustomerData(data : any){
        return this.http.post(`${this.apiURL}Customer/Save`, data,  {headers: {'Content-Type':  'application/json'}});
    }

    updateCustomerData(data : any, id?: number  ){
      return this.http.put(`${this.apiURL}Customer/${id}`, data,  {headers: {'Content-Type':  'application/json'}});
  }

    errorHandler(error:any) {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
     }
}