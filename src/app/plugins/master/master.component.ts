import { Component } from '@angular/core';
import { CommonserviceService } from '../../user-management/services/commonservice.service';
import { FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrl: './master.component.css'
})
export class MasterComponent {
  groups:any = [];
  group:string = "";
  subgroups:any = [];
  subgroup:string = "";
  subsubgroups:any = [];
  subsubgroup:string = "";
  form:any;
  edithform:any;
  clicked:boolean = false;
  masterArray:any = [];
  masterData:any = [];
  limit:number = 7;
  searchString:string = "";
  offset:number = 0;
  no_of_column:number = 0;
  no_of_button:number = 0;
  buttonArray:any = [];
  activeButton: string = '1';
  isEdith:boolean = false;
  constructor(public service : CommonserviceService,public fb:FormBuilder,private router:Router){
    this.fetchgroups();
    this.form = fb.group({
      master_id:[""],
      group_name:["",Validators.required],
      group_name_1:[""],
      group_name_2:[""],
      name:["",Validators.required],
      value:["",Validators.required],
      description:[""],
      status:[0,Validators.required],
      proxy:[""],
      author:[""],
      ip:[""]
    })
  }
  get masterform(){
    return this.form.controls;
  }
  get edithMasterForm(){
    return this.edithform.controls;
  }
  fetchgroups(){
    let headers = this.service.creatHeader();
    let url = environment.Url+"/api/v1/master/group";
    this.service.getAPICall(url,headers).subscribe({
        next:(response)=>{
          this.groups = response.data;
        },
        error:(err)=>{
            this.service.showError(JSON.stringify(err.error.desc));
            if(err.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(err.error.desc)}});
            }
        },
        complete:()=>{
            console.log("process complete");
        }
    })
  }
  fetchsubgroups(){
      let headers = this.service.creatHeader();
      let url = environment.Url+`/api/v1/master/group/${this.group}`;
      this.service.getAPICall(url,headers).subscribe({
          next:(response)=>{
              this.subgroups = response.data;
              if(this.subgroups.length==1 && this.subgroups[0]==""){
                this.subgroup = "";
                this.subsubgroup = "";
                this.fetchData();
              }
          },
          error:(err)=>{
            this.service.showError(JSON.stringify(err.error.desc));
            if(err.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(err.error.desc)}});
            }
          },
          complete:()=>{
              this.subgroup = "";
              this.subsubgroup = "";
              console.log("process complete");
          }
      })
  }
  fetchsubsubgroups(){
      let headers = this.service.creatHeader();
      let url = environment.Url+`/api/v1/master/group/${this.group}/${this.subgroup}`;
      this.service.getAPICall(url,headers).subscribe({
          next:(response)=>{
              this.subsubgroups = response.data;
              if(this.subsubgroups.length==1 && this.subsubgroups[0]==''){
                this.subsubgroup = "";
                this.fetchData()
              }
          },
          error:(err)=>{
                this.service.showError(JSON.stringify(err.error.desc));
                if(err.error.status==-106){
                this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(err.error.desc)}});
                }
          },
          complete:()=>{
              this.subsubgroup = "";
              console.log("process complete");
          }
      })
  }
  fetchData(){
      let headers = this.service.creatHeader();
      let url = environment.Url+`/api/v1/master/group/${this.group}`;
      if(this.subgroup){
        url = url + `/${this.subgroup}`;
      }
      if(this.subsubgroup){
        url = url + `/${this.subsubgroup}`;
      }
      url = url + `?schema=1`;
      this.service.getAPICall(url,headers).subscribe({
          next:(response)=>{
              this.masterData = [];
              this.masterArray = response.data;
              this.no_of_column = this.masterArray.length;
              this.no_of_button = Math.ceil((this.no_of_column) / this.limit);
              for(let i=this.offset;i<(this.limit+this.offset) && i<this.masterArray.length;i++){
                  this.masterData.push(this.masterArray[i]);
              }
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
          error:(err)=>{
                this.service.showError(JSON.stringify(err.error.desc));
                if(err.error.status==-106){
                this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(err.error.desc)}});
                }
          },
          complete:()=>{
              console.log("process complete");
          }
      })
  }

  __add_Master(){
      if(this.form.invalid){
        this.clicked = true;
      }
      else{
          let headers = this.service.creatHeader();
          let url = "/api/v1/master/manage";
          let request = this.form.value;
          this.service.postAPICall(url,request,headers).subscribe({
              next:(response)=>{
                console.log(response);
              },
              error:(err)=>{
                    this.service.showError(JSON.stringify(err.error.desc));
                    if(err.error.status==-106){
                    this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(err.error.desc)}});
                    }
              },
              complete:()=>{
                  console.log("process complete");
              }
          })
      }
  }
  changeLimit(){
    this.masterData = [];
    this.no_of_column = this.masterArray.length;
    this.no_of_button = Math.ceil((this.no_of_column) / this.limit);
    for(let i=0;i<this.limit && i<this.masterArray.length;i++){
      this.masterData.push(this.masterArray[i]);
    }
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
  }
  changeSearch(){

  }
  changeOffSet(offset:number){
      this.masterData = [];
      for(let i=offset;i<offset+Number(this.limit) && i<this.masterArray.length;i++ ){
        this.masterData.push(this.masterArray[i]);
      }
      return;
  }
  navigationClick($event: any, element: any, parent: any) {
      if (this.no_of_button <= 7) {
          this.activeButton = element.textContent;
          this.offset = (Number(element.textContent) - 1) * this.limit;
          console.log("offset=>",this.offset);
          this.changeOffSet(this.offset);
      }
      else{
          let valueMap = new Map();
          for (let index = 1; index <= 7; index = index + 1) {
              valueMap.set(parent.children[index].textContent, index);
          }
          let clickContent = element.textContent;
          if(clickContent!='.........')this.activeButton = element.textContent;
          if (valueMap.get(clickContent) == 1) {
              this.offset = (Number(element.textContent) - 1) * this.limit; this.changeOffSet(this.offset);
              for (let index = 1; index <= 6; index = index + 1) {
                  if (index == 6)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = index;
              }
          }
          else if (valueMap.get(clickContent) == 2) {
              if(element.textContent!='.........'){
                  this.offset = (Number(element.textContent) - 1) * this.limit; this.changeOffSet(this.offset);
              }
          }
          else if (valueMap.get(clickContent) == 3) {
              if(element.textContent==3){
                  this.offset = (Number(element.textContent) - 1) * this.limit; this.changeOffSet(this.offset);
              }
              else if(element.textContent==4){
                  this.offset = (Number(element.textContent) - 1) * this.limit; this.changeOffSet(this.offset);
                  for (let index = 1; index <= 6; index = index + 1) {
                      if (index == 6)
                          parent.children[index].textContent = '.........';
                      else
                          parent.children[index].textContent = index;
                  }
              }
              else{
                  this.offset = (Number(element.textContent) - 1) * this.limit; this.changeOffSet(this.offset);
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
            this.offset = (Number(element.textContent) - 1) * this.limit; this.changeOffSet(this.offset);
          }
          else if (valueMap.get(clickContent) == 5) {
              if(element.textContent==5){
                  this.offset = (Number(element.textContent) - 1) * this.limit; this.changeOffSet(this.offset);
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
                this.offset = (Number(element.textContent) - 1) * this.limit; this.changeOffSet(this.offset);
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
                this.offset = (Number(element.textContent) - 1) * this.limit; this.changeOffSet(this.offset);
                if(parent.children[6].textContent=='.........'){
                    parent.children[3].textContent=Number(element.textContent)-1;
                    parent.children[4].textContent=Number(element.textContent);
                    parent.children[5].textContent=Number(element.textContent)+1;
                }
            }
          }
          else if (valueMap.get(clickContent) == 6) {
              if(element.textContent!='.........'){
                  this.offset = (Number(element.textContent) - 1) * this.limit;this.changeOffSet(this.offset);
              }
          }
          else {
              this.offset = (Number(element.textContent) - 1) * this.limit;this.changeOffSet(this.offset);
              for (let index = 7; index >= 2; index = index - 1) {
                  if (index == 2)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = this.no_of_button+index-7;    
              }
          }
      }
  }

  edithMaster(index:number){
    this.isEdith = true;
    this.edithform = this.fb.group({
      master_id:[this.masterData[index].master_id],
      group_name:[this.masterData[index].group_name,Validators.required],
      group_name_1:[this.masterData[index].group_name_1],
      group_name_2:[this.masterData[index].group_name_2],
      name:[this.masterData[index].name,Validators.required],
      value:[this.masterData[index].value,Validators.required],
      description:[this.masterData[index].description],
      status:[this.masterData[index].status,Validators.required],
      proxy:[this.masterData[index].proxy],
      author:[this.masterData[index].author],
      ip:[this.masterData[index].ip]
    })
    console.log(this.edithform.value);
  }
  __edith_Master(){
      let headers = this.service.creatHeader();
      let url = environment.Url+"/api/v1/master/manage";
      let request = this.edithform.value;
      this.service.postAPICall(url,request,headers).subscribe({
          next:(response)=>{

            console.log(response);
          },
          error:(err)=>{
                this.service.showError(JSON.stringify(err.error.desc));
                if(err.error.status==-106){
                this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(err.error.desc)}});
                }
          },
          complete:()=>{
              console.log("process complete");
          }
      })
  }
}
