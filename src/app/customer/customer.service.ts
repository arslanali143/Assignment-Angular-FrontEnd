import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
     
import { BaseClass } from '../models/BaseModel';
import { Customer } from '../models/Customert';
import { Address } from '../models/Address';
import { Phone } from '../models/Phone';
import { State } from '../models/BaseModel';
import {  Observable, throwError } from 'rxjs';


@Injectable({
    providedIn: 'root',
  })

export class CustomerService {

    private apiURL = "https://localhost:44316/api/";

    constructor(private http : HttpClient){}

  getCustomerData(firstName: string, lastName : string) : Observable<Customer> {
      var data =  this.http.get<Customer>(`${this.apiURL}Customer/GetCustomer?firstName=${firstName}&lastName=${lastName}`);
      return data;
  }

    saveCustomerData(data : Customer){
      data.stateEnum = State.Added;
      // data.Addresses.forEach(a=>a.stateEnum = State.Added);
      // data.Addresses.forEach(a=>a.Phones.forEach(x=>x.stateEnum = State.Added));
        return this.http.post(`${this.apiURL}Customer/Save`, data,  {headers: {'Content-Type':  'application/json'}});
    }

    updateCustomerData(data : Customer, id?: number  ){
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