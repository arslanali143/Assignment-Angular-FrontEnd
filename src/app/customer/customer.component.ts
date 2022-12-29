  import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
  import { CustomerService } from './customer.service';
  import { BaseClass } from '../models/BaseModel';
  import { Customer } from '../models/Customert';
  import { Address } from '../models/Address';
  import { Phone } from '../models/Phone';
  import { State } from '../models/BaseModel';
  import { first } from 'rxjs/operators';

  @Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css']
  })
  export class CustomerComponent implements OnInit, OnChanges {

    myfirstname : string = "";
    mylastname : string = "";
    id?: number = 0;
    isAddMode: boolean = true;
    OutPutData :string = "";


    constructor(private formBuilder : FormBuilder, private customerService : CustomerService) {
      this.form = this.formBuilder.group({
        ID : 0,
        firstName:['Zaib',{
          validators : [Validators.required]
        }],
        lastName: ['Ali',{
          validators : [Validators.required]
        }],
        email:['',{
          validators : [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        }],
        emailConfirm:['',{
          validators : [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        }],
        Addresses: this.formBuilder.array<Address>([])
      }
      , { validator: this.checkEmails }
      );
      this.addAddress();
      this.addCustomerPhone(0);
      this.form.valueChanges.subscribe(a=>{
        a.stateEnum = State.Modified
      });
    }
    ngOnChanges(changes: SimpleChanges): void {
      throw new Error('Method not implemented.');
    }

    form : FormGroup;
    addressForm : FormGroup;
    phoneForm : FormGroup;

    ngOnInit(): void {
      
    
      
      
    }

    checkEmails(group: FormGroup) {
      const em = group.controls['email'].value;
      const emc = group.controls['emailConfirm'].value;
      return em === emc ? null : { notSame: true };
  }


    //Addresses

    Addresses(): FormArray {
      return this.form.get('Addresses') as FormArray;
    }
  
    newAddress() {
      this.addressForm = this.formBuilder.group({
        ID : 0,
        addressType: ['', Validators.required],
        address1: ['', Validators.required],
        address2: '',
        city: ['', Validators.required],
        zipCode: '',
        state: '',
        CustomerId: 0,
        IsDeleted:false,
        Phones:this.formBuilder.array<Phone>([])
    });
    this.addressForm.valueChanges.subscribe(a=>{
      a.stateEnum = State.Modified
    });
      return this.addressForm;
    }
    addAddress(){
      this.Addresses().push(this.newAddress());
      this.addressForm.valueChanges.subscribe(a=>{
        a.stateEnum = State.Added
      });
    }

    deleteAddress(addressIndex: number) {
      if(this.Addresses().at(addressIndex).value.ID == 0){
        this.Addresses().removeAt(addressIndex);
      }else{
        this.Addresses().at(addressIndex).value.IsDeleted = true;
        this.Addresses().at(addressIndex).value.stateEnum = State.Deleted;
      }
      
      
    }
    
    
    //PHONES
    
    customerPhones(custIndex: number): FormArray {
      return this.Addresses().at(custIndex).get('Phones') as FormArray;
    }
  
    newPhone(): FormGroup {
      this.phoneForm = this.formBuilder.group({
        ID:0,
        phone1: '',
        addressId:0,
        IsDeleted:false
      });
      this.phoneForm.valueChanges.subscribe(a=>{
        a.stateEnum = State.Modified
      });
      return this.phoneForm;
    }
  
  //Add Customer Phone
    addCustomerPhone(addressIndex: number) {
      this.customerPhones(addressIndex).push(this.newPhone());
      this.phoneForm.valueChanges.subscribe(a=>{
        a.stateEnum = State.Added
      });
    }
  
    //Remove Customer Phone
    removeCustomerPhone(custIndex: number, phoneIndex: number) {
      if(this.customerPhones(custIndex).at(phoneIndex).value.ID == 0 ){
        this.customerPhones(custIndex).removeAt(phoneIndex, {
        emitEvent  : false
      });
      }else{
        this.customerPhones(custIndex).at(phoneIndex).value.IsDeleted = true;
      this.customerPhones(custIndex).at(phoneIndex).value.stateEnum = State.Deleted;
      }
      
      
    }


    //Get Customer Data

  getCustomer(firstName : string, lastName: string) {
    this.customerService.getCustomerData(firstName,lastName)
    .pipe(first())
    .subscribe(
      (x : Customer) =>{
        x.emailConfirm = x.email;
      this.isAddMode = false,
      this.id = x.ID,
      this.form.patchValue(x),
      (this.form.get('Addresses') as FormArray).clear(); //Initially blank
        x.Addresses.forEach((item : any) => {
        const adressForm = this.newAddress();
        adressForm.patchValue(item);
        (this.form.get('Addresses') as FormArray).push(adressForm);

        (adressForm.get('Phones') as FormArray).clear(); //Initially blank
        item.Phones.forEach((ph : any) => {
        const phoneForm = this.newPhone();
        phoneForm.patchValue(ph);
        (adressForm.get('Phones') as FormArray).push(phoneForm);
      });
      });
      this.OutPutData = this.form.value;
    });
    
  }

  bindCustomer() {
    this.myfirstname=this.form.get('firstName')?.value;
    this.mylastname=this.form.get('lastName')?.value;
    this.getCustomer(this.myfirstname?.toString(),this.mylastname?.toString())
  }


  //Data Save
    onSubmit() {
      const {value, valid} = this.form;
      if(valid) {
      if(this.isAddMode == true){
        var data = this.customerService.saveCustomerData(this.form.value).subscribe(x =>{
          this.form.reset(),
          alert("Data Submitted Successfull");
          this.isAddMode == true
        })
        
      }else{
        this.customerService.updateCustomerData(this.form.value, this.id).subscribe(x=>{
          this.form.reset(),
          alert("Data Updated Successfull");
          this.isAddMode == true
        });
      }
    }}
  }
