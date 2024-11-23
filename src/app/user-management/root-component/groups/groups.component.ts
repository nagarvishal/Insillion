import { Component } from '@angular/core';
import { CommonserviceService } from '../../services/commonservice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
  offset: number = 0;
  limit: number = 7;
  searchString: string = "";
  groupsData: any = [];
  __no_of_column: number = 10;
  __no_of_button: any;
  buttonArray: any = [];
  activeButton: string = '1';
  isEdith:boolean = false;
  form:any;
  currentEdithGroup:any;
  condition: boolean = true;
  previleges:any;
  users:any = [];
  dummyUsers:any = [];
  searchUserEmail!:string;
  groupUsers:any = [];
  groupPrevilege:any = [];
  groupRemovingUsers:any = [];
  groupAddiingUsers:any = [];
  groupRemovingPrevilege:any = [];
  groupAddiingPrevilege:any = [];
  constructor(private fb: FormBuilder, public commonServices: CommonserviceService, private messageService: MessageService,private http:HttpClient,private router:Router) {
    this.__fetch_groups_details();
    this.form = fb.group({
      group_name:['',[Validators.required]],
      isactive:['',[Validators.required]]
    })
    // commonServices.fetchUsers(30,0,'');
  }
  get group_name(){
    return this.form.get('group_name');
  }
  get isactive(){
    return this.form.get('isactive');
  }

  __fetch_groups_details() {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'in-auth-token': sessionStorage.getItem('in-auth-token')
      });
      const request = {
          "offset": this.offset,
          "limit": this.limit,
          "searchString": this.searchString
      }
    this.commonServices.callPOSTAPI(environment.Url+'/api/v1/group/fetch_group_details', request, headers).then((responce) => {
        this.groupsData = responce["groupsDetails"];
        this.__no_of_column = responce["numOfColumn"];
        this.__no_of_button = Math.ceil((this.__no_of_column[0].No_of_Column) / this.limit);
        this.buttonArray = [];
        if (this.__no_of_button <= 7) {
          for (let index = 0; index <= this.__no_of_button - 1; index = index + 1)this.buttonArray.push(index + 1);
        }
        else {
            for (let index = 0; index <= 6; index = index + 1) {
                if (index == 5)
                  this.buttonArray[index] = '.........';
                else if (index == 6)
                  this.buttonArray[index] = this.__no_of_button;
                else
                  this.buttonArray[index] = index + 1;
            }
        }
      }, (error) => {
            this.commonServices.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
      })
  }

  navigationClick($event: any, element: any, parent: any) {
    if (this.__no_of_button <= 7) {
        this.activeButton = element.textContent;
        this.offset = (Number(element.textContent) - 1) * this.limit;
        this.__fetch_groups_details();
    }
    else {
      let valueMap = new Map();
      for (let index = 1; index <= 7; index = index + 1) {
          valueMap.set(parent.children[index].textContent, index);
      }
      let clickContent = element.textContent;
      if(clickContent!='.........')this.activeButton = element.textContent;

      if (valueMap.get(clickContent) == 1) {
        this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_groups_details();
        for (let index = 1; index <= 6; index = index + 1) {
            if (index == 6)
                parent.children[index].textContent = '.........';
            else
                parent.children[index].textContent = index;
        }
      }
      else if (valueMap.get(clickContent) == 2) {
          if(element.textContent!='.........'){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_groups_details();
          }
      }
      else if (valueMap.get(clickContent) == 3) {
          if(element.textContent==3){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_groups_details();
          }
          else if(element.textContent==4){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_groups_details();
              for (let index = 1; index <= 6; index = index + 1) {
                  if (index == 6)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = index;
              }
          }
          else{
            this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_groups_details();
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
          this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_groups_details();
      }
      else if (valueMap.get(clickContent) == 5) {
        if(element.textContent==5){
          this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_groups_details();
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
           this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_groups_details();
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
            this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_groups_details();
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
            this.__fetch_groups_details();
        }
      }
      else {
          this.offset = (Number(element.textContent) - 1) * this.limit;
          this.__fetch_groups_details();
          for (let index = 7; index >= 2; index = index - 1) {
              if (index == 2)
                  parent.children[index].textContent = '.........';
              else
                  parent.children[index].textContent = this.__no_of_button+index-7;    
          }
      }
    }
  }
  changeLimitSearch() {
      this.__fetch_groups_details();
  }
  addGroup(){
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'in-auth-token': sessionStorage.getItem('in-auth-token')
      });
      const request = {
          "group_name": this.form.value.group_name,
          "isactive":this.form.value.isactive=="true"?true:false
      }
      this.commonServices.callPOSTAPI(environment.Url+'/api/v1/group/add_group', request, headers).then((responce) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: JSON.stringify({"group_name":this.form.value.group_name,"message":"Group Sucessfully Inserted"}) });
      },(error)=>{
            this.commonServices.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
      })
  }
  updateGroup(){
      let insertingUserIds:any = [];
      let insertingPrevIds:any = [];
      let deletingUserIds:any = [];
      let deletingPrevIds:any = [];
      for(let user of this.groupAddiingUsers)insertingUserIds.push(user.user_id);
      for(let user of this.groupRemovingUsers)deletingUserIds.push(user.user_id);
      for(let previlege of this.groupAddiingPrevilege)insertingPrevIds.push(previlege.privilege_id);
      for(let previlege of this.groupRemovingPrevilege)deletingPrevIds.push(previlege.privilege_id);
      console.log(this.currentEdithGroup);
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'in-auth-token': sessionStorage.getItem('in-auth-token')
      });
      
      let url3 = environment.Url+`/api/v1/group/add_users?group_id=${this.currentEdithGroup.group_id}`;
      let req3 = {
          "user_ids":insertingUserIds
      }
      let url4 = environment.Url+`/api/v1/group/remove_users?group_id=${this.currentEdithGroup.group_id}`;
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

      let url1 = environment.Url+`/api/v1/group/add_privileges?group_id=${this.currentEdithGroup.group_id}`;
      let request1 = {
        "privileges":insertingPrevIds
      }
      let url2 = environment.Url+`/api/v1/group/remove_privileges?group_id=${this.currentEdithGroup.group_id}`;
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

      this.showSuccess(`Group ${this.currentEdithGroup.group_id} Sucessfully Updated`);
      this.isEdith = false;
      this.groupAddiingPrevilege = [];
      this.groupAddiingUsers = [];
      this.groupRemovingUsers = [];
      this.groupRemovingPrevilege = [];
      this.previleges = [];
      this.groupUsers = [];
      this.currentEdithGroup = undefined;
  }
  edithGroup(group:any,index:any){
      this.groupUsers = [];
      this.groupPrevilege=[];
      this.groupRemovingPrevilege = [];
      this.groupRemovingUsers = [];
      this.groupAddiingPrevilege = [];
      this.groupAddiingUsers = [];
      this.isEdith = true;
      this.currentEdithGroup = {...group};
      this.commonServices.fetchPrevileges().then((response)=>{
          this.previleges = response;
      },(error)=>{
          this.commonServices.showError(JSON.stringify(error.error.desc));
          if(error.error.status==-106){
            this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
          }
      })
      
      this.commonServices.fetchGroupUsers(group.group_id).then((responce)=>{
          console.log(responce);
          this.groupUsers = responce;
      },(error)=>{
            this.commonServices.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
      })
      this.commonServices.fetchGroupPrevileges(group.group_id).then((responce)=>{
          console.log(responce);
          this.groupPrevilege = responce;
      },(error)=>{
            this.commonServices.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
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
  clickOnOption(index:any,userEmail:any,optionElemenet:any){
    this.searchUserEmail = userEmail;
    this.dummyUsers = [...this.users];
    this.users=[];
    console.log(index,userEmail,optionElemenet);
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
          index = this.commonServices.searchInArray(this.groupUsers,userValue.email,'email');
          if(index==undefined){
              index = this.commonServices.searchInArray(this.groupRemovingUsers,userValue.email,'email');
              if(index==undefined){
                this.groupUsers.push(userValue);
                this.groupAddiingUsers.push(userValue);
              }
              else{
                this.groupRemovingUsers.splice(index,1);
                this.groupUsers.push(userValue);
                this.groupAddiingUsers.push(userValue);
              }
          }
          console.log(this.groupAddiingUsers);
      }
      else{
          this.commonServices.showError("Entered Email Is Not In System");
      }
      console.log(userValue);
  }
  removeUserFromGroup(user:any,index:any){
    let index1 = this.commonServices.searchInArray(this.groupAddiingUsers,user.email,'email');
    if(index1!=undefined)
        this.groupAddiingUsers.splice(index1,1);
    else{
        this.groupRemovingUsers.push({...user});
        this.groupUsers.splice(index,1);
    }
    console.log("my self siddharth");
  }
  isChecked(previlege:any,index:any):boolean{
    let index1 = this.commonServices.searchInArray(this.groupPrevilege,previlege.privilege_id,'privilege_id')
    if(index1==undefined)
       return false;
    else
       return true;
  }
  onCheckboxClick($event:any,previlege:any,index:any){
    console.log($event.target.checked);
    if($event.target.checked){
        let previlegeValue = {...previlege};
        let index1:any = this.commonServices.searchInArray(this.groupRemovingPrevilege,previlegeValue.privilege_id,'privilege_id');
        if(index1!=undefined){
            this.groupRemovingPrevilege.splice(index1,1);
        }
        index1 = this.commonServices.searchInArray(this.groupPrevilege,previlegeValue.privilege_id,'privilege_id');
        if(index1==undefined){
            this.groupAddiingPrevilege.push(previlegeValue);
        }
    }
    else{
        let previlegeValue = {...previlege};
        let index2:any = this.commonServices.searchInArray(this.groupAddiingPrevilege,previlegeValue.privilege_id,'privilege_id');
        if(index2!=undefined){
         this.groupAddiingPrevilege.splice(index2,1);
        }
        let index1 = this.commonServices.searchInArray(this.groupPrevilege,previlegeValue.privilege_id,'privilege_id');
        if(index1!=undefined){
          this.groupRemovingPrevilege.push(previlegeValue);
        }
    }
    console.log(this.groupAddiingPrevilege);
    console.log(this.groupRemovingPrevilege);
  }
  showSuccess(message:string) {
    // this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
    this.commonServices.showSuccess(message);
  }

  showInfo(message:string) {
    // this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
    this.commonServices.showInfo(message);
  }

  showWarn(message:string) {
    // this.messageService.add({ severity: 'warn', summary: 'Warn', detail: message });
    this.commonServices.showWarn(message);
  }

  showError(message:string) {
    // this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
    this.commonServices.showError(message);
  }

}
