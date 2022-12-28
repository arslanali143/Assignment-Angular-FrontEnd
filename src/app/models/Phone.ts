import { BaseClass } from "./BaseModel";

export class Phone extends BaseClass {
    ID?:number;
    phone1!: string;
    addressId!:number;
    IsDeleted:boolean = false
    constructor(ID: number, phone1 : string, addressId:number) {
        super();
        ID= ID;
        phone1 = phone1;
        addressId = addressId;
    }
}