import {Component, ElementRef, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {RedirectService} from '../../../../services/redirect.service';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {ProjectService} from '../../../../services/project.service';
import {environment} from '../../../../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.css']
})
export class UsersTabComponent extends ReactiveFormsBaseClass implements OnInit {
  listOfUsers = [];
  listOfProjects = [];
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  project: any;
  avatar: any;
  personalTitle: any;
  private usersTable: any;
  private tableWidget: any;
  public selectedRow: any;
  public isClickOnCreateUser = false;
  public isClickOnEditUser = false;
  public listFormalTitles = ['Mr', 'Ms', 'Mrs', 'Miss'];
  public listProjectsForAdd: any;
  public listProjectsIdsForAdd: any;
  infoMessage: string;

  constructor (private router: Router, private fb: FormBuilder, private userService: UserService, private projectService: ProjectService,
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
        required: 'Name is required.',
        pattern: 'The name can not contain characters or numbers'
      },
      email: {
        required: 'Email is required.',
        email: 'Email isn\'t valid'
      },
      phone: {
        required: 'Phone is required.',
        pattern: 'Phone number must be in the format +0123456789'
      }
    });
  }

  ngOnInit () {
    this.getAllProjects();
    this.createUserForm();
    this.getAllUsers(() => {
      this.loadUsers();
    });
  }

  public getAllUsers(callback) {
    this.userService.getAllUser('Customer').then((result) => {
      this.listOfUsers = result['userList'];
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

  public getAllProjects() {
    this.projectService.getAllProjects().then((result) => {
      this.listOfProjects = result.projectList;
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }  else {
        this.infoMessage = 'Something wrong, please try again.';
        $('#infoBox').modal('show');
      }
    });
  }

  public loadUsers(): void {
    if (this.tableWidget) {
      this.tableWidget.destroy();
    }
    const tableOptions: any = {
      data: this.listOfUsers,
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
      this.selectedRow = this.listOfUsers[indexes[0]];
    });
    this.tableWidget.on('deselect', (e, dt, type, indexes) => {
      this.selectedRow = null;
    });
  }

  clickOnCreate() {
    this.isClickOnCreateUser = true;
    this.isClickOnEditUser = false;
  }

  onCreateUser() {
    $('#infoBox').modal('show');
    if (!this.addUserForm.valid) {
      this.infoMessage = 'User\'s data is invalid, please check it.';
    } else {
      const formObject = this.addUserForm.value;
      const userData =  { profile: {
        name: formObject.name,
        mail: formObject.email,
        role: 'Customer',
        phone: formObject.phone,
      },
        error: ''
      };
      if (this.listProjectsIdsForAdd) {
        userData.profile['projectIds'] = this.listProjectsIdsForAdd;
      }
      this.userService.createUser(userData).then((result) => {
        this.infoMessage = 'User was added';
        this.cleanAddUserForm();
        this.getAllUsers(() => {
          this.loadUsers();
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

  onEditUser() {
    this.isClickOnEditUser = true;
    this.isClickOnCreateUser = false;

    this.editUserForm.patchValue({
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
    this.listProjectsForAdd = [];
    this.listOfProjects.forEach((project) => {
      if (this.selectedRow['projectIds'].includes(project.id)) {
        project.checked = 'true';
        this.listProjectsForAdd.push(project.name);
      } else {
        project.checked = '';
      }
    });
  }

  onDeleteUser() {
    $('#infoBox').modal('show');
    this.userService.deleteUser(this.selectedRow['userId']).then((result) => {
      this.infoMessage = 'User was deleted';
      this.getAllUsers(() => {
        this.loadUsers();
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
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[+]\\d{10}$')]]
    });

    this.editUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[+]\\d{10}$')]],
      occupation: ['', []],
      facebookLink: ['', []],
      country: ['', []],
      city: ['', []],
      address: ['', []],
      personalTitle: ['', []],
      companyName: ['', []],
    });

    this.addUserForm.valueChanges.subscribe(data => this.onValueChanged(this.addUserForm, data));
    this.editUserForm.valueChanges.subscribe(data => this.onValueChanged(this.editUserForm, data));
    this.onValueChanged(this.addUserForm);
    this.onValueChanged(this.editUserForm);
  }

  public cleanAddUserForm() {
    this.addUserForm.reset();
    this.listProjectsForAdd = null;
    this.listProjectsIdsForAdd = null;
    this.listOfProjects.forEach((project) => {
      project.checked = '';
    });
  }

  public cleanEditUserForm() {
    this.editUserForm.reset();
    this.project = '';
    this.personalTitle = '';
    this.listProjectsForAdd = null;
    this.listProjectsIdsForAdd = null;
    this.listOfProjects.forEach((project) => {
      project.checked = '';
    });
  }

  public onCancelAddNewUser() {
    this.isClickOnCreateUser = false;
    this.cleanAddUserForm();
  }

  public onCancelEditUser() {
    this.isClickOnEditUser = false;
    this.cleanEditUserForm();
    this.listProjectsForAdd = null;
    this.listProjectsIdsForAdd = null;
  }

  public onSaveEditUser() {
    $('#infoBox').modal('show');
    if (!this.editUserForm.valid) {
      this.infoMessage = 'User\'s data is invalid, please check it.';
    } else {
      const formObject = this.editUserForm.value;
      const userData =  {
        profile: {
          id: this.selectedRow['userId'],
          name: formObject.name,
          ocupation: formObject.occupation,
          phone: formObject.phone,
          facebookLink: formObject.facebookLink,
          country: formObject.country,
          city: formObject.city,
          companyName: formObject.companyName,
          address: formObject.address,
          mail: formObject.email,
          personalTitle: this.personalTitle,
        },
        'error': ''
      };
      if (this.listProjectsIdsForAdd) {
        userData.profile['projectIds'] = this.listProjectsIdsForAdd;
      }
      this.userService.updateUser(userData).then((result) => {
        this.infoMessage = 'User was updated';
        this.cleanEditUserForm();
        this.getAllUsers(() => {
          this.loadUsers();
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

  addProject() {
    this.listProjectsForAdd = [];
    this.listProjectsIdsForAdd = [];
      $('.projects').each((index, elem) => {
      if ($(elem).prop('checked')) {
        this.listProjectsForAdd.push(this.listOfProjects[index].name);
        this.listProjectsIdsForAdd.push(this.listOfProjects[index].id);
      }
    });
  }

  closeModal() {
    $('#infoBox').modal('hide');
    this.infoMessage = null;
  }
}
