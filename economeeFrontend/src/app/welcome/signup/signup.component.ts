import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CurrencyService} from '../../../state/currency/currency.service';
import {CurrencyQuery} from '../../../state/currency/currency.query';
import {Currency} from '../../../state/currency/currency.model';
import {Subscription} from 'rxjs';
import {UserService} from '../../../state/user/user.service';
import {Router} from "@angular/router";
import {UserQuery} from "../../../state/user/user.query";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  currencies: Currency[];
  currenciesLoading$: boolean;
  signUpLoading$: boolean;
  error = false;

  currencySubscription: Subscription;
  currencyQuerySubscription: Subscription;
  userQueryLoadingSubscription: Subscription;
  currencyQueryLoadingSubscription: Subscription;

  form = new FormGroup({
    // personal info
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    // photo: new FormControl(null, [Validators.required]),
    // profile info
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    repeat_password: new FormControl('', [Validators.required]),
    // account details
    account_name: new FormControl('', Validators.required),
    currency_id: new FormControl('', [Validators.required]),
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private userQuery: UserQuery,
    private currencyQuery: CurrencyQuery,
    private currencyService: CurrencyService,
  ) {

  }

  ngOnInit(): void {
    this.currencyQueryLoadingSubscription = this.currencyQuery.selectLoading().subscribe(l => this.currenciesLoading$ = l);
    this.userQueryLoadingSubscription = this.userQuery.selectLoading().subscribe(s => this.signUpLoading$ = s);

    this.currencySubscription = this.currencyService.get().subscribe();

    this.currencyQuerySubscription = this.currencyQuery.selectAll().subscribe(c => {
      this.currencies = c;
      console.log(c);
    });
  }

  submit(): void {
    this.userService.signup(this.form.value).subscribe(
      () => this.router.navigate(['dashboard']).then(),
      () => this.error = true
    );
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.currencySubscription.unsubscribe();
    this.currencyQuerySubscription.unsubscribe();
    this.userQueryLoadingSubscription.unsubscribe();
    this.currencyQueryLoadingSubscription.unsubscribe();
  }
}
