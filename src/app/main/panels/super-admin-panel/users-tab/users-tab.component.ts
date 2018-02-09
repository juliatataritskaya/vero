import {Component, ElementRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from "../../../../services/user.service";
import {RedirectService} from "../../../../services/redirect.service";

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.css']
})
export class UsersTabComponent implements OnInit {
  listOfUsers = [];
  private usersTable: any;
  private tableWidget: any;
  public selectedRow: any;

  constructor (private router: Router, private fb: FormBuilder, private userService: UserService,
               private redirectService: RedirectService, private el: ElementRef) {
  }

  ngOnInit () {
    this.getAllUsers(() => {
      this.loadUsers();
    });
  }

  public getAllUsers(callback) {
    this.userService.getAllUser().then((result) => {
      this.listOfUsers = result['userList'];
      callback();
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }  else {
        alert('Something wrong, please try again.');
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
        {title: 'Role', data: 'role'},
        {title: 'Company', data: 'companyName'}
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

  onCreateUser() {
    console.log('create');
  }

  onEditUser() {
    console.log(this.selectedRow);
  }

  onDeleteUser() {
    this.userService.deleteUser(this.selectedRow['userId']).then((result) => {
      alert('User was deleted');
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      } else {
        alert('Something wrong, please try again.');
      }
    });
  }

}
