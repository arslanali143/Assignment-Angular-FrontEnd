import { BaseClass } from "./BaseModel";
import { Phone } from "./Phone";

export class Address extends BaseClass {
    ID?:number;
    addressType!: string;
    address1!: string;
    address2!: string;
    city!: string;
    zipCode!: string;
    state!: string;
    CustomerId!:number;
    IsDeleted:boolean = false;
    Phones!: Phone[];
    constructor(ID:number, addressType: string, address1: string, address2: string, city: string, zipCode: string, state: string, CustomerId:number) {
        super();
        this.ID = ID;
        this.addressType = addressType;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.zipCode = zipCode;
        this.CustomerId = CustomerId;
        
    }
}
