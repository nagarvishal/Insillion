import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonserviceService } from '../../user-management/services/commonservice.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'brace';
import 'brace/mode/text';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/mode/javascript';
import 'brace/mode/json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-plugin-files',
  templateUrl: './manage-plugin-files.component.html',
  styleUrl: './manage-plugin-files.component.css'
})
export class ManagePluginFilesComponent {
  plugin_id:string;
  plugin_name:string;
  fileList:any = [];
  fileData:string = '';
  fileExs:any;
  edithMode:boolean = false;
  FileName:string = '';
  mode:string = 'javascript';
  config: { [key: string]: any } = {
    useWrapMode: true,
    fontSize: '12.5px',
    fontFamily:'monaco,Consolas,Lucida Console,monospace'
  };
  constructor(private route: ActivatedRoute,public commonServices : CommonserviceService,public http:HttpClient,private router:Router){

  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.plugin_id = params['plugin_id'];
      this.plugin_name = params['plugin_name'];
    });
    this.fetchFileList();
  }
  fetchFileList(){
      let headers = this.commonServices.creatHeader();
      headers['Content-Type'] = "text/plain";
      let url = environment.Url+`/api/v1/plugin/file_list?plugin_id=${this.plugin_id}`;
      this.commonServices.getAPICall(url,headers).subscribe({
        next:(response)=>{
            this.fileList = response;
            console.log(this.fileList);
        },
        error:(error)=>{
            this.commonServices.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
        },
        complete:()=>{
            console.log("sucessfully completed");
        }
      })
  }
  fetchFileData(file_exetension:any,file_name:string){
      this.edithMode = true;
      this.fileExs = file_exetension;
      this.FileName = file_name;
      if(this.fileExs=='.js'){
        this.mode = 'javascript';
      }
      else{
        this.mode = 'json';
      }
      let url = environment.Url+`/api/v1/plugin/file_data?plugin_id=${this.plugin_id}&file_extension=${file_exetension}`;

      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'in-auth-token': sessionStorage.getItem('in-auth-token')
      }).set('Accept', 'application/octet-stream');

      this.http.get(url,{headers,responseType: 'blob'}).subscribe({
          next:(blob)=>{
              console.log(blob);
              const reader = new FileReader();
              reader.readAsText(blob);
              reader.onloadend = () => {
                  const textData = reader.result as string;
                  this.fileData = textData;
                // Use textData here for further processing
              };
          },
          error:(error)=>{
              this.commonServices.showError(JSON.stringify(error.error.desc));
              if(error.error.status==-106){
                this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
              }
          },
          complete:()=>{
              console.log("successfully");
          }
      })
      console.log(file_exetension);
  }
  submitFileData(){
    const headers = new HttpHeaders({
      'plugin_id':this.plugin_id,
      'file_extension':this.fileExs,
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'in-auth-token': sessionStorage.getItem('in-auth-token')
    });
      const fileData = new Blob([this.fileData], { type: 'text/plain' });
      console.log(typeof(this.fileData));
      const formData = new FormData();
      formData.append('file', fileData, this.fileExs=='.js'?'data.js':'data.json');
      this.http.post(environment.Url+'/api/v1/plugin/file_upload',formData,{headers}).subscribe({
        next:(responce)=>{
          console.log(responce);
        },
        error:(error)=>{
            this.commonServices.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
        },
        complete:()=>{
          console.log("complete");
        }
      })
      
  }
}
