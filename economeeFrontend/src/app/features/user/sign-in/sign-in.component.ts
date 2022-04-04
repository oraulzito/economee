import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SessionQuery} from "../../../core/state/user/session/session.query";
import {FormItem} from "../../../core/state/formItens";
import {CurrencyQuery} from "../../../core/state/currency/currency.query";
import {UserService} from "../../../core/state/user/user.service";
import {CurrencyService} from "../../../core/state/currency/currency.service";
import {Router} from "@angular/router";
import {UserQuery} from "../../../core/state/user/user.query";
import {Subscription} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  formItems: FormItem[]
  currencies = [];
  submit = false;
  error = false;
  checkSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private currencyService: CurrencyService,
    private currencyQuery: CurrencyQuery,
    private userService: UserService,
    private userQuery: UserQuery,
    private sessionQuery: SessionQuery,
  ) {
    this.currencyService.get();
    this.currencyQuery.selectAll().subscribe(
      c => {
        c.map(item => {
          this.currencies.push({
            label: item.symbol + '' + item.code,
            value: item.id
          })
        });
      }
    )
    this.formItems = [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        errorTip: {
          required: 'Email é obrigatório',
          error: 'Email em uso'
        },
        icon: 'mail',
        size: {
          sm: 24
        }
      },
      {
        name: 'username',
        type: 'text',
        label: 'Nome de usuário',
        errorTip: {
          required: 'Nome de usuário é obrigatório',
          error: 'Nome de usuário em uso'
        },
        icon: 'user',
        size: {
          sm: 24
        }
      },
      {
        name: 'password',
        type: 'password',
        label: 'Senha',
        errorTip: {
          required: 'Senha é obrigatória',
          error: 'Senha é deve ter 8 caracteres, uma letra, um número e um caractere especial'
        },
        icon: 'lock',
        size: {
          sm: 24
        }
      },
      {
        name: 'repeat_password',
        type: 'password',
        label: 'Repita a senha',
        errorTip: {
          required: 'Repita a senha',
          error: 'As senhas não são iguais'
        },
        icon: 'lock',
        size: {
          sm: 24
        }
      },
      {
        name: 'first_name',
        type: 'text',
        label: 'Nome',
        errorTip: {
          required: 'Nome é obrigatório',
          error: 'Nome é inválido',
        },
        icon: '',
        size: {
          sm: 12,
          md: 12,
        }
      },
      {
        name: 'last_name',
        type: 'text',
        label: 'Sobrenome',
        errorTip: {
          required: 'Sobrenome é obrigatório',
          error: 'Sobrenome é inválido',
        },
        icon: '',
        size: {
          sm: 12,
          md: 12,
        }
      },
      {
        name: 'dob',
        type: 'date',
        label: 'Data de nascimento',
        errorTip: {
          required: 'Data de nascimento é obrigatória',
          error: 'Você deve ter mais de 16 anos',
        },
        icon: 'calendar',
        size: {
          sm: 24
        },
      },
      {
        name: 'account_name',
        type: 'text',
        label: 'Nome da conta',
        errorTip: {
          required: 'Nome da conta é obrigatório',
          error: 'Nome da conta é inválido',
        },
        icon: '',
        size: {
          sm: 24,
          md: 12
        },
      },
      {
        name: 'currency_id',
        type: 'dropdown',
        label: 'Moeda',
        errorTip: {
          required: 'Moeda é obrigatória',
          error: 'Moeda é inválida',
        },
        icon: '',
        size: {
          sm: 24,
          md: 12
        },
        options: this.currencies
      }
    ]
  }

  ngOnInit(): void {
    //if the user is logged in, redirect to dashboard
    this.sessionQuery.isLoggedIn$.subscribe(
      l => l ? this.router.navigateByUrl('dashboard').then() : null
    )
    this.userQuery.selectError().subscribe(
      e => this.error = e
    );

    this.signInForm = this.fb.group({
      email: [null, [Validators.required, this.checkEmailRegex], [this.checkEmail]],
      username: [null, [Validators.required, this.checkUsernameRegex], [this.checkUsername]],
      password: [null, [Validators.required, this.checkPasswordRegex]],
      repeat_password: [null, [Validators.required, this.confirmationValidator]],
      first_name: [null, [Validators.required, this.checkTextRegex]],
      last_name: [null, [Validators.required, this.checkTextRegex]],
      dob: [null, [Validators.required, this.checkAge]],
      account_name: [null, [Validators.required]],
      currency_id: [null, [Validators.required]],
    });
  }

  back() {
    this.router.navigateByUrl('/');
  }

  createUser() {
    this.userService.create(this.signInForm.value).subscribe();
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.signInForm.controls.password.value) {
      return {error: true};
    }
    return {};
  };

  //check if the text contain only letters
  checkTextRegex = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (!/^[a-zA-Z]+$/.test(control.value)) {
      return {error: true};
    }
    return {};
  };

  //check if password is at least 8 characters long,
  // contain at least one number, one letter lowercase, one letter uppercase
  // and a special character
  checkPasswordRegex = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/.test(control.value)) {
      return {error: true};
    }
    return {};
  };

  //check if the age is greater than 18
  checkAge = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    }
    const ageDifMs = Date.now() - new Date(control.value).getTime();
    const ageDate = new Date(ageDifMs);
    if (Math.abs(ageDate.getUTCFullYear() - 1970) <= 14) {
      return {error: true};
    }
  }

  //check if username is valid by regex, it can't be null or empty and contain only letters and/or numbers
  checkUsernameRegex(control: FormControl): { [s: string]: boolean } {
    if (!control.value) {
      return {required: true};
    } else if (!/^[a-zA-Z0-9]+$/.test(control.value)) {
      return {error: true};
    }
    return {};
  }

  //check if email valid by regex
  checkEmailRegex = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(control.value)) {
      return {error: true};
    }
    return {};
  };

  //check if username is already in use, use observable to update the form
  checkUsername = (control: FormControl) =>
    this.userService.checkUsername(control.value).pipe(tap(
      r => {
        if (!r['available']) {
          return {error: true};
        } else {
          return {};
        }
      }));


  // check if email is taken, cancel if a new request is made
  checkEmail = (control: FormControl) =>
    this.userService.checkEmail(control.value).pipe(tap(
      r => {
        if (!r['available']) {
          return {error: true};
        } else {
          return {};
        }
      })
    );
}
