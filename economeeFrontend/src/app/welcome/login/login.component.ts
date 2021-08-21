import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../../../state/session/session.service';
import {Router} from '@angular/router';
import {SessionQuery} from '../../../state/session/session.query';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  loadingLogin$: boolean;
  error = false;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private sessionQuery: SessionQuery,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.sessionQuery.selectLoading().subscribe(r => this.loadingLogin$ = r);

    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      // remember: [true]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.sessionService.login(this.validateForm.value).subscribe(
        (r) => {
          this.router.navigate(['dashboard']);
        },
        (e) => {
          this.error = true;
        },
        () => {
        }
      );
    }
  }

}
