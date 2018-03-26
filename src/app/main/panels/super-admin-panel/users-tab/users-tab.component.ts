import {Component, ElementRef, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {RedirectService} from '../../../../services/redirect.service';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {ProjectService} from '../../../../services/project.service';

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
  ageRange: any;
  private usersTable: any;
  private tableWidget: any;
  public selectedRow: any;
  public isClickOnCreateUser = false;
  public isClickOnEditUser = false;
  public isSelectedRow = false;
  public listAgeRange = ['24-', '25-34', '35-44', '45-64', '65+'];
  public listProjectsForAdd: any;
  public listProjectsIdsForAdd: any;
  infoMessage: string;

  constructor (private router: Router, private fb: FormBuilder, private userService: UserService, private projectService: ProjectService,
               private redirectService: RedirectService, private el: ElementRef, private route: ActivatedRoute) {
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
    this.getAllProjects(() => {
      this.createUserForm();
      this.getAllUsers(() => {
        this.loadUsers();
        this.route.params.subscribe(params => {
          if( params['id'] ){
            const user = this.listOfUsers.find((user) => {
              return user.userId == Number(params['id']);
            });
            if(user){
              this.selectedRow = user;
              this.getBelongProject();
              this.isSelectedRow = true;
            }
          }
        });
      });
    });
  }

  public getAllUsers(callback) {
    this.userService.getAllUser('Customer').then((result) => {
      this.listOfUsers = result['userList'];
      callback();
    }, (error) => {
      this.onErrorHandle(error);
    });
  }

  public getAllProjects(callback) {
    this.projectService.getAllProjects().then((result) => {
      this.listOfProjects = result.projectList;
      callback();
    }, (error) => {
      this.onErrorHandle(error);
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
      this.getBelongProject();
      this.isSelectedRow = true;
      this.isClickOnCreateUser = false;
      this.isClickOnEditUser = false;
    });
    this.tableWidget.on('deselect', (e, dt, type, indexes) => {
      this.selectedRow = null;
      this.isSelectedRow = false;
    });
  }

  clickOnCreate() {
    this.isClickOnCreateUser = true;
    this.isClickOnEditUser = false;
    this.isSelectedRow = false;
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
        this.onErrorHandle(error);
      });
    }
  }

  onEditUser() {
    this.isClickOnEditUser = true;
    this.isClickOnCreateUser = false;
    this.isSelectedRow = false;

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
    this.ageRange = this.selectedRow.ageRange;
    this.getBelongProject();
  }

  private getBelongProject() {
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
      this.isSelectedRow = false;
      this.getAllUsers(() => {
        this.loadUsers();
      });
    }, (error) => {
      this.onErrorHandle(error);
    });
  }

  private createUserForm(): void {
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я ]*')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[+]\\d+$|^\\d+$')]]
    });

    this.editUserForm = this.fb.group({
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
    this.ageRange = '';
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
          ageRange: this.ageRange,
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
    // $('.modal').modal('hide');
    this.redirectService.checkRedirect(error.status, (message) => {
      if (message) {
        this.infoMessage = (error.error.error == 'User with this email already registered in the system.')
          ? error.error.error : message;
        $('#infoBox').modal('show');
      }
    });
  }
}
