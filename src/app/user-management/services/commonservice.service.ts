import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  data:any;
  crossButtonStyle = {
    'background-color': 'rgb(232, 232, 232)',
    'border': '1px solid gray',
    'border-radius': '4px',
    'padding': '0px 5px',
    'font-weight': '500',
    'color': 'gray'
  }
  creatHeader(temp=undefined){
      if(temp){
        const headers = new HttpHeaders({
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'in-auth-token': sessionStorage.getItem('in-auth-token')
        });
        return headers;
      }
      else{
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'in-auth-token': sessionStorage.getItem('in-auth-token')
        });
        return headers;
      }
  }
  constructor(private http: HttpClient,private messageService: MessageService) { }/* New function We Making for calling API*/

  deleteAPICall(url:string, headers:any):Observable<any>{
    return this.http.delete<any>(url, { headers });
  }
  putAPICall(url: string, request: any, headers:any): Observable<any> {
      return this.http.put<any>(url, request, { headers });
  }
  postAPICall(url:string,data: any,headers:any): Observable<any> {/* New function We Making for calling API*/
    return this.http.post<any>(url, data, { headers });
  }
  getAPICall(url:string,headers:any):Observable<any> {/* New function We Making for calling API*/
    return this.http.get<any>(url, { headers: headers } ); 
  }
  fetchRolePrevileges(role_id: any): Observable<any> {
    return this.getAPICall(environment.Url+`/api/v1/role/privileges?role_id=${role_id}`, this.creatHeader())
      .pipe(
        catchError((error) => {
          return throwError(JSON.stringify(error));
        })
      );
  }
  fetchRoleUsers(role_id:any):Observable<any> {
    return this.getAPICall(environment.Url+`/api/v1/role/users?role_id=${role_id}`, this.creatHeader())
    .pipe(
      catchError((error) => {
        return throwError(JSON.stringify(error));
      })
    );
  }
  searchInArray(givenArray:any,value:any,mapString:string):any{
    for(let index=0;index<givenArray.length;index=index+1){
      if(givenArray[index][mapString]==value){
        return index;
      }
    }
    return undefined;
  }
  floorValue(data){
    return Math.floor(data);
  }
  fetchGroupUsers(group_id:string){
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'in-auth-token': sessionStorage.getItem('in-auth-token')
      });
      return new Promise((resolve,reject)=>{
          this.callGETAPI(environment.Url+`/api/v1/group/users?group_id=${group_id}`,headers).then((response)=>{
              resolve(response);
          },(error)=>{
              reject(error);
          })
      })
  }

  fetchGroupPrevileges(group_id:string){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'in-auth-token': sessionStorage.getItem('in-auth-token')
      });
      return new Promise((resolve,reject)=>{
        this.callGETAPI(environment.Url+`/api/v1/group/privileges?group_id=${group_id}`,headers).then((response)=>{
            resolve(response);
        },(error)=>{
            reject(error);
        })
    })
  }
  fetchUsers(limit:any,offset:any,searchString:any){
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'in-auth-token': sessionStorage.getItem('in-auth-token')
    });
    const request = {
        "offset": offset,
        "limit": limit,
        "searchString": searchString
    }
    return new Promise((resolve,reject)=>{
        this.callPOSTAPI(environment.Url+'/api/v1/user/fetch_users',request,headers).then((responce)=>{
            resolve(responce);
        },(error)=>{
            reject(error);
        })
    }) 
  }
  fetchPrevileges(){
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'in-auth-token': sessionStorage.getItem('in-auth-token')
      });
      return new Promise((resolve,reject)=>{
        this.callGETAPI(environment.Url+'/privileges/fetch-privileges',headers).then((responce)=>{
          resolve(responce);
        },(error)=>{
          reject(error);
        })
      })  
  }
  callGETAPI(url:string,headers:any){
      return new Promise((resolve,reject)=>{
          this.http.get(url,{headers:headers}).toPromise().then((responce:any)=>{
              if(responce.Error){
                  reject(JSON.stringify(responce.Error));
              }
              else{
                  resolve(responce);
              }
          },(error)=>{
            reject(error);
          })
      })
  }
  callPOSTAPI(url: string,req: any,headers: any){

    return new Promise((resolve,reject)=>{
        this.http.post(url,req,{headers:headers}).toPromise().then((responce:any)=>{
            if(responce.Error){
                reject(JSON.stringify(responce.Error));
                console.log("hello world");
            }
            else{
                console.log(responce);
                resolve(responce);
            }
        },(error)=>{
          reject(error);
        })
    })
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
