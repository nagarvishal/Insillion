import { Component } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { CommonserviceService } from '../../user-management/services/commonservice.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';




@Component({
  selector: 'app-manage-plugins',
  templateUrl: './manage-plugins.component.html',
  styleUrl: './manage-plugins.component.css'
})
export class ManagePluginsComponent {
  // title:string = "vishal";
  // editorOptions = {theme: 'vs-dark', language: 'javascript'};
  // code: string= 'function x() {\nconsole.log("Hello world!");\n}';
  offset: number = 0;
  limit: number = 7;
  searchString: string = "";
  pluginsData: any = [];
  noOfColumn: number = 10;
  numOfButton: any;
  buttonArray: any = [];
  activeButton: string = '1';
  constructor(private http:HttpClient,public commonServices : CommonserviceService,private router: Router){
    this.fetchPluginDetails();
  }
  fetchPluginDetails(){
    let url = environment.Url+"/api/v1/plugin/plugin_list";
    let headers = this.commonServices.creatHeader();
    let req = {
          "offset": this.offset,
          "limit": this.limit,
          "searchString": this.searchString
    }
    this.commonServices.postAPICall(url,req,headers).subscribe({
      next:(responce:any)=>{
        this.pluginsData = responce.pluginData;
        this.noOfColumn = responce.noOfColumn;
        this.numOfButton = Math.ceil((this.noOfColumn[0].No_of_Column) / this.limit);
        console.log(this.numOfButton);
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
      error:(error:any)=>{
            this.commonServices.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
      },
      complete:()=>{
        console.log('successfully fetch plugin data');
      }
    })
  }
  changeLimitSearch(){
    this.fetchPluginDetails();
  }
  onChangeFile($event:any){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'in-auth-token': sessionStorage.getItem('in-auth-token')
   });
    if($event.target.files.length>0){
      const file = $event.target.files[0];
      console.log(file);
      const formData = new FormData();
      formData.append('file',file);
      this.http.post(environment.Url+"/api/v1/plugin/upload",formData,{headers}).subscribe((res:any)=>{
        console.log(res);
      })
    }
  }

  edithPlugin(plugin:any,index:any){
    
    this.router.navigate(['/plugin-management/plugin-file'],{ queryParams: { plugin_id:plugin.plugin_id, plugin_name:plugin.plugin_name } });

  }
  navigationClick($event: any, element: any, parent: any) {
    if (this.numOfButton <= 7) {
        this.activeButton = element.textContent;
        this.offset = (Number(element.textContent) - 1) * this.limit;
        this.fetchPluginDetails();
    }
    else {
      let valueMap = new Map();
      for (let index = 1; index <= 7; index = index + 1) {
          valueMap.set(parent.children[index].textContent, index);
      }
      let clickContent = element.textContent;
      if(clickContent!='.........')this.activeButton = element.textContent;

      if (valueMap.get(clickContent) == 1) {
        this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchPluginDetails();
        for (let index = 1; index <= 6; index = index + 1) {
            if (index == 6)
                parent.children[index].textContent = '.........';
            else
                parent.children[index].textContent = index;
        }
      }
      else if (valueMap.get(clickContent) == 2) {
          if(element.textContent!='.........'){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchPluginDetails();
          }
      }
      else if (valueMap.get(clickContent) == 3) {
          if(element.textContent==3){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchPluginDetails();
          }
          else if(element.textContent==4){
              this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchPluginDetails();
              for (let index = 1; index <= 6; index = index + 1) {
                  if (index == 6)
                      parent.children[index].textContent = '.........';
                  else
                      parent.children[index].textContent = index;
              }
          }
          else{
            this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchPluginDetails();
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
          this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchPluginDetails();
      }
      else if (valueMap.get(clickContent) == 5) {
        if(element.textContent==5){
          this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchPluginDetails();
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
           this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchPluginDetails();
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
            this.offset = (Number(element.textContent) - 1) * this.limit; this.fetchPluginDetails();
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
            this.fetchPluginDetails();
        }
      }
      else {
          this.offset = (Number(element.textContent) - 1) * this.limit;
          this.fetchPluginDetails();
          for (let index = 7; index >= 2; index = index - 1) {
              if (index == 2)
                  parent.children[index].textContent = '.........';
              else
                  parent.children[index].textContent = this.numOfButton+index-7;    
          }
      }
    }
  }
}
