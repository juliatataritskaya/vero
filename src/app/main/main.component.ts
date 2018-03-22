import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/Subscriber";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private linkItems = [];
  private isHiddenMenu = false;

  private userName: any = localStorage.getItem('userName');
  private companyName: any = localStorage.getItem('companyName');
  private role = localStorage.getItem('role');
  private avatar = localStorage.getItem('avatar');
  constructor (private router: Router, private authService: AuthService) {}


  ngOnInit() {
    this.checkUserRight();
    this.companyName = new Observable<string>((observer: Subscriber<string>) => {
      setInterval(() => {observer.next(localStorage.getItem('companyName'))}, 1500);
    });
    this.userName = new Observable<string>((observer: Subscriber<string>) => {
      setInterval(() => {observer.next(localStorage.getItem('userName'))}, 1500);
    });
    this.loadSideBar();
  }

  checkUserRight() {
    switch (localStorage.getItem('role')) {
      case 'SuperAdmin':
        this.linkItems = [
          { name: 'Dashboard', routerLink: 'adminpanel/dashboard', icon: 'icon-screen3'},
          { name: 'Company settings', routerLink: 'adminpanel/company', icon: 'fa fa-cogs'},
          { name: 'Super managers', routerLink: 'adminpanel/super-manager', icon: 'fa fa-users'},
          { name: 'Managers', routerLink: 'adminpanel/manager', icon: 'fa fa-user'},
          { name: 'Projects', routerLink: 'adminpanel/projects', icon: 'icon-home'},
          { name: 'Users', routerLink: 'adminpanel/user', icon: 'icon-person'},
          { name: 'Notifications', routerLink: 'adminpanel/notification', icon: 'icon-mail5'},
          { name: 'VR-tracking', routerLink: 'adminpanel/vr-tracking', icon: 'icon-eye8'}
          ];
        break;
      case 'SuperManager':
        this.linkItems = [
          { name: 'Dashboard', routerLink: 'supermanagerpanel/dashboard', icon: 'icon-screen3'},
          { name: 'Managers', routerLink: 'supermanagerpanel/manager', icon: 'fa fa-user'},
          { name: 'Projects', routerLink: 'supermanagerpanel/projects', icon: 'icon-home'},
          { name: 'Users', routerLink: 'supermanagerpanel/user', icon: 'icon-person'},
          { name: 'Notifications', routerLink: 'supermanagerpanel/notification', icon: 'icon-mail5'},
          { name: 'VR-tracking', routerLink: 'supermanagerpanel/vr-tracking', icon: 'icon-eye8'}
        ];
        break;
      case 'Manager':
        this.linkItems = [
          { name: 'Dashboard', routerLink: 'managerpanel/dashboard', icon: 'icon-screen3'},
          { name: 'Projects', routerLink: 'managerpanel/projects', icon: 'icon-home'},
          { name: 'Users', routerLink: 'managerpanel/user', icon: 'icon-person'},
          { name: 'Notifications', routerLink: 'managerpanel/notification', icon: 'icon-mail5'},
          { name: 'VR-tracking', routerLink: 'managerpanel/vr-tracking', icon: 'icon-eye8'}
        ];
        break;
      default:
        localStorage.clear();
        this.router.navigate(['/start-page']);
        break;
    }
  }

  onHandleLogout() {
    this.authService.logoutUser();
      this.router.navigate(['/start-page']);
  }

  clickOnHiddenMenu() {
    this.isHiddenMenu = !this.isHiddenMenu;
    if (this.isHiddenMenu) {
      $('.xn-profile').addClass('hidden');
      $('.xn-logo').addClass('hidden');
    } else {
      $('.xn-profile').removeClass('hidden');
      $('.xn-logo').removeClass('hidden');
    }
  }

  loadSideBar(){
    $('.sidebar-main-toggle').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('sidebar-xs');
    });
    $('.sidebar-mobile-main-toggle').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('sidebar-mobile-main').removeClass('sidebar-mobile-secondary sidebar-mobile-opposite sidebar-mobile-detached');
    });
    $('.sidebar-mobile-secondary-toggle').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('sidebar-mobile-secondary').removeClass('sidebar-mobile-main sidebar-mobile-opposite sidebar-mobile-detached');
    });
    $('.sidebar-mobile-opposite-toggle').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('sidebar-mobile-opposite').removeClass('sidebar-mobile-main sidebar-mobile-secondary sidebar-mobile-detached');
    });
    $('.sidebar-mobile-detached-toggle').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('sidebar-mobile-detached').removeClass('sidebar-mobile-main sidebar-mobile-secondary sidebar-mobile-opposite');
    });
    $(window).on('resize', function() {
      setTimeout(function() {
        if($(window).width() <= 768) {
          $('body').addClass('sidebar-xs-indicator');
          $('.sidebar-opposite').insertBefore('.content-wrapper');
          $('.sidebar-detached').insertBefore('.content-wrapper');
          $('.dropdown-submenu').on('mouseenter', function() {
            $(this).children('.dropdown-menu').addClass('show');
          }).on('mouseleave', function() {
            $(this).children('.dropdown-menu').removeClass('show');
          });
        }
        else {
          $('body').removeClass('sidebar-xs-indicator');
          $('.sidebar-opposite').insertAfter('.content-wrapper');
          $('body').removeClass('sidebar-mobile-main sidebar-mobile-secondary sidebar-mobile-detached sidebar-mobile-opposite');
          if($('body').hasClass('has-detached-left')) {
            $('.sidebar-detached').insertBefore('.container-detached');
          }
          else if($('body').hasClass('has-detached-right')) {
            $('.sidebar-detached').insertAfter('.container-detached');
          }
          $('.page-header-content, .panel-heading, .panel-footer').removeClass('has-visible-elements');
          $('.heading-elements').removeClass('visible-elements');
          $('.dropdown-submenu').children('.dropdown-menu').removeClass('show');
        }
      }, 100);
    }).resize();
  }

}
