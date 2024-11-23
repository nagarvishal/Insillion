import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    profile:any;
    products:any;
    color1:any = ['#E31836','#359FF4','#b2b3b5','#603cba','rgb(231, 92, 0)','#669AD3'];
    color2:any = ['rgb(228, 112, 77)','rgb(118, 189, 248)','#d7d8da','#b499f8','rgb(228, 143, 87)','rgb(147, 195, 247)']
    constructor(public productService : ProductService){
      this.profileAPI();
    }
    profileAPI(){
        const headers = this.productService.service.creatHeader();
        const url = environment.Url+"/api/v1/profile?x=1&pages=1&priv=1&menu=1&routes=1";
        this.productService.service.getAPICall(url,headers).subscribe({
            next:(response)=>{
                this.profile = response.data;
                this.products = response.data.products;
            },
            error:(error)=>{
                console.log("this is error is comming from backend");
            },
            complete:()=>{
                console.log("process has been completed");
            }
        })
    }
    
}
