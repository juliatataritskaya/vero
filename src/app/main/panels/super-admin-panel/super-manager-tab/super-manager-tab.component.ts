import {Component, ElementRef, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {RedirectService} from '../../../../services/redirect.service';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {ManagerService} from '../../../../services/manager.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-super-manager-tab',
  templateUrl: './super-manager-tab.component.html',
  styleUrls: ['./super-manager-tab.component.css']
})
export class SuperManagerTabComponent extends ReactiveFormsBaseClass implements OnInit {
  listOfSuperManagers = [];
  listOfProjects = [];
  addSuperManagerForm: FormGroup;
  editSuperManagerForm: FormGroup;
  project: any;
  avatar: any;
  personalTitle: any;
  private usersTable: any;
  private tableWidget: any;
  public selectedRow: any;
  public isClickOnCreateSuperManager = false;
  public isClickOnEditSuperManager = false;
  public listFormalTitles = ['Mr', 'Ms', 'Mrs', 'Miss', 'Sir'];
  infoMessage: string;

  constructor (private router: Router, private fb: FormBuilder, private userService: UserService, private managerService: ManagerService,
               private redirectService: RedirectService, private el: ElementRef) {
    super({
      name: '',
      email: '',
      phone: '',
      occupation: '',
      facebookLink: '',
      country: '',
      city: '',
      companyName: ''
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
    this.createUserForm();
    this.getAllSuperManagers(() => {
      this.loadSuperManagers();
    });
  }

  public getAllSuperManagers(callback) {
    this.userService.getAllUser('SuperManager').then((result) => {
      this.listOfSuperManagers = result['userList'];
      callback();
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }  else {
        this.infoMessage = 'Something wrong, please try again.';
        $('#infoBox').modal('show');
      }
    });
  }

  public loadSuperManagers(): void {
    if (this.tableWidget) {
      this.tableWidget.destroy();
    }
    const tableOptions: any = {
      data: this.listOfSuperManagers,
      responsive: true,
      lengthMenu: [5, 10, 15],
      select: true,
      paging: true,
      columns: [
        {title: 'User name', data: 'name'},
        {title: 'Email', data: 'email'},
        {title: 'Company', data: 'companyName'},
        {title: 'Country', data: 'country'},
        {title: 'City', data: 'city'},
        {title: 'Occupation', data: 'ocupation'},
        {title: 'Facebook link', data: 'facebookLink'},
      ]
    };
    this.usersTable = $(this.el.nativeElement.querySelector('table'));
    this.tableWidget = this.usersTable.DataTable(tableOptions);
    this.tableWidget.on('select', (e, dt, type, indexes) => {
      this.selectedRow = this.listOfSuperManagers[indexes[0]];
    });
    this.tableWidget.on('deselect', (e, dt, type, indexes) => {
      this.selectedRow = null;
    });
  }

  clickOnCreate() {
    this.isClickOnCreateSuperManager = true;
    this.isClickOnEditSuperManager = false;
  }

  onCreateSuperManager() {
    $('#infoBox').modal('show');
    if (!this.addSuperManagerForm.valid) {
      this.infoMessage = 'User\'s data is invalid, please check it.';
    } else {
      const formObject = this.addSuperManagerForm.value;
      const userData =  { profile: {
        name: formObject.name,
        mail: formObject.email,
        role: 'SuperManager',
        phone: formObject.phone,
      },
        error: ''
      };
      this.userService.createUser(userData).then((result) => {
        this.infoMessage = 'Super manager was added';
        this.cleanAddSuperManagerForm();
        this.getAllSuperManagers(() => {
          this.loadSuperManagers();
        });
      }, (error) => {
        if (error.status === 401) {
          this.redirectService.redirectOnLoginPage();
        } else {
          this.infoMessage = 'Something wrong, please try again.';
        }
      });
    }
  }

  onEditSuperManager() {
    this.isClickOnCreateSuperManager = false;
    this.isClickOnEditSuperManager = true;
    this.editSuperManagerForm.patchValue({
      name: this.selectedRow.name,
      address: this.selectedRow.address,
      email: this.selectedRow.email,
      phone: this.selectedRow.phone,
      occupation:  this.selectedRow.ocupation,
      facebookLink: this.selectedRow.facebookLink,
      country: this.selectedRow.country,
      city: this.selectedRow.city,
      companyName: this.selectedRow.companyName,
    });
    this.personalTitle = this.selectedRow.personalTitle;
  }

  onDeleteUser() {
    $('#infoBox').modal('show');
    this.userService.deleteUser(this.selectedRow['userId']).then((result) => {
      this.infoMessage = 'Super Manager was deleted';
      this.getAllSuperManagers(() => {
        this.loadSuperManagers();
      });
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      } else {
        this.infoMessage = 'Something wrong, please try again.';
      }
    });
  }

  private createUserForm(): void {
    this.addSuperManagerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    });

    this.editSuperManagerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      occupation: ['', []],
      facebookLink: ['', []],
      country: ['', []],
      city: ['', []],
      address: ['', []],
      personalTitle: ['', []],
      companyName: ['', []],
    });

    this.addSuperManagerForm.valueChanges.subscribe(data => this.onValueChanged(this.addSuperManagerForm, data));
    this.editSuperManagerForm.valueChanges.subscribe(data => this.onValueChanged(this.editSuperManagerForm, data));
    this.onValueChanged(this.addSuperManagerForm);
    this.onValueChanged(this.editSuperManagerForm);
  }

  public cleanAddSuperManagerForm() {
    this.addSuperManagerForm.reset();
  }

  public cleanEditSuperManagerForm() {
    this.editSuperManagerForm.reset();
    this.project = '';
    this.personalTitle = '';
  }

  public onCancelAddNewSuperManager() {
    this.isClickOnCreateSuperManager = false;
    this.cleanAddSuperManagerForm();
  }

  public onCancelEditSuperManager() {
    this.isClickOnEditSuperManager = false;
    this.cleanEditSuperManagerForm();
  }

  public onSaveEditSuperManager() {
    $('#infoBox').modal('show');
    if (!this.editSuperManagerForm.valid) {
      this.infoMessage = 'Super Manager\'s data is invalid, please check it.';
    } else {
      const formObject = this.editSuperManagerForm.value;
      const userData =  {
        profile: {
          id: this.selectedRow['userId'],
          name: formObject.name,
          ocupation: formObject.occupation,
          phone: formObject.phone,
          facebookLink: formObject.facebookLink,
          country: formObject.country,
          city: formObject.city,
          address: formObject.address,
          mail: formObject.email,
          companyName: formObject.companyName,
          personalTitle: this.personalTitle,
        },
        'error': ''
      };
      this.userService.updateUser(userData).then((result) => {
        this.infoMessage = 'Super Manager was updated';
        this.cleanEditSuperManagerForm();
        this.getAllSuperManagers(() => {
          this.loadSuperManagers();
        });
      }, (error) => {
        if (error.status === 401) {
          this.redirectService.redirectOnLoginPage();
        } else {
          this.infoMessage = 'Something wrong, please try again.';
        }
      });
    }
  }

  closeModal() {
    $('#infoBox').modal('hide');
    this.infoMessage = null;
  }

}

