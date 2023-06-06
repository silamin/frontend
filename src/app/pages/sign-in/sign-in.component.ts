import { Component } from '@angular/core';
import {AuthServiceService} from "../../services/auth-service.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {LoginRegisterFormControlNames} from "../../interfaces/control-names";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  loginRegisterForm: FormGroup;
  isLoading: boolean = false;
  LoginRegisterFormControlNames = LoginRegisterFormControlNames;


  constructor(private fb: FormBuilder,
              private authService: AuthServiceService,
              private toastr: ToastrService) {
    // Initialize form groups for login and register
    this.loginRegisterForm = this.fb.group({
      [LoginRegisterFormControlNames.Email]: ['', Validators.required],
      [LoginRegisterFormControlNames.Password]: ['', Validators.required],
      [LoginRegisterFormControlNames.Username]: [''],
      [LoginRegisterFormControlNames.IsRecruiter]: [false],
      [LoginRegisterFormControlNames.IsLogin]: [true]
    });
  }

  // Function to switch to registration form
  async register() {
    this.isLoading = true;
    try {
      await this.authService.register(this.loginRegisterForm);
      this.toastr.success('Registration successful');
    } catch (error) {
      this.toastr.error('Registration failed');
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

// Function to switch to login form
  async login() {
    this.isLoading = true;
    try {
      await this.authService.login(this.loginRegisterForm);
      this.toastr.success('Login successful');
    } catch (error) {
      this.toastr.error('Login failed');
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }



  switchToRegister(): void {
    this.loginRegisterForm.get(LoginRegisterFormControlNames.IsLogin)?.setValue(false);
  }

  switchToLogin(): void {
    this.loginRegisterForm.get(LoginRegisterFormControlNames.IsLogin)?.setValue(true);
  }
}
