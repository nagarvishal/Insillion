import { Component } from '@angular/core';
import { CommonserviceService } from '../../services/commonservice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrl: './broker.component.css'
})
export class BrokerComponent {
    limit:number = 7;
    offset:number = 0;
    brokerData:any;
    searchString:String = "";
    __no_of_column:number = 10;
    __no_of_button: any;
    __button_array: any = [];
    __active_button: string = '1';
    __is_edith:boolean = false;
    __current_edith_broker:any = {};
    form:any;
    form_bu:any;
    broker_users:any=[];
    broker_managers:any = [];
    is_clicked:boolean = false;
    constructor(public service:CommonserviceService,public fb:FormBuilder,private messageService: MessageService,private http:HttpClient,private router:Router){
        this.__fetch_broker_details();
        this.form = fb.group({
            broker_name: ['', Validators.required],
            broker_code: ['', [Validators.required]],
            address_1: ['', []],
            address_2: ['', []],
            phone_no_1:['',[]],
            phone_no_2:['',[]],
            status:['',[Validators.required]],
            deposit_balance_mode:['',[Validators.required]],
            location:['',[]],
            alt_broker_code:['',[]],
            broker_type:['',[Validators.required]]
        })
        this.form_bu = fb.group({
          first_name:['',Validators.required],
          last_name:['',Validators.required],
          user_name:['',Validators.required],
          email:['',[Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
          agent_code:[''],
          mobile_no:['',Validators.required],
          veryfied:['',Validators.required],
          user_type:['',Validators.required],
          reports_to:['']
        })
    }
    get brokerform(){
      return this.form.controls;
    }
    get userform(){
      return this.form_bu.controls;
    }
    get submitButton(){
      return this.form.get("submitButton");
    }
    __add_broker_user(){
      if(this.form_bu.invalid==true){
        this.is_clicked = true;
      }
      else{
          this.is_clicked = false;
          let headers = this.service.creatHeader();
          let req = {
              email : this.form_bu.value.email ? this.form_bu.value.email : "",
              first_name : this.form_bu.value.first_name ? this.form_bu.value.first_name : "",
              last_name : this.form_bu.value.last_name ? this.form_bu.value.last_name : "",
              user_name : this.form_bu.value.user_name ? this.form_bu.value.user_name : "",
              agent_code : this.form_bu.value.agent_code ? this.form_bu.value.agent_code : "",
              mobile_no : this.form_bu.value.mobile_no ? this.form_bu.value.mobile_no : "",
              veryfied : this.form_bu.value.veryfied == "true" ? true : false,
              is_manager : this.form_bu.value.user_type == "broker-manager" ? true:false,
              reports_to : this.form_bu.value.reports_to ? this.form_bu.value.reports_to:"",
              broker_code : this.__current_edith_broker.broker_code ? this.__current_edith_broker.broker_code : "",
              broker_id : this.__current_edith_broker.broker_id ? this.__current_edith_broker.broker_id : ""
          }
          this.service.postAPICall(environment.Url+'/api/v1/user/add_user', req, headers).subscribe({
              next:(response)=>{
                this.__fetch_broker_users(this.__current_edith_broker.broker_id);
              },
              error:(error)=>{
                  this.service.showError(JSON.stringify(error.error.desc));
                  if(error.error.status==-106){
                    this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
                  }
              },
              complete:()=>{
                  console.log("process has been completed");
              }
          })
      }
    }
    __fetch_broker_details(){
        let headers = this.service.creatHeader();
        let req = {
            limit:this.limit,
            offset:this.offset,
            searchString:this.searchString
        }
        let url = environment.Url+'/api/v1/broker/fetch';
        this.service.postAPICall(url,req,headers).subscribe({
            next:(response)=>{
                this.brokerData = response.broker_details;
                this.__no_of_column = response.no_of_col[0];
                this.__no_of_column = this.__no_of_column["no_of_col"];
                this.__no_of_button = Math.ceil(this.__no_of_column / this.limit);
                this.__button_array = [];
                if (this.__no_of_button <= 7) {
                  for (let index = 0; index <= this.__no_of_button - 1; index = index + 1)this.__button_array.push(index + 1);
                }
                else {
                    for (let index = 0; index <= 6; index = index + 1) {
                        if (index == 5)
                          this.__button_array[index] = '.........';
                        else if (index == 6)
                          this.__button_array[index] = this.__no_of_button;
                        else
                          this.__button_array[index] = index + 1;
                    }
                }
            },
            error:(err)=>{
              this.service.showError(JSON.stringify(err.error.desc));
              if(err.error.status==-106){
                this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(err.error.desc)}});
              }
            },
            complete:()=>{
                console.log("process succesfully completed");
            }
        })
        console.log("")
    }
    __change_limit_search(){
        this.__fetch_broker_details();
    }
    __edith_broker(broker:any){
        this.is_clicked = false;
        this.broker_users = [];
        this.broker_managers = [];
        this.__is_edith = true;
        this.__current_edith_broker = {...broker};
        console.log(this.__current_edith_broker);
        if(this.__current_edith_broker.status==1) this.form.get("status").setValue("Active");
        else this.form.get("status").setValue("Non-Active");
        if(this.__current_edith_broker.deposit_balance_mode=="broker")this.form.get("deposit_balance_mode").setValue("broker");
        else this.form.get("deposit_balance_mode").setValue("agent");
        this.__fetch_broker_users(this.__current_edith_broker.broker_id);
    }
    __fetch_broker_users(broker_id:any){
        this.broker_users = [];
        this.broker_managers = [];
        let headers = this.service.creatHeader();
        let url = environment.Url+`/api/v1/broker/referencedata?reference=broker_id&broker_id=${broker_id}`;
        this.service.getAPICall(url,headers).subscribe({
            next:(response)=>{
                this.broker_users = response;
                for(let broker_user of this.broker_users){
                    if(broker_user.is_manager==1){
                      this.broker_managers.push(broker_user)
                    }
                }
                console.log("response=>",response);
            },
            error:(error)=>{
                this.service.showError(JSON.stringify(error.error.desc));
                if(error.error.status==-106){
                  this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
                }
            },
            complete:()=>{
                console.log("process has been completed");
            }
        })
    }
    __navigation_click($event: any, element: any, parent: any) {
      if (this.__no_of_button <= 7) {
          this.__active_button = element.textContent;
          this.offset = (Number(element.textContent) - 1) * this.limit;
          this.__fetch_broker_details();
      }
      else {
        let valueMap = new Map();
        for (let index = 1; index <= 7; index = index + 1) {
            valueMap.set(parent.children[index].textContent, index);
        }
        let clickContent = element.textContent;
        if(clickContent!='.........')this.__active_button = element.textContent;
  
        if (valueMap.get(clickContent) == 1) {
          this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_broker_details();
          for (let index = 1; index <= 6; index = index + 1) {
              if (index == 6)
                  parent.children[index].textContent = '.........';
              else
                  parent.children[index].textContent = index;
          }
        }
        else if (valueMap.get(clickContent) == 2) {
            if(element.textContent!='.........'){
                this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_broker_details();
            }
        }
        else if (valueMap.get(clickContent) == 3) {
            if(element.textContent==3){
                this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_broker_details();
            }
            else if(element.textContent==4){
                this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_broker_details();
                for (let index = 1; index <= 6; index = index + 1) {
                    if (index == 6)
                        parent.children[index].textContent = '.........';
                    else
                        parent.children[index].textContent = index;
                }
            }
            else{
              this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_broker_details();
              console.log(element.textContent);
              parent.children[6].textContent = '.........';
              let data = Number(element.textContent);
              parent.children[3].textContent = data-1;
              parent.children[4].textContent = data;
              parent.children[5].textContent = data+1;
              console.log("element_textcontent",Number(element.textContent-1));
            }
        }
        else if (valueMap.get(clickContent) == 4) {
            this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_broker_details();
        }
        else if (valueMap.get(clickContent) == 5) {
          if(element.textContent==5){
            this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_broker_details();
            parent.children[2].textContent='.........';
            if(parent.children[6].textContent=='.........'){
                if(element.textContent==this.__no_of_button-3){
                  for (let index = 7; index >= 2; index = index - 1) {
                      if (index == 2)
                          parent.children[index].textContent = '.........';
                      else
                          parent.children[index].textContent = this.__no_of_button+index-7;    
                  }
               }
              else{
                  parent.children[3].textContent=Number(element.textContent)-1;
                  parent.children[4].textContent=Number(element.textContent);
                  parent.children[5].textContent=Number(element.textContent)+1;
              }
            }
          }
          else if(element.textContent==this.__no_of_button-3){
             this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_broker_details();
             if(parent.children[6].textContent=='.........'){
                for (let index = 7; index >= 2; index = index - 1) {
                    if (index == 2)
                        parent.children[index].textContent = '.........';
                    else
                        parent.children[index].textContent = this.__no_of_button+index-7;    
                }
             }
          }
          else{
              this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_broker_details();
              if(parent.children[6].textContent=='.........'){
                  parent.children[3].textContent=Number(element.textContent)-1;
                  parent.children[4].textContent=Number(element.textContent);
                  parent.children[5].textContent=Number(element.textContent)+1;
              }
          }
        }
        else if (valueMap.get(clickContent) == 6) {
          if(element.textContent!='.........'){
              this.offset = (Number(element.textContent) - 1) * this.limit;
              this.__fetch_broker_details();
          }
        }
        else {
            this.offset = (Number(element.textContent) - 1) * this.limit;
            this.__fetch_broker_details();
            for (let index = 7; index >= 2; index = index - 1) {
                if (index == 2)
                    parent.children[index].textContent = '.........';
                else
                    parent.children[index].textContent = this.__no_of_button+index-7;    
            }
        }
      }
    }
    __add_new_broker(){
      console.log(this.form);
        if(this.form.invalid){
          this.is_clicked = true;
        }else{
            this.is_clicked = false;
            let headers = this.service.creatHeader();
            let req = {
                "broker_name" : this.form.value.broker_name ? this.form.value.broker_name : "" ,
                "broker_code" : this.form.value.broker_code ? this.form.value.broker_code : "",
                "address_1" : this.form.value.address_1 ? this.form.value.address_1 : "",
                "address_2" : this.form.value.address_2 ? this.form.value.address_2 : "",
                "phone_no_1" : this.form.value.phone_no_1 ? this.form.value.phone_no_1 : "",
                "phone_no_2" : this.form.value.phone_no_2 ? this.form.value.phone_no_2 : "",
                "status" : this.form.value.status=="Active"?true:false,
                "deposit_balance_mode" : this.form.value.deposit_balance_mode ? this.form.value.deposit_balance_mode : "",
                "location" : this.form.value.location ? this.form.value.location : "",
                "alt_broker_code" : this.form.value.alt_broker_code ? this.form.value.alt_broker_code : "",
                "broker_type" : this.form.value.broker_type ? this.form.value.broker_type : ""
            }
            this.service.postAPICall(environment.Url+"/api/v1/broker/add",req,headers).subscribe({
              next:(response)=>{
                let data = response;
              },
              error:(error)=>{
                  this.service.showError(JSON.stringify(error.error.desc));
                  if(error.error.status==-106){
                    this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
                  }
              },
              complete:()=>{
                console.log("process has been completed");
              }
            })
            console.log(req);
        }
    }
    __modify_broker_detials(){
        if(this.form.invalid){
            this.is_clicked = true;
        }
        else{
            this.is_clicked = false;
            console.log(this.form);
            let headers = this.service.creatHeader();
            let req = {
                  "broker_name":this.form.value.broker_name,
                  "broker_code":this.form.value.broker_code,
                  "address_1":this.form.value.address_1,
                  "address_2":this.form.value.address_2,
                  "phone_no_1":this.form.value.phone_no_1,
                  "phone_no_2":this.form.value.phone_no_2,
                  "status":this.form.value.status=="Active"?true:false,
                  "deposit_balance_mode":this.form.value.deposit_balance_mode,
                  "location":this.form.value.location,
                  "alt_broker_code":this.form.value.alt_broker_code,
                  "broker_type":this.form.value.broker_type
            }
            let url = environment.Url+`/api/v1/broker/modify?broker_id=${this.__current_edith_broker.broker_id}`;
            this.service.postAPICall(url,req,headers).subscribe({
                next:(response)=>{
                    let data = response;
                    this.__show_success(JSON.stringify(data));
                },
                error:(error)=>{
                    this.service.showError(JSON.stringify(error.error.desc));
                    if(error.error.status==-106){
                      this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
                    }
                },
                complete:()=>{
                    console.log("process has been completed");
                }
            })
        }        
    }

    __show_success(message:string) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
    }
  
    __show_info(message:string) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
    }
  
    __show_warn(message:string) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: message });
    }
  
    __show_error(message:string) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
    }

}
