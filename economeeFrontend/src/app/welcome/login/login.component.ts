import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../../../state/session/session.service';
import {Router} from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  error = false;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
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
