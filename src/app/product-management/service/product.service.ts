import { Injectable } from '@angular/core';
import { CommonserviceService } from '../../user-management/services/commonservice.service';
import { FormBuilder,Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  icons:any = {
    "Product Details" : "bi bi-usb-symbol fs-5",
    "NSTP" : "bi bi-diagram-3-fill fs-6",
    "Renewals" : "bi bi-diagram-3-fill fs-6",
    "Access Control" : "bi bi-person-fill-lock fs-5",
    "Catalog" : "bi bi-file-earmark-break-fill",
    "Custom Fields" : "bi bi-columns",
    "Master Policy" : "bi bi-boxes",
    "Rules" : "bi bi-file-earmark-text-fill",
    "Files" : "bi bi-file-earmark-text-fill",
    "Quotation":"bi bi-calculator-fill",
    "Proposal":"bi bi-file-earmark-text-fill",
    "Documents":"bi bi-files",
    "NSTP Approval":"bi bi-sign-turn-right-fill",
    "Payment":"bi bi-credit-card",
    "ckyc":"bi bi-credit-card",
    "Policy":"bi bi-arrow-through-heart-fill"
  }
  constructor(public service:CommonserviceService,public fb: FormBuilder) { 

  }

  dynamicForm(workflow:any){
      let today:any = new Date();
      today  = today.toISOString().split('T')[0];
      let group = {};
      for(let field of workflow.fields){
          if(field.type!='button'){
              if(field.type=="string"){
                group[field.field_name] = [field.default?field.default:""];
              }
              else if(field.type=="number"){
                  group[field.field_name] = [field.default?field.default:0];
              }
              else if(field.type=="lookup"){
                  group[field.field_name] = [field.default?field.default:""];
              }
              else if(field.type=="date"){
                  group[field.field_name] = [field.default?field.default:today];
              }
              else if(field.type=="textbox"){
                  group[field.field_name] = [field.default?field.default:""];
              }
              else if(field.type=="faicon"){
                  group[field.field_name] = [field.default?field.default:""];
              }
              else if(field.type=="file"){
                  group[field.field_name] = [""];
              }
              else if(field.type="checkbox"){
                  group[field.field_name] = [field.default?field.default:false];
              }

              var validations = [];
              if(field.validate){
                  if(typeof(field.validate)=='string'){
                      
                      validations.push(Validators[field.validate])
                  }
                  else if(Array.isArray(field.validate)){
                      for(let validation in field.validate){
                          if(typeof(validation)=="string"){
                            validations.push(Validators[validation]);
                          }
                          else if(Array.isArray(validation)){
                            validations.push(Validators[typeof(validation[0])=="string"?validation[0]:""](validation[1]));
                          }
                          else{

                          }
                      }
                  }
                  else{
                    
                  }
              }
              group[field.field_name].push(validations);
          }
          
      }
      let form = this.fb.group(group);
      return form;
  }
  dynamicForm1(workflow:any,name:string,data:any){
    let formcontrols = {};
    let today:any = new Date();
    today  = today.toISOString().split('T')[0];
    for(let stage of workflow.stages){
         if(stage["module"] && stage["module"]["name"]==name){
            for(let group of stage.form.groups){
                for(let field of group.fields){
                    if(field.type!='button'){
                        if(field.type=="string"){
                          formcontrols[field.field_name] = [data[field.field_name]?data[field.field_name]:field.default?field.default:""];
                        }
                        else if(field.type=="number"){
                            formcontrols[field.field_name] = [data[field.field_name]?data[field.field_name]:field.default?field.default:0];
                        }
                        else if(field.type=="lookup"){
                            formcontrols[field.field_name] = [data[field.field_name]?data[field.field_name]:field.default?field.default:""];
                        }
                        else if(field.type=="date"){
                            formcontrols[field.field_name] = [data[field.field_name]?data[field.field_name]:field.default?field.default:today];
                        }
                        else if(field.type=="textbox"){
                            formcontrols[field.field_name] = [data[field.field_name]?data[field.field_name]:field.default?field.default:""];
                        }
                        else if(field.type=="faicon"){
                            formcontrols[field.field_name] = [data[field.field_name]?data[field.field_name]:field.default?field.default:""];
                        }
                        else if(field.type=="file"){
                            formcontrols[field.field_name] = [""];
                        }
                        else if(field.type="checkbox"){
                            formcontrols[field.field_name] = [data[field.field_name]?data[field.field_name]:field.default?field.default:false];
                        }
                        else if(field.type="array"){
                            formcontrols[field.field_name] = this.fb.array([]);
                        }
                        else if(field.type="object"){
                            formcontrols[field.field_name] = this.fb.group({});
                            continue;
                        }
                        else{
                            formcontrols[field.field_name] = ["",[]];
                            continue;
                        }
            
                        var validations = [];
                        if(field.validate){
                            if(typeof(field.validate)=='string'){
                                validations.push(Validators[field.validate])
                            }
                            else if(Array.isArray(field.validate)){
                                for(let validation in field.validate){
                                    if(typeof(validation)=="string"){
                                      validations.push(Validators[validation]);
                                    }
                                    else if(Array.isArray(validation)){
                                      validations.push(Validators[typeof(validation[0])=="string"?validation[0]:""](validation[1]));
                                    }
                                    else{
            
                                    }
                                }
                            }
                            else{
                              
                            }
                        }
                        formcontrols[field.field_name].push(validations);
                    }  
                }
            }
         }
    }
    let form = this.fb.group(formcontrols);
    console.log("form control=>",form);
    return form;
  }
  fetchsource(url:string,field:any){
      url = environment.Url+url;
      console.log(url);
      let headers = this.service.creatHeader();

      this.service.getAPICall(url,headers).subscribe({
          next:(response)=>{
              if(response.data && Array.isArray(response.data)){
                  for(let data of response.data){
                      if(Array.isArray(field.options)){
                          field.options.push({
                            "name":data[field.source.name],
                            "value":data[field.source.value]
                          })
                      }
                  }
              }
          },
          error:(err)=>{
              console.log(err);
          },
          complete:()=>{
              console.log("complete");
          }
      })
  }
  uploadfile(url:string,field:any){

  }

  
}
