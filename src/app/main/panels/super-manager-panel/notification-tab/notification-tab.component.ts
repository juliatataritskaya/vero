import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {NotificationService} from '../../../../services/notification.service';
import {RedirectService} from '../../../../services/redirect.service';

declare var $: any;

@Component({
  selector: 'app-notification-tab',
  templateUrl: './notification-tab.component.html',
  styleUrls: ['./notification-tab.component.css']
})
export class NotificationTabComponent implements OnInit {
  listOfUsers = [];
  private usersTable: any;
  private tableWidget: any;
  public selectedRowsId: any = [];
  title: string;
  message: string;
  infoMessage: string;
  isSelectAll = false;

  constructor (private router: Router, private fb: FormBuilder, private el: ElementRef, private userService: UserService,
               private notificationService: NotificationService, private redirectService: RedirectService) {
  }

  ngOnInit () {
    this.getAllUsers(() => {
      this.loadUsers();
    });
  }

  public getAllUsers(callback) {
    this.userService.getAllUserWithoutFilter().then((result) => {
      this.listOfUsers = result['userList'];
      callback();
    }, (error) => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
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
      paging: true,
      columns: [
        {
          "title": "",
          "data": 'userId',
          "render": function(data, type, row) {
            if (type === 'display') {
              return '<input id="check' + data +'" type="checkbox" class="watchlist-checkbox">';
            }
            return data;
          },
          "className": "dt-body-center"
        },
        {title: 'User name', data: 'name'},
        {title: 'Email', data: 'email'},
        {title: 'Role', data: 'role'},
        {title: 'Company', data: 'companyName'}
      ]
    };
    this.usersTable = $(this.el.nativeElement.querySelector('table'));
    this.tableWidget = this.usersTable.DataTable(tableOptions);
  }

  onSend() {
    $('#infoBox').modal('show');
    if (this.selectedRowsId.length == 0 && !this.isSelectAll) {
      this.infoMessage = 'Select at least one user to send messages';
    } else if (!this.title || !this.message) {
      this.infoMessage = 'Title and text message are mandatory fields!';
    } else {
      const notificationData = new FormData();
      if (this.selectedRowsId.length !== this.listOfUsers.length) {
        this.selectedRowsId.forEach((idx) => {
          let foundObj = this.listOfUsers.find((user) => {
            return user.userId.toString() == idx;
          });
          notificationData.append('emails', foundObj.email);
        });
      }
      notificationData.append('title', this.title);
      notificationData.append('message', this.message);

      this.notificationService.postNotification(notificationData).then(() => {
        this.infoMessage = this.selectedRowsId.length > 1 ? 'Messages were sent' : 'Message was sent';
        this.resetForm();
      }, error => {
        this.redirectService.checkRedirect(error.status, (message) => {
          if (message) {
            this.infoMessage = 'Something wrong, please try again.';
            $('#infoBox').modal('show');
          }
        });
      });
    }
  }

  resetForm() {
    $('#messageForNotification').modal('hide');
    this.title = '';
    this.message = '';
  }

  // onSelectNone(){
  //   console.log($('input'))
  //   $('input').each((i, el) => {
  //     console.log($(el));
  //     $(el).attr('checked', false);
  //   });
  // }

  onSelect() {
    this.selectedRowsId = [];
    this.isSelectAll = false;
    $('input:checked').each((i, elem) => {
      this.selectedRowsId.push($(elem).attr('id').substring(5));
    });
  }

  closeModal() {
    $('#infoBox').modal('hide');
    this.infoMessage = null;
  }

  onErrorHandle(error) {
    this.redirectService.checkRedirect(error.status, (message) => {
      if (message) {
        this.infoMessage = 'Something wrong, please try again.';
        $('#infoBox').modal('show');
      }
    });
  }

}
