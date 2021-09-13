import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {CurrencyService} from '../../../state/currency/currency.service';
import {CurrencyQuery} from '../../../state/currency/currency.query';
import {Currency} from '../../../state/currency/currency.model';
import {Observable, Observer, Subscription} from 'rxjs';
import {UserService} from '../../../state/user/user.service';
import {Router} from '@angular/router';
import {UserQuery} from '../../../state/user/user.query';

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
  form: FormGroup;

  currencySubscription: Subscription;
  currencyQuerySubscription: Subscription;
  userQueryLoadingSubscription: Subscription;
  currencyQueryLoadingSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private userQuery: UserQuery,
    private currencyQuery: CurrencyQuery,
    private currencyService: CurrencyService,
  ) {
    this.form = this.fb.group({
      // personal info
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      // photo: new FormControl(null, [Validators.required]),
      // profile info
      username: new FormControl('', [Validators.required], [this.checkUsername]),
      email: new FormControl('', [Validators.required, this.emailFormatCheck], [this.checkEmail]),
      password: new FormControl('', [this.checkPassword]),
      repeat_password: new FormControl('', [this.checkPassword, this.confirmValidator]),
      // account details
      account_name: new FormControl('', Validators.required),
      currency_id: new FormControl('', [Validators.required]),
    });
  }

  checkUsername = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      return this.userService.checkUsername(control.value).subscribe(
        r => {
          if (r['username_exists']) {
            observer.next({error: true});
            this.error = true;
          } else {
            this.error = false;
            observer.next(null);
          }
        },
        () => observer.error(''),
        () => observer.complete()
      );
    })

  checkEmail = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      return this.userService.checkEmail(control.value).subscribe(
        r => {
          if (r['email_exists']) {
            observer.next({error: true});
            this.error = true;
          } else {
            observer.next(null);
            this.error = false;
          }
        },
        () => observer.error(''),
        () => observer.complete()
      );
    })

  emailFormatCheck = (control: FormControl) => {
    if (!control.value.match('[A-Za-z0-9_.]+@[A-Za-z0-9]+.[A-Za-z]')) {
      this.error = true;
      return {incorret: true};
    } else {
      this.error = false;
    }
  }

  checkPassword = (control: FormControl) => {
    const errors = {};

    if (!control.value.match('(?=.*\\d)')) {
      errors['number'] = true;
    }

    if (!control.value.match('(?=.*[a-z])')) {
      errors['lowerCase'] = true;
    }

    if (!control.value.match('(?=.*[A-Z])')) {
      errors['upperCase'] = true;
    }

    if (!control.value.match('(?=.*[^\\w\\d\\s])')) {
      errors['specialDigit'] = true;
    }

    if (!control.value.match('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$')) {
      errors['size'] = true;
    }

    return errors;
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (control.value === '') {
      this.error = true;
      return {required: true};
    } else if (control.value !== this.form.controls.password.value) {
      this.error = true;
      return {error: true};
    }
    this.error = false;
    return {};
  }

  ngOnInit(): void {
    this.currencyQueryLoadingSubscription = this.currencyQuery.selectLoading().subscribe(l => this.currenciesLoading$ = l);
    this.userQueryLoadingSubscription = this.userQuery.selectLoading().subscribe(s => this.signUpLoading$ = s);

    this.currencySubscription = this.currencyService.get().subscribe();

    this.currencyQuerySubscription = this.currencyQuery.selectAll().subscribe(c => {
      this.currencies = c;
    });
  }

  submit(): void {
    this.userService.signup(this.form.value).subscribe(
      () => this.router.navigate(['dashboard']).then(),
      () => this.error = true
    );
  }

  // tslint:disable-next-line:typedef
  back() {
    return this.router.navigate(['/']);
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.currencySubscription.unsubscribe();
    this.currencyQuerySubscription.unsubscribe();
    this.userQueryLoadingSubscription.unsubscribe();
    this.currencyQueryLoadingSubscription.unsubscribe();
  }
}
