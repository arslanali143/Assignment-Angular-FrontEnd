import { Validators } from "@angular/forms";

export class phones {
    ID?:number;
    phone!: string;
}

export class addresses {
    ID?:number;
    addressType!: string;
    address1!: string;
    address2!: string;
    city!: string;
    zipCode!: string;
    state!: string;
    phones!: phones[];
}

export class ICustomer {
    ID?:number;
    firstName!: string;
    lastName!: string;
    email!: string;
    emailConfirm!: string;
    addresses!: addresses[];
}
enum EntityState
    {
        Detached = 1,
        Unchanged = 2,
        Added = 4,
        Deleted = 8,
        Modified = 16
    }