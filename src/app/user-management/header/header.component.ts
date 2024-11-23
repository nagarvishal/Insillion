import { Component } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  value:number = -1;
  sidebarvalue:number = -1;

  constructor(){

  }
  onMouseEnter(data:number){
    this.value = data
  }
  onMouseLeave(data:number){
    this.value = data
  }
  sideonMouseEnter(data:number){
    this.sidebarvalue = data
  }
  sideonMouseLeave(data:number){
    this.sidebarvalue = data
  }


}
