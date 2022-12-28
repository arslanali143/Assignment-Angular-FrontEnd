import { BaseClass } from "./BaseModel";
import { Address } from "./Address";

export class Customer extends BaseClass {
    ID?:number;
    firstName!: string;
    lastName!: string;
    email!: string;
    emailConfirm!: string;
    Addresses!: Address[];
    constructor(ID : number, firstName: string, lastName: string, email: string, emailConfirm: string){
        super()
        this.ID = ID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.emailConfirm = emailConfirm;
    }
}