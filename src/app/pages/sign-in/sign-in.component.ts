import { Component } from '@angular/core';
import {AuthServiceService} from "../../services/auth-service.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  loginRegisterForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthServiceService) {
    // Initialize form groups for login and register
    this.loginRegisterForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      username: [''],
      isRecruiter: [false],
      isLogin: [true]
    });
  }

  // Flag to switch between login and register forms
  isRegistering: boolean = false;

  // Function to switch to registration form
  async register(): Promise<void> {
    await this.authService.register(this.loginRegisterForm);
  }

  // Function to switch to login form
  async login(): Promise<void> {
    this.authService.login(this.loginRegisterForm);
  }


  switchToRegister(): void {
    this.loginRegisterForm.get('isLogin')?.setValue(false);
  }

  switchToLogin(): void {
    this.loginRegisterForm.get('isLogin')?.setValue(true);
  }
}
