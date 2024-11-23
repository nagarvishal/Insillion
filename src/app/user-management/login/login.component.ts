import { Component ,OnInit} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonserviceService } from '../services/commonservice.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  form:any;
  Error:any=false;
  constructor(private authService:AuthService,private http: HttpClient,private fb:FormBuilder,public commonService:CommonserviceService,private router: Router,private route : ActivatedRoute) {

    this.form = fb.group({
      email:['',[Validators.required,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      password:['',[Validators.required]]
    })

  }
  get email(){
    return this.form.get('email');
  }
  get password(){
    return this.form.get('password');
  }
  onSubmit(){
    let req:any = {
      "email":this.form.value.email,
      "password":this.form.value.password
    }
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    });
    this.commonService.callPOSTAPI(environment.Url+'/auth',req,headers).then((responce:any)=>{
        console.log(responce);
        sessionStorage.setItem('user_id',responce["user_id"]);
        sessionStorage.setItem('user_name',responce["user_name"]);
        sessionStorage.setItem('in-auth-token',responce["in-auth-token"]);
        console.log(responce);
        this.router.navigate(['/']);
    },(err)=>{
      console.log(err);
      this.commonService.showError(JSON.stringify(err.error?err.error:err));
    })
  }
  onChange(){
    console.log(this.email);
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((value)=>{

      if(value.get("redirect")=="true"){
        console.log(value.get("desc"));
        setTimeout(()=>{
          this.commonService.showError(value.get('desc'));
        },1000)
      }
    })
  }
}
