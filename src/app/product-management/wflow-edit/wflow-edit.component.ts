import { Component } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonserviceService } from '../../user-management/services/commonservice.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-wflow-edit',
  templateUrl: './wflow-edit.component.html',
  styleUrl: './wflow-edit.component.css'
})
export class WflowEditComponent {
  addMode:boolean = false;
  edithMode:boolean = false;
  fileData:string = '';
  mode:string = 'json';
  offset: number = 0;
  limit: number = 7;
  searchString: string = "";
  workflowData:any = [];
  no_of_column:number = 0;
  no_of_button:number = 0;
  buttonArray:any = [];
  activeButton: string = '1';
  cworkflow:any;
  config: { [key: string]: any } = {
    useWrapMode: true,
    fontSize: '12.5px',
    fontFamily:'monaco,Consolas,Lucida Console,monospace'
  };
  constructor(private route: ActivatedRoute,public services : CommonserviceService,public http:HttpClient,private router:Router){
   this.__fetch_workflow_details()
  }
  changeLimitSearch(){
    this.__fetch_workflow_details();
  }

  __fetch_workflow_details(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'in-auth-token': sessionStorage.getItem('in-auth-token')
    });
    this.services.getAPICall(environment.Url+`/api/v1/wf/workflow_list?search=${this.searchString}&limit=${this.limit}&offset=${this.offset}`,headers).subscribe({
      next: (response) => {
        this.workflowData = response.workflows;
        this.no_of_column = response["columns"][0].columns;
        this.no_of_button = Math.ceil((this.no_of_column) / this.limit);
        this.buttonArray = [];
        if (this.no_of_button <= 7) {
          for (let index = 0; index <= this.no_of_button - 1; index = index + 1)this.buttonArray.push(index + 1);
        }
        else {
            for (let index = 0; index <= 6; index = index + 1) {
                if (index == 5)
                  this.buttonArray[index] = '.........';
                else if (index == 6)
                  this.buttonArray[index] = this.no_of_button;
                else
                  this.buttonArray[index] = index + 1;
            }
        }
      },
      error: (error) => {
          this.services.showError(JSON.stringify(error.error.desc));
          if(error.error.status==-106){
            this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
          }
      },
      complete: () => {
        console.log('this function is complete');
      }
    })
  }
  navigationClick($event: any, element: any, parent: any) {
    if (this.no_of_button <= 7) {
        this.activeButton = element.textContent;
        this.offset = (Number(element.textContent) - 1) * this.limit;
        this.__fetch_workflow_details();
    }
    else {
      let valueMap = new Map();
      for (let index = 1; index <= 7; index = index + 1) {
          valueMap.set(parent.children[index].textContent, index);
      }
      let clickContent = element.textContent;
      if(clickContent!='.........')this.activeButton = element.textContent;

      if (valueMap.get(clickContent) == 1) {
        this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_workflow_details();
        for (let index = 1; index <= 6; index = index + 1) {
            if (index == 6)
                parent.children[index].textContent = '.........';
            else
                parent.children[index].textContent = index;
        }
      }
      else if (valueMap.get(clickContent) == 2) {
          if(element.textContent!='.........'){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_workflow_details();
          }
      }
      else if (valueMap.get(clickContent) == 3) {
          if(element.textContent==3){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_workflow_details();
          }
          else if(element.textContent==4){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_workflow_details();
              for (let index = 1; index <= 6; index = index + 1) {
                  if (index == 6)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = index;
              }
          }
          else{
            this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_workflow_details();
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
          this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_workflow_details();
      }
      else if (valueMap.get(clickContent) == 5) {
        if(element.textContent==5){
          this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_workflow_details();
          parent.children[2].textContent='.........';
          if(parent.children[6].textContent=='.........'){
              if(element.textContent==this.no_of_button-3){
                for (let index = 7; index >= 2; index = index - 1) {
                    if (index == 2)
                        parent.children[index].textContent = '.........';
                    else
                        parent.children[index].textContent = this.no_of_button+index-7;    
                }
             }
            else{
                parent.children[3].textContent=Number(element.textContent)-1;
                parent.children[4].textContent=Number(element.textContent);
                parent.children[5].textContent=Number(element.textContent)+1;
            }
          }
        }
        else if(element.textContent==this.no_of_button-3){
           this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_workflow_details();
           if(parent.children[6].textContent=='.........'){
              for (let index = 7; index >= 2; index = index - 1) {
                  if (index == 2)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = this.no_of_button+index-7;    
              }
           }
        }
        else{
            this.offset = (Number(element.textContent) - 1) * this.limit; this.__fetch_workflow_details();
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
            this.__fetch_workflow_details();
        }
      }
      else {
          this.offset = (Number(element.textContent) - 1) * this.limit;
          this.__fetch_workflow_details();
          for (let index = 7; index >= 2; index = index - 1) {
              if (index == 2)
                  parent.children[index].textContent = '.........';
              else
                  parent.children[index].textContent = this.no_of_button+index-7;    
          }
      }
    }
  }
  submitFileData(){
      let headers = this.services.creatHeader();
      let url = environment.Url+"/api/v1/wf/workflow";
      let request = {
        text:this.fileData
      }
      this.services.postAPICall(url,request,headers).subscribe({
        next:(response)=>{
          console.log(response);
        },
        error:(error)=>{
          this.services.showError(JSON.stringify(error.error.desc));
          if(error.error.status==-106){
            this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
          }
        },
        complete:()=>{
          console.log('process has been completed');
        }
      })
  }
  activeworkflow(temp:number,index:number){
    if(temp==1){
        this.addMode = true;
    }
    else if(temp==2){
        this.cworkflow = this.workflowData[index];
        console.log(this.cworkflow);
        this.edithMode = true;
        this.fileData = '';
        let headers = this.services.creatHeader();
        this.services.getAPICall(environment.Url+`/api/v1/wf/workflow?wf_id=${this.cworkflow.wf_id}`,headers).subscribe({
            next: (response) => {
              this.fileData = response.wf_script;
              console.log(JSON.parse(this.fileData));
            },
            error: (error) => {
                this.services.showError(JSON.stringify(error.error.desc));
                if(error.error.status==-106){
                  this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
                }
            },
            complete: () => {
              console.log("workflow fetch is complete");
            }
        })
        console.log(this.fileData);
    }
    else{

    }
  }
  submitChangedFile(){
      let headers = this.services.creatHeader();
      let url = environment.Url+`/api/v1/wf/workflow?wf_id=${this.cworkflow.wf_id}`;
      let request = {
          text:this.fileData
      }
      this.services.putAPICall(url,request,headers).subscribe({
          next:(response)=>{
            console.log(response);
          },
          error:(error)=>{
              this.services.showError(JSON.stringify(error.error.desc));
              if(error.error.status==-106){
                this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
              }
          },
          complete:()=>{
            console.log('process has been completed');
          }
      })
  }
}
