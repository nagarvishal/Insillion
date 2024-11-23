import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products:any = [];
  schema:any = [];
  limit:number = 7;
  searchString:string = "";
  offset:number = 0;
  no_of_column:number = 0;
  no_of_button:number = 0;
  buttonArray:any = [];
  activeButton: string = '1';
  productData:any = [];
  productArray:any = [];
  constructor(public productService:ProductService){
    this.fetchproducts();
  }
  fetchproducts(){
    let url = environment.Url+"/api/v1/products?schema=1&nodata=1&fields=product_id,wf_id,product_name,display_name,product_group_id,valid_from,valid_till,product_type,publish_date";
    let headers = this.productService.service.creatHeader();

    this.productService.service.getAPICall(url,headers).subscribe({
      next:(response)=>{
        this.products = response.data;
        this.schema = response.schema;
        this.productData = [];
        this.productArray = response.data;
        this.no_of_column = this.productArray.length;
        this.no_of_button = Math.ceil((this.no_of_column) / this.limit);
        for(let i=this.offset;i<(this.limit+this.offset) && i<this.productArray.length;i++){
          this.productData.push(this.productArray[i]);
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
        console.log(this.buttonArray);
        console.log(this.productData);

      },
      error:(error)=>{
        console.log(error);
      },
      complete:()=>{
        console.log("process has been completed");
      }
    })

  }
  changeLimit(){
    this.productData = [];
    this.no_of_column = this.productArray.length;
    this.no_of_button = Math.ceil((this.no_of_column) / this.limit);
    for(let i=0;i<this.limit && i<this.productArray.length;i++){
      this.productData.push(this.productArray[i]);
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
  changeOffSet(offset:number){
      this.productData = [];
      for(let i=offset;i<offset+Number(this.limit) && i<this.productArray.length;i++ ){
        this.productData.push(this.productArray[i]);
      }
      return;
  }
  changeSearch(){

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
  
}
