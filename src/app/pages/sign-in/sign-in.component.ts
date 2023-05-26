import { Component } from '@angular/core';
import {AuthServiceService} from "../../services/auth-service.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  constructor(private authService: AuthServiceService) {
  }
  userlogin = true;
  userregister = false;
  //Buttons clicks functionalities
  email: any;
  passWord: any;
  user_register()
  {
    this.userlogin = false;
    this.userregister = true;

  }
  user_login()
  {
    this.userlogin = true;
    this.userregister = false;
    this.authService.login(this.email,this.passWord)
  }

}
