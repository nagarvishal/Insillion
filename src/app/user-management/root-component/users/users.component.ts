import { Component } from '@angular/core';
import { CommonserviceService } from '../../services/commonservice.service';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  usersData: any;
  limit:number=7;
  offset:number=0;
  noOfColumn:number = 0;
  numOfButton:number = 0;
  searchString:string = "";
  activeButton: string = '1';
  buttonArray:any = [];
  displayUserData: any = [];
  form: any;
  searchValue: string;
  firstCount: number = 0;
  lastCount: number = 9;
  buttonNumber: number = 1;
  isEdith: boolean = false;
  edithData: any;
  newEdithUserData: any;
  searchUserEmail:any = '';
  users:any;
  is_clicked:boolean;
  m_limit:number = 7;
  m_offset:number = 0;
  m_searchString:string = "";
  m_noOfColumn:number;
  m_numOfButton:number;
  m_buttonArray:any = [];
  m_mappingData:any = [];
  m_activeButton: string = '1';
  user_searchString:string = "";
  reports_searchString:string = "";
  userUsers:any = [];
  reportingUsers:any = [];
  m_is_clicked:boolean = false;
  constructor(public commonService: CommonserviceService, fb: FormBuilder, private messageService: MessageService,private router:Router) {
    this.fetchUsersDetails();
    this.m_fetchUsersDetails();
    this.form = fb.group({
      user_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]],
      veryfied: ['', [Validators.required]],
      mobile_no:['',[Validators.required]],
      reportsto:['',[Validators.required]],
      broker_code:['',[]],
      agent_code:['',[]]
    })
  }
  get userform(){
    return this.form.controls;
  }

  addUser() {
    if(this.form.invalid){
      this.is_clicked = true;
    }
    else{
        this.is_clicked = false;
        let request = {
            "user_name": this.form.value.user_name, 
            "email": this.form.value.email, 
            "password": this.form.value.password,
            "veryfied": this.form.value.veryfied,
            "mobile_no":this.form.value.mobile_no,
            "reports_to":this.form.value.reportsto,
            "broker_code":this.form.value.broker_code,
            "agent_code":this.form.value.agent_code
        };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
            'in-auth-token': sessionStorage.getItem('in-auth-token')
        });
        this.commonService.callPOSTAPI(environment.Url+'/api/v1/user/add_user', request, headers).then((responce: any) => {
            console.log(responce);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New User Sucessfully Created' });
        }, (error) => {
            this.commonService.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
        })
    }
  }
  fetchUsersDetails() {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'in-auth-token': sessionStorage.getItem('in-auth-token')
      });
      const request = {
          "offset": this.offset,
          "limit": this.limit,
          "searchString": this.searchString,
          "iscolumn":true
      }
      this.commonService.callPOSTAPI(environment.Url+'/api/v1/user/fetch_users', request, headers).then((responce) => {
          this.usersData = responce["usersDetails"];
          console.log(this.usersData,request);
          this.noOfColumn = responce["numOfColumn"];
          this.numOfButton = Math.ceil((this.noOfColumn[0].No_of_Column) / this.limit);
          this.buttonArray = [];
          if (this.numOfButton <= 7) {
              for (let index = 0; index <= this.numOfButton - 1; index = index + 1)this.buttonArray.push(index + 1);
          }
          else {
              for (let index = 0; index <= 6; index = index + 1) {
                  if (index == 5)
                    this.buttonArray[index] = '.........';
                  else if (index == 6)
                    this.buttonArray[index] = this.numOfButton;
                  else
                    this.buttonArray[index] = index + 1;
              }
            }
      }, (error) => {
            this.commonService.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
        })
  }
  navigationClick($event: any, element: any, parent: any){
    if (this.numOfButton <= 7) {
      this.activeButton = element.textContent;
      this.offset = (Number(element.textContent) - 1) * this.limit;
      this.fetchUsersDetails();
    }
    else{
      let valueMap = new Map();
      for (let index = 1; index <= 7; index = index + 1) {
          valueMap.set(parent.children[index].textContent, index);
      }
      let clickContent = element.textContent;
      if(clickContent!='.........')this.activeButton = element.textContent;

      if (valueMap.get(clickContent) == 1) {
        this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchUsersDetails();
        for (let index = 1; index <= 6; index = index + 1) {
            if (index == 6)
                parent.children[index].textContent = '.........';
            else
                parent.children[index].textContent = index;
        }
      }
      else if (valueMap.get(clickContent) == 2) {
          if(element.textContent!='.........'){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchUsersDetails();
          }
      }
      else if (valueMap.get(clickContent) == 3) {
          if(element.textContent==3){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchUsersDetails();
          }
          else if(element.textContent==4){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchUsersDetails();
              for (let index = 1; index <= 6; index = index + 1) {
                  if (index == 6)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = index;
              }
          }
          else{
            this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchUsersDetails();
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
          this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchUsersDetails();
      }
      else if (valueMap.get(clickContent) == 5) {
        if(element.textContent==5){
          this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchUsersDetails();
          parent.children[2].textContent='.........';
          if(parent.children[6].textContent=='.........'){
              if(element.textContent==this.numOfButton-3){
                for (let index = 7; index >= 2; index = index - 1) {
                    if (index == 2)
                        parent.children[index].textContent = '.........';
                    else
                        parent.children[index].textContent = this.numOfButton+index-7;    
                }
             }
            else{
                parent.children[3].textContent=Number(element.textContent)-1;
                parent.children[4].textContent=Number(element.textContent);
                parent.children[5].textContent=Number(element.textContent)+1;
            }
          }
        }
        else if(element.textContent==this.numOfButton-3){
           this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchUsersDetails();
           if(parent.children[6].textContent=='.........'){
              for (let index = 7; index >= 2; index = index - 1) {
                  if (index == 2)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = this.numOfButton+index-7;    
              }
           }
        }
        else{
            this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchUsersDetails();
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
            this.fetchUsersDetails();
        }
      }
      else {
          this.offset = (Number(element.textContent) - 1) * this.limit;
          this.fetchUsersDetails();
          for (let index = 7; index >= 2; index = index - 1) {
              if (index == 2)
                  parent.children[index].textContent = '.........';
              else
                  parent.children[index].textContent = this.numOfButton+index-7;    
          }
      }
    }
  }
  m_navigationClick($event: any, element: any, parent: any){
    if (this.m_numOfButton <= 7) {
      this.m_activeButton = element.textContent;
      this.m_offset = (Number(element.textContent) - 1) * this.m_limit;
      this.m_fetchUsersDetails();
    }
    else{
      let valueMap = new Map();
      for (let index = 1; index <= 7; index = index + 1) {
          valueMap.set(parent.children[index].textContent, index);
      }
      let clickContent = element.textContent;
      if(clickContent!='.........')this.m_activeButton = element.textContent;

      if (valueMap.get(clickContent) == 1) {
        this.m_offset = (Number(element.textContent) - 1) * this.m_limit; this.m_fetchUsersDetails();
        for (let index = 1; index <= 6; index = index + 1) {
            if (index == 6)
                parent.children[index].textContent = '.........';
            else
                parent.children[index].textContent = index;
        }
      }
      else if (valueMap.get(clickContent) == 2) {
          if(element.textContent!='.........'){
              this.m_offset = (Number(element.textContent) - 1) * this.m_limit; this.m_fetchUsersDetails();
          }
      }
      else if (valueMap.get(clickContent) == 3) {
          if(element.textContent==3){
              this.m_offset = (Number(element.textContent) - 1) * this.m_limit; this.m_fetchUsersDetails();
          }
          else if(element.textContent==4){
              this.m_offset = (Number(element.textContent) - 1) * this.m_limit; this.m_fetchUsersDetails();
              for (let index = 1; index <= 6; index = index + 1) {
                  if (index == 6)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = index;
              }
          }
          else{
            this.m_offset = (Number(element.textContent) - 1) * this.m_limit; this.m_fetchUsersDetails();
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
          this.m_offset = (Number(element.textContent) - 1) * this.m_limit; this.m_fetchUsersDetails();
      }
      else if (valueMap.get(clickContent) == 5) {
        if(element.textContent==5){
          this.m_offset = (Number(element.textContent) - 1) * this.m_limit; this.m_fetchUsersDetails();
          parent.children[2].textContent='.........';
          if(parent.children[6].textContent=='.........'){
              if(element.textContent==this.m_numOfButton-3){
                for (let index = 7; index >= 2; index = index - 1) {
                    if (index == 2)
                        parent.children[index].textContent = '.........';
                    else
                        parent.children[index].textContent = this.m_numOfButton+index-7;    
                }
             }
            else{
                parent.children[3].textContent=Number(element.textContent)-1;
                parent.children[4].textContent=Number(element.textContent);
                parent.children[5].textContent=Number(element.textContent)+1;
            }
          }
        }
        else if(element.textContent==this.m_numOfButton-3){
           this.m_offset = (Number(element.textContent) - 1) * this.m_limit; this.m_fetchUsersDetails();
           if(parent.children[6].textContent=='.........'){
              for (let index = 7; index >= 2; index = index - 1) {
                  if (index == 2)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = this.m_numOfButton+index-7;    
              }
           }
        }
        else{
            this.m_offset = (Number(element.textContent) - 1) * this.m_limit; this.m_fetchUsersDetails();
            if(parent.children[6].textContent=='.........'){
                parent.children[3].textContent=Number(element.textContent)-1;
                parent.children[4].textContent=Number(element.textContent);
                parent.children[5].textContent=Number(element.textContent)+1;
            }
        }
      }
      else if (valueMap.get(clickContent) == 6) {
        if(element.textContent!='.........'){
            this.m_offset = (Number(element.textContent) - 1) * this.m_limit;
            this.m_fetchUsersDetails();
        }
      }
      else {
          this.m_offset = (Number(element.textContent) - 1) * this.m_limit;
          this.m_fetchUsersDetails();
          for (let index = 7; index >= 2; index = index - 1) {
              if (index == 2)
                  parent.children[index].textContent = '.........';
              else
                  parent.children[index].textContent = this.m_numOfButton+index-7;    
          }
      }
    }
  }
  changeLimitSearch(){
    this.fetchUsersDetails();
  }

  m_fetchUsersDetails(){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'in-auth-token': sessionStorage.getItem('in-auth-token')
      });
      const request = {
          "offset": this.m_offset,
          "limit": this.m_limit,
          "searchString": this.m_searchString
      }
      this.commonService.callPOSTAPI(environment.Url+'/api/v1/user/mapping', request, headers).then((responce) => {
          this.m_mappingData= responce["usersDetails"];
          this.m_noOfColumn = responce["numOfColumn"];
          this.m_numOfButton = Math.ceil((this.m_noOfColumn[0].No_of_Column) / this.limit);
          this.m_buttonArray = [];
          if (this.m_numOfButton <= 7) {
              for (let index = 0; index <= this.m_numOfButton - 1; index = index + 1)this.m_buttonArray.push(index + 1);
          }
          else {
              for (let index = 0; index <= 6; index = index + 1) {
                  if (index == 5)
                    this.m_buttonArray[index] = '.........';
                  else if (index == 6)
                    this.m_buttonArray[index] = this.m_numOfButton;
                  else
                    this.m_buttonArray[index] = index + 1;
              }
          }
      }, (error) => {
            this.commonService.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
        
      })

  }
  m_changeLimitSearch(){
    this.m_fetchUsersDetails();
  }
  assignToDisplayUser() {
    this.displayUserData = [];
    for (let index = this.firstCount; index <= this.lastCount && index < this.usersData.length; index = index + 1) {
      this.displayUserData.push(this.usersData[index]);
    }
    return;
  }
  onEdith(userData) {
    this.isEdith = true;
    this.edithData = userData;
    this.newEdithUserData = { ...this.edithData };

  }

  userSearchByEmail(temp:number){
    if(temp==1){
        this.commonService.fetchUsers(7,0,this.searchUserEmail).then((response)=>{
          this.users = response;
          if(this.users.length>0){
            if(this.users[0].email==this.searchUserEmail){
              this.users = [];
            }
          }
        },(error)=>{
            this.commonService.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
        })
    }
    if(temp==2){
      this.commonService.fetchUsers(7,0,this.user_searchString).then((response)=>{
        this.userUsers= response;
        if(this.userUsers.length>0){
           if(this.userUsers[0].email==this.user_searchString){
            this.userUsers = [];
           }
        }
      },(error)=>{
          this.commonService.showError(JSON.stringify(error.error.desc));
          if(error.error.status==-106){
            this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
          }
      })
    } 
    else{
      this.commonService.fetchUsers(7,0,this.reports_searchString).then((response)=>{
        this.reportingUsers= response;
        if(this.reportingUsers.length>0){
           if(this.reportingUsers[0].email==this.reports_searchString){
            this.reportingUsers = [];
           }
        }
      },(error)=>{
          this.commonService.showError(JSON.stringify(error.error.desc));
          if(error.error.status==-106){
            this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
          }
      })
    }
  }
  clickOnOption(index:any,email:any,optionElement:any){
    console.log(this.users[index]);
    let temp = this.users[index].email;
    this.searchUserEmail = this.users[index].email;
    this.users = [];
  }
  clickOnList(index:any,email:any,temp:any){
    if(temp==1){
      this.user_searchString = this.userUsers[index].email;
      this.userUsers = [];
    }
    else{
      this.reports_searchString = this.reportingUsers[index].email;
      this.reportingUsers = [];
    }
  }
  onSubmit(f:any,temp:number=0){
    if(f.invalid == true){
      this.m_is_clicked = true;
    }
    else{
      this.m_is_clicked = false;
      console.log(temp);
    }
  }
  show() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }

  showInfo() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Message Content' });
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Message Content' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
  }

}
