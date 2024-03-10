import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../../../core/state/user/session/session.service';
import {SessionQuery} from '../../../core/state/user/session/session.query';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loadingLogin: boolean;
  error = false;
  formItems = [
    {
      name: 'username',
      type: 'text',
      label: 'Nome de usuário',
      errorTip: {
        required: 'O nome de usuário é obrigatório',
        error: 'O nome de usuário não existe',
      },
      icon: 'user',
      size: {
        sm: 24
      },
    },
    {
      name: 'password',
      type: 'password',
      label: 'Senha',
      errorTip: {
        required: 'A senha é obrigatória',
        error: 'A senha não confere'
      },
      icon: 'lock',
      size: {
        sm: 24
      },
    },
  ]

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private sessionQuery: SessionQuery,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.sessionQuery.selectLoading().subscribe(r => this.loadingLogin = r);
    this.sessionQuery.selectError().subscribe(r => this.error = r);

    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.sessionQuery.isLoggedIn$.subscribe(
      l => l ? this.router.navigateByUrl('dashboard').then() : null
    )
  }

  register() {
    this.router.navigateByUrl('signin').then();
  }

  submitForm(): void {
    // if the form is valid, then call the login function in the session service, then redirect to the dashboard
    if (this.loginForm.valid) {
      this.sessionService.login(this.loginForm.value);  // call the login function in the session service
    }
  }

}
