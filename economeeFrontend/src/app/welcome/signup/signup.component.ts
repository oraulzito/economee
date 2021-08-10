import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CurrencyService} from '../../../state/currency/currency.service';
import {CurrencyQuery} from '../../../state/currency/currency.query';
import {Currency} from '../../../state/currency/currency.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  actualStep = 1;
  sumbitted = false;
  currencies: Currency[];

  form = new FormGroup({
    // personal info
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    gender: new FormControl(null, [Validators.required]),
    // profile info
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    repeat_password: new FormControl('', [Validators.required]),
    photo: new FormControl(null, [Validators.required]),
    // account details
    account_name: new FormControl('', Validators.required),
    currency: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private currencyQuery: CurrencyQuery
  ) {

  }

  ngOnInit(): void {
    // FIXME change it to query selection after the get
    this.currencyService.get().subscribe(
      c => this.currencies = c
    );

    console.log(this.currencies);
  }

  submit(): void {
    this.sumbitted = true;

    if (!this.form.valid) {
      this.form.markAllAsTouched();
    }

    console.log('Submitted data', this.form.value);
  }
}
