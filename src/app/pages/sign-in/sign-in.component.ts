import { Component } from '@angular/core';
import {AuthServiceService} from "../../services/auth-service.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  loginRegisterForm: FormGroup;
  isLoading: boolean = false;


  constructor(private fb: FormBuilder,
              private authService: AuthServiceService,
              private toastr: ToastrService) {
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
    this.loginRegisterForm.get('isLogin')?.setValue(false);
  }

  switchToLogin(): void {
    this.loginRegisterForm.get('isLogin')?.setValue(true);
  }
}
