import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  actualStep = 1;
  sumbitted = false;

  validateForm1: FormGroup;
  validateForm2: FormGroup;
  validateForm3: FormGroup;

  form = new FormGroup({
    personalDetails: new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      gender: new FormControl(null, [Validators.required])
    }),
    signUpDetails: new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl('', [Validators.required]),
      photo: new FormControl(null, [Validators.required])
    }),
    accountDetails: new FormGroup({
      name: new FormControl('', Validators.required),
      currency: new FormControl('', [Validators.required, Validators.email]),
    }),
  });

  constructor(private fb: FormBuilder) {

  }

  currentGroup(): FormGroup {
    return this.getGroupAt(this.actualStep);
  }

  ngOnInit(): void {
    this.validateForm1 = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid;
  }

  shouldValidate = (): boolean => {
    return this.sumbitted === true;
  }

  steps = [
    {
      label: 'Informações pessoais',
      isValid: this.isStepValid,
      validate: this.shouldValidate,
    },
    {
      label: 'Informações da Conta',
      isValid: this.isStepValid,
      validate: this.shouldValidate,
    },
    {
      label: 'Informações da Conta Bancária1',
      isValid: this.isStepValid,
      validate: this.shouldValidate,
    },
  ];

  next(): void {
    this.actualStep += 1;
  }

  prev(): void {
    this.actualStep -= 1;
  }

  submit(): void {
    this.sumbitted = true;

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.validateForm1.valid;
      this.validateForm2.valid;
      this.validateForm3.valid;
    }

    console.log('Submitted data', this.form.value);
  }

  getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.form.controls).map((groupName) =>
      this.form.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }

}
