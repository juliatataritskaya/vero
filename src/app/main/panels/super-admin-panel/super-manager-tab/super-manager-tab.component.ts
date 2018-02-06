import {Component, ElementRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from "../../../../shared/classes/reactive-forms.base.class";
import {RedirectService} from "../../../../services/redirect.service";

@Component({
  selector: 'app-super-manager-tab',
  templateUrl: './super-manager-tab.component.html',
  styleUrls: ['./super-manager-tab.component.css']
})
export class SuperManagerTabComponent extends ReactiveFormsBaseClass  implements OnInit {
  superManagerForm: FormGroup;
  constructor(private el: ElementRef, private fb: FormBuilder,
              private redirectService: RedirectService) {
    super({
      name: '',
      email: '',
      phone: '',
    }, {
      name: {
        required: 'Name is required.'
      },
      email: {
        required: 'Email is required.',
        email: 'Email isn\'t valid'
      },
      phone: {
        required: 'Phone is required.'
      }
    });
  }

  ngOnInit () {
    this.createSuperManagerForm();
  }

  public onSaveHandler(): void {
    if (!this.superManagerForm.valid) {
      this.showError('Super manager\'s data is invalid, please check it.');
      return;
    }
    const formObject = this.superManagerForm.value;
    const superManagerData = new FormData();
    for (const key in formObject) {
      if (formObject.hasOwnProperty(key)) {
        superManagerData.append(key, formObject[key]);
      }
    }
    console.log(formObject);
  }

  private createSuperManagerForm(): void {
    this.superManagerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', []],
    });

    this.superManagerForm.valueChanges.subscribe(data => this.onValueChanged(this.superManagerForm, data));

    this.onValueChanged(this.superManagerForm);
  }
}
