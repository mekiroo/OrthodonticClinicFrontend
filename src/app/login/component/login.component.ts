import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../service/login.service';
import {LoginRequest} from '../payload/login.request';

import {AuthService} from '../../_security/service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  sendingRequest = false;
  loginFailed = false;

  constructor(private loginService: LoginService, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  public onSubmit(): void {
    const loginRequest = this.getLoginRequestFromLoginForm();
    this.sendingRequest = true;
    this.loginFailed = false;
    this.loginService.login(loginRequest).subscribe(response => {
        this.authService.saveJwt(response.jwt);
        const user = this.authService.getUserFromJwt(response.jwt);
        this.authService.saveUser(user);
        this.sendingRequest = false;
        // Navigate to home page:
        this.router.navigate(['/']);
      }, error => {
        console.log(error);
        this.loginFailed = true;
        this.sendingRequest = false;
      }
    );
  }

  private getLoginRequestFromLoginForm(): LoginRequest {
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;

    return {
      username,
      password
    };
  }
}
