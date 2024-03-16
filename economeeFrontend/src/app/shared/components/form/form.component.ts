import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormItem} from "../../../core/state/state/formItens";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less']
})
export class FormComponent implements OnInit {
  @Input()
  formTitle?: string = '';

  @Input()
  form: FormGroup;

  @Input()
  formItems: FormItem[];

  @Input()
  submitText: string;

  @Input()
  showSaveButton = true;

  @Output() submit = new EventEmitter<FormGroup>();

  constructor() {
  }

  ngOnInit(): void {
  }

  formSubmit() {
    if (this.form.valid) {
      this.submit.emit(this.form);
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

}
