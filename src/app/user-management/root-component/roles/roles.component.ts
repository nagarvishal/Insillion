import { Component } from '@angular/core';
import { CommonserviceService } from '../../services/commonservice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  roles:any = []
  limit:number = 7;
  searchString:string = "";
  offset:number = 0;
  noOfColumn:any;
  numOfButton: any;
  buttonArray: any = [];
  activeButton: string = '1';
  isEdith:boolean = false;
  form:any;
  currentRole:any;
  searchUserEmail:string = "";
  previleges:any;
  users:any;
  dummyUsers:any;
  roleUsers:any;
  rolePrevileges:any;
  roleAddingUsers:any;
  roleAddingPrevileges:any;
  roleRemovingUsers:any;
  roleRemovingPrevileges:any;

  constructor(private fb: FormBuilder, public commonServices: CommonserviceService,private messageService: MessageService,private http:HttpClient,private router:Router){
    this.form = fb.group({
      role_name:['',[Validators.required]],
      isactive:['',[Validators.required]]
    })
    this.fetchRoleDetails()
  }
  get role_name(){
    return this.form.get('role_name')
  }
  get isactive(){
    return this.form.get('isactive')
  }
  fetchRoleDetails(){
      console.log("hello world")
      let header = this.commonServices.creatHeader();
      let req = {
          "offset": this.offset,
          "limit": this.limit,
          "searchString": this.searchString
      }
      this.commonServices.postAPICall(environment.Url+"/api/v1/role/fetch_role_details",req,header).subscribe({
          next:(responce:any)=>{
            this.roles = responce["roleData"];
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
          },
          error:(error)=>{
            this.commonServices.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }   
          },
          complete:()=>{

          }
      })
  }
  changeLimitSearch(){
    this.fetchRoleDetails()
  }
  edithRole(role:any,index:any){
      this.isEdith = true;
      this.currentRole = {...role};
      this.previleges = [];
      this.roleUsers = [];
      this.rolePrevileges = [];
      this.roleAddingPrevileges = [];
      this.roleAddingUsers = [];
      this.roleRemovingPrevileges = [];
      this.roleRemovingUsers = [];

      this.commonServices.fetchPrevileges().then((response)=>{
        this.previleges = response;
      },(error)=>{
          this.commonServices.showError(JSON.stringify(error.error.desc));
          if(error.error.status==-106){
            this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
          }
      })

      this.commonServices.fetchRoleUsers(this.currentRole.role_id).subscribe({
          next:(responce:any)=>{
              this.roleUsers = responce;
              console.log(this.roleUsers)
          },
          error:(error:any)=>{
              this.commonServices.showError(JSON.stringify(error.error.desc));
              if(error.error.status==-106){
                this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
              }
          },
          complete:()=>{}
      })

      this.commonServices.fetchRolePrevileges(this.currentRole.role_id).subscribe({
          next:(responce:any)=>{
              this.rolePrevileges = responce;
              console.log(this.rolePrevileges);
          },
          error:(error:any)=>{
              this.commonServices.showError(JSON.stringify(error.error.desc));
              if(error.error.status==-106){
                this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
              }
          },
          complete:()=>{}
      })
  }
  userSearchByEmail(){
    this.commonServices.fetchUsers(7,0,this.searchUserEmail).then((response)=>{
      this.users = response;
    },(error)=>{
        this.commonServices.showError(JSON.stringify(error.error.desc));
        if(error.error.status==-106){
          this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
        }
    })
  }
  updateRole(){
      let insertingUserIds:any = [];
      let insertingPrevIds:any = [];
      let deletingUserIds:any = [];
      let deletingPrevIds:any = [];
      for(let user of this.roleAddingUsers)insertingUserIds.push(user.user_id);
      for(let user of this.roleRemovingUsers)deletingUserIds.push(user.user_id);
      for(let previlege of this.roleAddingPrevileges)insertingPrevIds.push(previlege.privilege_id);
      for(let previlege of this.roleRemovingPrevileges)deletingPrevIds.push(previlege.privilege_id);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'in-auth-token': sessionStorage.getItem('in-auth-token')
      });
      let url3 = environment.Url+`/api/v1/role/add_users?role_id=${this.currentRole.role_id}`;
      let req3 = {
          "user_ids":insertingUserIds
      }
      let url4 = environment.Url+`/api/v1/role/remove_users?role_id=${this.currentRole.role_id}`;
      let req4 = {
          "user_ids":deletingUserIds
      }
      let apiData1:any;
      this.http.post(url3,req3,{headers}).pipe(
        mergeMap(firstApiResponce => {
              apiData1 = firstApiResponce;
              return this.http.post(url4,req4,{headers});
          })
        ).subscribe({
            next: (secondApiResponce:any) => {
                    this.showSuccess("Sucessfully Added Previllege to Group ${this.currentEdithGroup.group_id}");
                    this.showSuccess("Sucessfully Removed Previllege to Group ${this.currentEdithGroup.group_id}");
            },
            error: (error) => {
                this.commonServices.showError(JSON.stringify(error.error.desc));
                if(error.error.status==-106){
                  this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
                }
            },
            complete: () => {
              console.log("function sucessfully executed");
            }
      });

      let url1 = environment.Url+`/api/v1/role/add_privileges?role_id=${this.currentRole.role_id}`;
      let request1 = {
        "privileges":insertingPrevIds
      }
      let url2 = environment.Url+`/api/v1/role/remove_privileges?role_id=${this.currentRole.role_id}`;
      let request2 = {
          "privileges":deletingPrevIds
      }
      let apiData2:any;
      this.http.post(url1,request1,{headers}).pipe(
        mergeMap(firstApiResponce => {
              apiData2 = firstApiResponce;
              return this.http.post(url2,request2,{headers});
          })
        ).subscribe({
            next: (secondApiResponce:any) => {
                this.showSuccess("Sucessfully Added Previllege to Role ${this.currentRole.role_id}");
                this.showSuccess("Sucessfully Removed Previllege to role ${this.currentRole.role_id}");
            },
            error: (error) => {
                this.commonServices.showError(JSON.stringify(error.error.desc));
                if(error.error.status==-106){
                  this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
                }
            },
            complete: () => {
              console.log("function sucessfully executed");
            }
      });
      this.isEdith = false;
      this.roleAddingUsers = [];
      this.roleAddingPrevileges = [];
      this.roleRemovingPrevileges = [];
      this.roleRemovingUsers = [];
      this.previleges = [];
      this.roleUsers = [];
      this.rolePrevileges = [];
      this.currentRole = undefined;
  }
  submitEmailForm(element:any){
      let selectedEmail = element['form']["value"];
      let index:any;
      let userValue:any = undefined;
      index = this.commonServices.searchInArray(this.users,selectedEmail.myField,"email");
      if(index==undefined){
          index = this.commonServices.searchInArray(this.dummyUsers,selectedEmail.myField,"email");
          if(index!=undefined)
              userValue = this.dummyUsers[index];  
      }
      else
          userValue = this.users[index];
      if(userValue){
          index = this.commonServices.searchInArray(this.roleUsers,userValue.email,'email');
          if(index==undefined){
              index = this.commonServices.searchInArray(this.roleRemovingUsers,userValue.email,'email');
              if(index==undefined){
                  this.roleUsers.push(userValue);
                  this.roleAddingUsers.push(userValue);
              }
              else{
                  this.roleRemovingUsers.splice(index,1);
                  this.roleUsers.push(userValue);
                  this.roleAddingUsers.push(userValue);
              }
          }
      }
      else{
          this.commonServices.showError("Entered Email Is Not In System");
      }

  }
  clickOnOption(index:any,userEmail:any,optionElemenet:any){
    this.searchUserEmail = userEmail;
    this.dummyUsers = [...this.users];
    this.users=[];
  }
  addRole(){
    let header = this.commonServices.creatHeader();
    let req = {
      "role_name":this.form.value.role_name,
      "isactive":this.form.value.isactive=="true"?true:false
    }
    this.commonServices.postAPICall(environment.Url+"/api/v1/role/add_role",req,header).subscribe({
      next:(responce:any)=>{
        this.messageService.add({ severity: 'success', summary: 'Success', detail: JSON.stringify(responce.message) });
        this.fetchRoleDetails()
      },
      error:(error)=>{
          this.commonServices.showError(JSON.stringify(error.error.desc));
          if(error.error.status==-106){
            this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
          }
      },
      complete:()=>{}
    })

  }
  removeUserFromRole(user:any,index:any){
      let index1 = this.commonServices.searchInArray(this.roleAddingUsers,user.email,'email');
      if(index1!=undefined)
          this.roleAddingUsers.splice(index1,1);
      else{
          this.roleRemovingUsers.push({...user});
          this.roleUsers.splice(index,1);
      }
  }
  isChecked(previlege:any,index:any):boolean{
    let index1 = this.commonServices.searchInArray(this.rolePrevileges,previlege.privilege_id,'privilege_id')
    if(index1==undefined)
       return false;
    else
       return true;
  }
  onCheckboxClick($event:any,previlege:any,index:any){
    if($event.target.checked){
      let previlegeValue = {...previlege};
      let index1:any = this.commonServices.searchInArray(this.roleRemovingPrevileges,previlegeValue.privilege_id,'privilege_id');
      if(index1!=undefined){
          this.roleRemovingPrevileges.splice(index1,1);
      }
      index1 = this.commonServices.searchInArray(this.rolePrevileges,previlegeValue.privilege_id,'privilege_id');
      if(index1==undefined){
          this.roleAddingPrevileges.push(previlegeValue);
      }
    }
    else{
      let previlegeValue = {...previlege};
      let index2:any = this.commonServices.searchInArray(this.roleAddingPrevileges,previlegeValue.privilege_id,'privilege_id');
      if(index2!=undefined){
       this.roleAddingPrevileges.splice(index2,1);
      }
      let index1 = this.commonServices.searchInArray(this.rolePrevileges,previlegeValue.privilege_id,'privilege_id');
      if(index1!=undefined){
        this.roleRemovingPrevileges.push(previlegeValue);
      }
  }
  }
  navigationClick($event: any, element: any, parent: any){
      if (this.numOfButton <= 7) {
          this.activeButton = element.textContent;
          this.offset = (Number(element.textContent) - 1) * this.limit;
          this.fetchRoleDetails();
      }
      else{
          let valueMap = new Map();
          for (let index = 1; index <= 7; index = index + 1) {
              valueMap.set(parent.children[index].textContent, index);
          }
          let clickContent = element.textContent;
          if(clickContent!='.........')this.activeButton = element.textContent;
          if (valueMap.get(clickContent) == 1) {
              this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchRoleDetails();
              for (let index = 1; index <= 6; index = index + 1) {
                  if (index == 6)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = index;
              }
          }
          else if (valueMap.get(clickContent) == 2) {
            if(element.textContent!='.........'){
                this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchRoleDetails();
            }
          }
          else if (valueMap.get(clickContent) == 3) {
            if(element.textContent==3){
                this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchRoleDetails();
            }
            else if(element.textContent==4){
                this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchRoleDetails();
                for (let index = 1; index <= 6; index = index + 1) {
                    if (index == 6)
                        parent.children[index].textContent = '.........';
                    else
                        parent.children[index].textContent = index;
                }
            }
            else{
              this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchRoleDetails();
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
            this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchRoleDetails();
        }
        else if (valueMap.get(clickContent) == 5) {
          if(element.textContent==5){
            this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchRoleDetails();
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
             this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchRoleDetails();
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
              this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchRoleDetails();
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
              this.fetchRoleDetails();
          }
        }
        else {
            this.offset = (Number(element.textContent) - 1) * this.limit;
            this.fetchRoleDetails();
            for (let index = 7; index >= 2; index = index - 1) {
                if (index == 2)
                    parent.children[index].textContent = '.........';
                else
                    parent.children[index].textContent = this.numOfButton+index-7;    
            }
        }
      }
  }
  showSuccess(message:string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showInfo(message:string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
  }

  showWarn(message:string) {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: message });
  }

  showError(message:string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
