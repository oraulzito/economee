import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../../../state/session/session.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService
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
          //TODO redirect to dashboard
          console.log(r);
        },
        (e) => {
          //Todo show on screen the error, and not by alert
          alert('Um erro aconteceu: ' + e);
        },
        () => {
        }
      );
    }
  }

}
