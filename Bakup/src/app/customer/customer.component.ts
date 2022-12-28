import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CustomerService } from './customer.service';
import { ICustomer } from './customer.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  myfirstname : string = "";
  mylastname : string = "";
  id?: number = 0;
  isAddMode: boolean = true;
  OutPutData :string = "";

  constructor(private formBuilder : FormBuilder, private customerService : CustomerService) {
    this.form = this.formBuilder.group({
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
      addresses: this.formBuilder.array([])
    }
    , { validator: this.checkEmails }
    );
    this.addAddress();
    this.addCustomerPhone(0);
   }

  //  model : Customer;

  form : FormGroup;

  ngOnInit(): void {
    
  }

  checkEmails(group: FormGroup) {
    const em = group.controls['email'].value;
    const emc = group.controls['emailConfirm'].value;

    return em === emc ? null : { notSame: true };
}


  //Addresses

  addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }
 
  newAddress() {
    return this.formBuilder.group({
      addressType: ['', Validators.required],
      address1: ['', Validators.required],
      address2: '',
      city: ['', Validators.required],
      zipCode: '',
      state: '',
      phones:this.formBuilder.array([])
  });
  }
  addAddress(){
    this.addresses().push(this.newAddress());
  }

  deleteAddress(addressIndex: number) {
    this.addresses().removeAt(addressIndex);
  }
  
  
  //PHONES
  
  customerPhones(custIndex: number): FormArray {
    return this.addresses()
      .at(custIndex)
      .get('phones') as FormArray;
  }
 
  newPhone(): FormGroup {
    return this.formBuilder.group({
      phone: ['', Validators.required]
    });
  }
 
  addCustomerPhone(addressIndex: number) {
    this.customerPhones(addressIndex).push(this.newPhone());
  }
 
  removeCustomerPhone(custIndex: number, phoneIndex: number) {
    this.customerPhones(custIndex).removeAt(phoneIndex);
  }


 getCustomer(firstName : string, lastName: string) {
  this.customerService.getCustomerData(firstName,lastName)
  .pipe(first())
  .subscribe(x => {
    console.log(x),
    this.isAddMode = false,
    this.id = x.ID,
    this.form.patchValue(x),
    (this.form.get('addresses') as FormArray).clear(); //Initially blank
    x.addresses.forEach((item : any) => {
      const adressForm = this.newAddress();
      adressForm.patchValue(item);
      (this.form.get('addresses') as FormArray).push(adressForm);

      (adressForm.get('phones') as FormArray).clear(); //Initially blank
      item.phones.forEach((ph : any) => {
      const phoneForm = this.newPhone();
      phoneForm.patchValue(ph);
      (adressForm.get('phones') as FormArray).push(phoneForm);
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
      var data = this.customerService.saveCustomerData(JSON.stringify(this.form.value)).subscribe(x =>{
        this.form.reset(),
        alert("Data Submitted Successfull");
        this.isAddMode == true
      })
      
    }else{
      this.customerService.updateCustomerData(JSON.stringify(this.form.value), this.id).subscribe(x=>{
        this.form.reset(),
        alert("Data Updated Successfull");
        this.isAddMode == true
      });
    }
  }}
}
