import {FormGroup} from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

export abstract class ReactiveFormsBaseClass {
  constructor(protected formErrors: any, protected validationMessages: any, protected snackBar: MatSnackBar) {}

  protected onValueChanged (form: FormGroup, data?: any): void {
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  protected showError (message: string): void {
    const snackBarRef = this.snackBar.open(`${message}`, 'Close', {
      duration: 3000
    } as MatSnackBarConfig);
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}
