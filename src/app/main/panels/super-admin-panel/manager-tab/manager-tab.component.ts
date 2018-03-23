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
  selector: 'app-manager-tab',
  templateUrl: './manager-tab.component.html',
  styleUrls: ['./manager-tab.component.css']
})
export class ManagerTabComponent extends ReactiveFormsBaseClass implements OnInit {
  listOfManagers = [];
  listOfProjects = [];
  addManagerForm: FormGroup;
  editManagerForm: FormGroup;
  project: any;
  avatar: any;
  ageRange: any;
  private usersTable: any;
  private tableWidget: any;
  public selectedRow: any;
  public isClickOnCreateManager = false;
  public isClickOnEditManager = false;
  public listAgeRange = ['24-', '25-34', '35-44', '45-64', '65+'];
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
        pattern: 'Phone number must be in the format +0123456789 or 89021234567'
      }
    });
  }

  ngOnInit () {
    this.getAllProjects();
    this.createUserForm();
    this.getAllManagers(() => {
      this.loadManagers();
    });
  }

  public getAllManagers(callback) {
    this.userService.getAllUser('Manager').then((result) => {
      this.listOfManagers = result['userList'];
      callback();
    }, (error) => {
      this.onErrorHandle(error);
    });
  }

  public getAllProjects() {
    this.projectService.getAllProjects().then((result) => {
      this.listOfProjects = result.projectList;
    }, (error) => {
      this.onErrorHandle(error);
    });
  }

  public loadManagers(): void {
    if (this.tableWidget) {
      this.tableWidget.destroy();
    }
    const tableOptions: any = {
      data: this.listOfManagers,
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
      this.selectedRow = this.listOfManagers[indexes[0]];
    });
    this.tableWidget.on('deselect', (e, dt, type, indexes) => {
      this.selectedRow = null;
    });
  }

  clickOnCreate() {
    this.isClickOnCreateManager = true;
    this.isClickOnEditManager = false;
  }

  onCreateManager() {
    $('#infoBox').modal('show');
    if (!this.addManagerForm.valid) {
      this.infoMessage = 'Manager\'s data is invalid, please check it.';
    } else {
      const formObject = this.addManagerForm.value;
      const userData =  { profile: {
        name: formObject.name,
        mail: formObject.email,
        role: 'Manager',
        phone: formObject.phone,
      },
        error: ''
      };
      if (this.listProjectsIdsForAdd) {
        userData.profile['projectIds'] = this.listProjectsIdsForAdd;
      }
      this.userService.createUser(userData).then((result) => {
        this.infoMessage = 'Manager was added';
        this.cleanAddManagerForm();
        this.getAllManagers(() => {
          this.loadManagers();
        });
      }, (error) => {
        this.onErrorHandle(error);
      });
    }
  }

  onEditManager() {
    this.isClickOnCreateManager = false;
    this.isClickOnEditManager = true;
    this.editManagerForm.patchValue({
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
    this.ageRange = this.selectedRow.ageRange;
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
      this.infoMessage = 'Manager was deleted';
      this.getAllManagers(() => {
        this.loadManagers();
      });
    }, (error) => {
      this.onErrorHandle(error);
    });
  }

  private createUserForm(): void {
    this.addManagerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я ]*')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[+]\\d+$|^\\d+$')]],
    });

    this.editManagerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я ]*')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[+]\\d+$|^\\d+$')]],
      occupation: ['', []],
      facebookLink: ['', []],
      country: ['', []],
      city: ['', []],
      address: ['', []],
      ageRange: ['', []],
      companyName: ['', []],
    });

    this.addManagerForm.valueChanges.subscribe(data => this.onValueChanged(this.addManagerForm, data));
    this.editManagerForm.valueChanges.subscribe(data => this.onValueChanged(this.editManagerForm, data));
    this.onValueChanged(this.addManagerForm);
    this.onValueChanged(this.editManagerForm);
  }

  public cleanAddManagerForm() {
    this.addManagerForm.reset();
    this.listProjectsForAdd = null;
    this.listProjectsIdsForAdd = null;
  }

  public cleanEditManagerForm() {
    this.editManagerForm.reset();
    this.project = '';
    this.ageRange = '';
    this.listProjectsForAdd = null;
    this.listProjectsIdsForAdd = null;
  }

  public onCancelAddNewManager() {
    this.isClickOnCreateManager = false;
    this.cleanAddManagerForm();
  }

  public onCancelEditManager() {
    this.isClickOnEditManager = false;
    this.cleanEditManagerForm();
  }

  public onSaveEditManager() {
    if (!this.editManagerForm.valid) {
      this.infoMessage = 'Manager\'s data is invalid, please check it.';
      $('#infoBox').modal('show');
    } else {
      const formObject = this.editManagerForm.value;
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
          ageRange: this.ageRange,
          mail: formObject.email,
          companyName: formObject.companyName
        },
        'error': ''
      };
      if (this.listProjectsIdsForAdd) {
        userData.profile['projectIds'] = this.listProjectsIdsForAdd;
      }
      $('#infoBox').modal('show');
      this.userService.updateUser(userData).then((result) => {
        this.infoMessage = 'Manager was updated';
        this.cleanEditManagerForm();
        this.getAllManagers(() => {
          this.loadManagers();
        });
      }, (error) => {
        this.onErrorHandle(error);
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

  onErrorHandle(error) {
    $('.modal').modal('hide');
    this.redirectService.checkRedirect(error.status, (message) => {
      if (message) {
        this.infoMessage = (error.error.error == 'User with this email already registered in the system.')
          ? error.error.error : message;
        $('#infoBox').modal('show');
      }
    });
  }

}
