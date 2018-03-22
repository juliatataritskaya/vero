import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {ProjectService} from '../../../../services/project.service';
import {RedirectService} from '../../../../services/redirect.service';
import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../services/user.service';
import {Clipboard} from 'ts-clipboard';
import { Ng2ImgToolsService } from 'ng2-img-tools';
declare var $: any;

@Component({
  selector: 'app-projects-tab',
  templateUrl: './projects-tab.component.html',
  styleUrls: ['./projects-tab.component.css', './nav-tabs.style.css']
})
export class ProjectsTabComponent extends ReactiveFormsBaseClass implements OnInit {
  private projectsTable: any;
  projectForm: FormGroup;
  projectPhotos: any = [];
  mapsPhotos: any = [];
  projectPhotosFiles: any = [];
  projectMapsFiles: any = [];
  photos360: any = [];
  logo: any = [];
  typesRooms = [];
  styles = [];
  users = [];
  armodels = [];
  listRooms = [];
  listPlans = [];
  listARModels = [];
  plans = [];
  isClickOnCreateProject = false;
  isClickOnEditProject = false;
  isClickOnEditOrDeleteLayout = false;
  isClickOnEditOrDeleteRoom = false;
  defaultRoom = false;
  private tableWidget: any;
  gameInstance: any;
  selectedProject: any;
  miniImageUrl: string;
  infoMessage: string;
  iframeMessage: string;
  projectId: any;

  image: any;
  nameRoom: string;
  interior: string;
  dayTime = 'day';
  namePlan: string;

  planImg: any;
  planName: string;
  floorNumber: string;

  arName: string;
  objectFile: any;
  materialFile: any;
  arsize: number;


  @Input() projects: any;
  @Output() shipmentSelected: EventEmitter<any> = new EventEmitter();

  savedProjectData = {};
  planIdForDeleteOrEdit: any;
  roomIdForDeleteOrEdit: any;
  arIdForDeleteOrEdit: any;

  constructor(private el: ElementRef, private fb: FormBuilder, private projectService: ProjectService,
              private redirectService: RedirectService, private userService: UserService,
              private ng2ImgToolsService: Ng2ImgToolsService) {
    super({
      name: '',
      description: '',
      logo: '',
      photos: '',
      videoUrl: '',
      plan: '',
      armodels: ''
    }, {
      name: {
        required: 'Name is required.'
      },
      description: {
        required: 'Description is required.'
      },
      logo: {
        required: 'Logo is required.'
      },
      photos: {
        required: 'Photo is required.'
      },
      videoUrl: {
        required: 'Youtube is required.'
      },
      plan: {
        required: 'Plan is required.'
      },
      armodels: {
        required: 'AR models is required.'
      },
      typesRooms: {
        required: 'Types of rooms is required.'
      },
      syles: {
        required: 'Interior styles is required.'
      }
    });
  }

  ngOnInit() {
    this.getAllProjects(() => {
      this.createProjectForm();
      this.loadProjects();
    });

  }

  public getAllProjects(callback) {
    this.projectService.getAllProjects().then(projects => {
      this.projects = projects.projectList;
      this.projects.forEach((project) => {
        project['listUsers'] = project.users.join(', ');
      });
      callback();
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
  }

  public getAllUsersWithoutFilter(callback) {
    this.userService.getAllUserWithoutFilter().then(users => {
      this.users = users['userList'];
      callback();
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
  }

  public loadProjects(): void {
    if (this.tableWidget) {
      this.tableWidget.destroy();
    }
    const tableOptions: any = {
      data: this.projects,
      responsive: true,
      lengthMenu: [5, 10, 15],
      select: true,
      paging: true,
      columns: [
        {
          title: 'Project view',
          data: 'miniImageUrl',
          'bSortable': false,
          'mRender': function (data) {
              return '<img style="height: 80px; width: auto;" src="' + environment.serverUrl + data + '" />';
          }
        },
        {title: 'Project name', data: 'name'},
        {title: 'Project description', data: 'description'},
        {title: 'Users', data: 'listUsers'},
        {title: 'Project code', data: 'projectCode'},
        {
          title: 'Update list of users',
          data: null,
          'bSortable': false,
          'mRender': function (data) {
            return '<button style="color: white; background-color: black;" class="btn btn-primary btn-sm" id="'
              + data['id'] + '">' + 'Update' + '</button>';
          }
        }, {
          title: 'Share project',
          data: null,
          'bSortable': false,
          'mRender': function (data) {
            return '<a style="color: white; background-color: black;" class="btn btn-primary btn-sm" id="'
              + data['id'] + '">' + 'Share' + '</a>';
          }
        }
      ]
    };
    this.projectsTable = $(this.el.nativeElement.querySelector('table'));
    this.tableWidget = this.projectsTable.DataTable(tableOptions);
    this.tableWidget.on('select', (e, dt, type, indexes) => {
      this.selectedProject = this.projects[indexes[0]];
      this.shipmentSelected.emit(this.projects[indexes[0]]);
    });
    this.tableWidget.on('deselect', () => {
      this.selectedProject = null;
      localStorage.removeItem('projectId');
    });

    this.tableWidget.on('click', 'button', (event) => {
      this.choiceUsersToProject(event.target.id);
    });

    this.tableWidget.on('click', 'a', (event) => {
      this.shareProject(event.target.id);
    });
  }

  public choiceUsersToProject(id) {
    this.projectId = id;
    $('#usersModal').modal('show');
    const findProject = this.projects.find((project) => {
      return project.id == id;
    });
    this.getAllUsersWithoutFilter(() => {
      this.users.forEach((user) => {
        findProject['users'].includes(user.email) ? user.checked = 'true' : user.checked = '';
      });
    });

  }

  public addUsersToProject() {
    let listUsersIds = [];
    $('.users').each((index, elem) => {
      if ($(elem).prop('checked')) {
        listUsersIds.push(this.users[index].userId);
      }
    });
    const projectData = new FormData();
    listUsersIds.forEach((id) => {
      projectData.append('userIds', id.toString());
    });
    projectData.append('projectId', this.projectId.toString());
    this.userService.addUsersToProject(projectData).then(result => {
      this.projectId = null;
      this.getAllProjects(() => {
        this.loadProjects();
      });
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
  }

  public onSaveHandler(): void {
    $('#infoBox').modal('show');
    this.projectForm.patchValue({
      styles: this.styles,
      typesRooms: this.typesRooms,
      plansName: this.plans,
      armodels: this.armodels
    });

    const projectData = this.projectForm.value;
    if (!this.projectForm.value['name'] || !this.projectForm.value['description']
      || !this.projectForm.value['logo'] || !this.projectForm.value['videoUrl']
      || this.projectForm.value['armodels'].length === 0 || this.projectForm.value['typesRooms'].length === 0
      || this.projectForm.value['styles'].length === 0  || this.projectForm.value['plansName'].length === 0) {
      this.infoMessage = 'Project data is invalid, please check it.';
    } else if (this.styles.length > 3) {
      this.infoMessage = 'Max count interior styles are 3';
    } else {
      projectData.miniImageUrl = this.miniImageUrl || this.projectForm.value['logo'];
      projectData.plansName = this.plans;
      projectData.armodels = this.armodels;
      projectData.projectPhotos = this.projectPhotos;

      if (this.isClickOnEditProject) {
        this.updateProjectInfo({
          project: {
            id: localStorage.getItem('projectId'),
            name: projectData.name,
            description: projectData.description,
            videoUrl: projectData.videoUrl,
            miniImageUrl: projectData.miniImageUrl,
            interiorsInfo: this.styles,
            roomsInfo: this.typesRooms,
            plansInfo: this.plans,
            arObjectsInfo: this.armodels
          }, error: null
        });
      } else {
        this.projectService.addProjectInfo({
          project: {
            name: projectData.name,
            description: projectData.description,
            videoUrl: projectData.videoUrl,
            miniImageUrl: projectData.miniImageUrl,
            interiorsInfo: this.styles,
            roomsInfo: this.typesRooms,
            plansInfo: this.plans,
            arObjectsInfo: this.armodels
          }, error: null
        }).then((result) => {
          this.savedProjectData = result.project;
          localStorage.setItem('projectId', result.project['id']);
          this.addProjectPhotos(result, () => {
            this.infoMessage = 'Common settings were saved';
            this.getAllNewProjectData();
          });
          this.isClickOnEditProject = true;
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
  }

  private addProjectPhotos(result, callback) {
    $('#infoBox').modal('show');
    const photosFormData = new FormData();
    this.projectPhotosFiles.forEach((photo) => {
      photosFormData.append('photos', photo);
    });
    photosFormData.append('projectId', result.project.id);
    this.projectService.addProjectPhotos(photosFormData).then((res) => {
      this.projectPhotosFiles = [];
      callback();
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
  }

  private updateProjectPhotos() {
    $('#infoBox').modal('show');
    const photosFormData = new FormData();
    const project = this.savedProjectData ? this.savedProjectData : this.selectedProject;
    project['imageUrls'].forEach((img) => {
      this.projectPhotos.forEach((photo) => {
        if (photo.indexOf('base64') == -1 && this.projectPhotos.indexOf((environment.serverUrl + img)) == -1) {
          photosFormData.append('deletedPhotosPaths', img);
        }
      });
    });

    this.projectPhotosFiles.forEach((photo) => {
      photosFormData.append('photos', photo);
    });
    photosFormData.append('projectId', localStorage.getItem('projectId'));
    this.projectService.updateProjectPhotos(photosFormData).then((res) => {
      this.projectPhotosFiles = [];
      this.selectedProject = [];
      this.getAllNewProjectData();
      this.infoMessage = 'Common settings were changed';
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
  }

  private updateProjectInfo(projectInfo) {
    $('#infoBox').modal('show');
    this.projectService.updateProjectInfo(projectInfo).then((res) => {
      this.updateProjectPhotos();
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
  }

  public onEditProject() {
    this.isClickOnEditProject = true;
    this.getAllNewProjectData();

    this.projectForm.patchValue({
      name: this.selectedProject['name'],
      logo: this.selectedProject['miniImageUrl'],
      description: this.selectedProject['description'],
      videoUrl: this.selectedProject['videoUrl'],
      plansName: this.plans,
      miniImageUrl: this.selectedProject['miniImageUrl'],
      photos: this.selectedProject['imageUrls'].length + 'files',
      styles: this.styles,
      typesRooms: this.typesRooms,
    });
  }

  public onUpdateFiles(result) {
    if (this.projectPhotos.length + result.target.files.length > 15) {
      $('#infoBox').modal('show');
      this.infoMessage = 'Max length is 15 photos';
    } else {
      this.projectForm.controls['photos'].setValue(this.projectPhotos ?
        this.projectPhotos.length + result.target.files.length + ' files' : '');
      const tgt = result.target || window.event.srcElement,
        files = tgt.files;
      const filesArr = Array.prototype.slice.call(files);
      if (FileReader && files && files.length) {
        filesArr.forEach((i) => {
          this.ng2ImgToolsService.resize([i], 4000, 2000).subscribe(result => {
            if (result) {
              const fr = new FileReader();
              this.projectPhotosFiles.push(result);
              fr.onload = () => {
                this.projectPhotos.push(fr.result);
              };
              fr.readAsDataURL(result);
            }
          }, error => {
            $('#infoBox').modal('show');
            this.infoMessage = 'Something wrong, please try again.';
          });
        });
      }
    }
    result.target.value = [];
  }

  public onUpdateMapFiles(result) {
    if (this.mapsPhotos.length + result.target.files.length > 15) {
      $('#infoBox').modal('show');
      this.infoMessage = 'Max length is 15 photos';
    } else {
      const tgt = result.target || window.event.srcElement,
        files = tgt.files;
      const filesArr = Array.prototype.slice.call(files);
      if (FileReader && files && files.length) {
        filesArr.forEach((i) => {
          const fr = new FileReader();
          this.projectMapsFiles.push(i);
          fr.onload = () => {
            this.mapsPhotos.push(fr.result);
          };
          fr.readAsDataURL(i);
        });
      }
    }
    result.target.value = [];
  }

  onClearForm() {
    this.projectForm.reset();
    this.photos360 = [];
    this.projectPhotos = [];
    this.projectPhotosFiles = [];
    this.logo = [];
    this.plans = [];
    this.armodels = [];
    this.typesRooms = [];
    this.styles = [];
  }

  clickOnCreate(){
    this.isClickOnCreateProject = true;
    this.isClickOnEditProject = false;
    this.selectedProject = null;
    this.onClearForm();
  }

  private createProjectForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      logo: ['', [Validators.required]],
      photos: ['', [Validators.required]],
      videoUrl: ['', [Validators.required]],
      plansName: ['', [Validators.required]],
      armodels: ['', [Validators.required]],
      typesRooms: ['', [Validators.required]],
      styles: ['', [Validators.required]]
    });

    this.projectForm.valueChanges.subscribe(data => this.onValueChanged(this.projectForm, data));

    this.onValueChanged(this.projectForm);
  }

  public onFileChange(event, controlName) {
      switch (controlName) {
        case 'logo':
          this.logo[0] = event.target.files[0];
          this.ng2ImgToolsService.resize([this.logo[0]], 4000, 2000).subscribe(result => {
            this.projectForm.controls['logo'].setValue(this.logo[0] ? this.logo[0].name : '');
            if (result) {
              const fr = new FileReader();
              fr.onload = () => {
                this.miniImageUrl = fr.result;
              };
              fr.readAsDataURL(result);
            }
          }, error => {
            $('#infoBox').modal('show');
            this.infoMessage = 'Something wrong, please try again.';
          });
          this.projectForm.controls['logo'].setValue(this.logo[0] ? this.logo[0].name : '');
          if (this.logo[0]) {
            const fr = new FileReader();
            fr.onload = () => {
              this.miniImageUrl = fr.result;
            };
            fr.readAsDataURL(this.logo[0]);
          }
          break;
        case 'objectFile':
          this.objectFile = event.target.files[0];
          break;
        case 'materialFile':
          this.materialFile = event.target.files[0];
          break;
        case 'roomFile':
          this.image = event.target.files[0];
          break;
        case 'planFile':
          this.planImg = event.target.files[0];
          break;
        default:
          break;
      }
    event.target.value = [];
  }

  public deleteProjectPhoto(event) {
    let find = false;
    this.projectPhotosFiles.forEach((elem, i) => {
      const fr = new FileReader();
      fr.onload = () => {
        if(fr.result == event.target.src && !find) {
          this.projectPhotosFiles.splice(i, 1);
          find = true;
        }
      };
      fr.readAsDataURL(elem);
    });
    this.projectPhotos.splice(this.projectPhotos.indexOf(event.target.src), 1);
  }

  public deleteMapsPhoto(event) {
    this.mapsPhotos.splice(this.mapsPhotos.indexOf(event.target.src), 1);
    this.projectMapsFiles.splice(this.projectMapsFiles.indexOf(event.target.src), 1);
  }

  public openEditor() {
    const newWin = window.open('../../../../../assets/js/plugins/unity/index.html', '', 'width=700,height=500');
    localStorage.setItem('projectId', this.selectedProject['id']);
    localStorage.setItem('type', 'edit');
  }

  public addNewImgRoom(nameRoomId, interiorId, dayTime, namePlanId, defaultRoom) {
    this.infoMessage = '';
    this.image = this.image ? this.image : [];
    $('#infoBox').modal('show');
    const findDefaultRoom = this.listRooms.find((room) => {
      return room.defaultRoom;
    });
    const findRoomName = this.savedProjectData['roomsInfo'].find((info) => {
      return info.id == nameRoomId;
    });
    let findRoom = this.listRooms.find((room) => {
      return room.interiorId == interiorId && room.dayTime.toLowerCase() == dayTime
        && room.planId == namePlanId && findRoomName.name == room.name;
    });
    findRoom = findRoom ? findRoom : [];
     if (!nameRoomId || !interiorId || !dayTime || !namePlanId || this.image.length == 0) {
      this.infoMessage = 'Rooms data is invalid, please check it.';
    } else if (findRoom.length != 0 && findRoom.imageRoomId != this.roomIdForDeleteOrEdit) {
      this.infoMessage = 'This room with the same parameters has already been added';
    } else if (findDefaultRoom && defaultRoom && findDefaultRoom.imageRoomId != this.roomIdForDeleteOrEdit) {
      this.infoMessage = 'Default room already exists';
    } else {
      const foundStyleName = this.savedProjectData['interiorsInfo'].find(function (element) {
        return element.id = interiorId;
      });

      const foundRoomName = this.savedProjectData['roomsInfo'].find(function (element) {
        return element.id = nameRoomId;
      });

      const foundPlanName = this.savedProjectData['plansInfo'].find(function (element) {
        return element.id = namePlanId;
      });

      if (this.isClickOnEditOrDeleteRoom && this.roomIdForDeleteOrEdit) {
        const dayTimeId = (dayTime === 'day') ? 1 : 2;
        const roomFormData = new FormData();
        const appendForm = (result) => {
          roomFormData.append('roomObjects', result);
          roomFormData.append('dayTimeId', dayTimeId.toString());
          roomFormData.append('nameOfRoomId', nameRoomId);
          roomFormData.append('objectPlanId', namePlanId);
          roomFormData.append('interiorId', interiorId);
          roomFormData.append('defaultRoom', defaultRoom ? 'true' : 'false');
          roomFormData.append('imageRoomId', this.roomIdForDeleteOrEdit);
          roomFormData.append('projectId', localStorage.getItem('projectId'));
          this.projectService.updateRoom(roomFormData).then((res) => {
            this.getAllNewProjectData();
            $('#roomImg').modal('hide');
            this.infoMessage = 'Room was updated';
            this.resetRoomsForm();
          }, error => {
            this.redirectService.checkRedirect(error.status, (message) => {
              if (message) {
                this.infoMessage = 'Something wrong, please try again.';
                $('#infoBox').modal('show');
              }
            });
          });
          this.roomIdForDeleteOrEdit = null;
        };
        typeof this.image !== 'string' ?
        this.ng2ImgToolsService.resize([this.image], 4000, 2000).subscribe(result => {
          appendForm(result);
        }, error => {
          this.infoMessage = 'Something wrong, please try again.';
        }) : appendForm(this.image);
      } else {
        if (this.image) {
          const fr = new FileReader();
          fr.onload = () => {
            this.listRooms.push({
              name: foundRoomName.name,
              interior: foundStyleName.name,
              dayTime: dayTime,
              image: this.image,
              imgBase64: fr.result,
              planName: foundPlanName.name
            });
          };
          const dayTimeId = (dayTime === 'day') ? 1 : 2;
          const roomFormData = new FormData();
          this.ng2ImgToolsService.resize([this.image], 4000, 2000).subscribe(result => {
            roomFormData.append('roomObjects', result);
            roomFormData.append('dayTimeId', dayTimeId.toString());
            roomFormData.append('nameOfRoomId', nameRoomId);
            roomFormData.append('objectPlanId', namePlanId);
            roomFormData.append('interiorId', interiorId);
            roomFormData.append('defaultRoom', defaultRoom ? 'true' : 'false');
            roomFormData.append('projectId', localStorage.getItem('projectId'));
            this.projectService.addRoom(roomFormData).then((res) => {
              this.getAllNewProjectData();
              $('#roomImg').modal('hide');
              this.infoMessage = 'Room was added';
              this.resetRoomsForm();
            }, error => {
              this.redirectService.checkRedirect(error.status, (message) => {
                if (message) {
                  this.infoMessage = 'Something wrong, please try again.';
                  $('#infoBox').modal('show');
                }
              });
            });
            fr.readAsDataURL(this.image);
          }, error => {
            this.infoMessage = 'Something wrong, please try again.';
          });

        } else {
          this.infoMessage = 'Image is mandatory!';
        }
      }
    }
  }

  public addNewImgPlan(namePlanId, floorNumber) {
    const foundPlanName = this.savedProjectData['plansInfo'].find(function (element) {
      return element.id == namePlanId;
    });
    const foundPlanNameInListPlans = this.listPlans.find(function (element) {
      return element.planName == foundPlanName.name;
    });
    $('#infoBox').modal('show');
    if (!namePlanId || !this.planImg || !floorNumber) {
      this.infoMessage = 'Plans data is invalid, please check it.';
    } else if (this.listPlans.length + 1 > this.savedProjectData['plansInfo'].length -1
      && !this.isClickOnEditOrDeleteLayout) {
      this.infoMessage = 'You can add only ' + (this.savedProjectData['plansInfo'].length - 1)
        + ' plans. You can change count plans in common settings!';
    } else if (foundPlanNameInListPlans) {
      this.infoMessage = 'Plan with this name already exists!';
    } else {
      if (this.isClickOnEditOrDeleteLayout && this.planIdForDeleteOrEdit) {
        const appendForm = (result) => {
          const planFormData = new FormData();
          planFormData.append('plans', result);
          planFormData.append('planId', this.planIdForDeleteOrEdit);
          planFormData.append('planInfoId', namePlanId);
          planFormData.append('floorNumber', floorNumber);
          planFormData.append('projectId', localStorage.getItem('projectId'));
          this.projectService.updateProjectPlan(planFormData).then((res) => {
            this.resetPlansForm();
            this.getAllNewProjectData();
            $('#planImg').modal('hide');
            this.infoMessage = 'Layout was updated';
          }, error => {
            this.redirectService.checkRedirect(error.status, (message) => {
              if (message) {
                this.infoMessage = 'Something wrong, please try again.';
                $('#infoBox').modal('show');
              }
            });
          });
        };
        typeof this.planImg !== 'string' ?
          this.ng2ImgToolsService.resize([this.planImg], 4000, 2000).subscribe(result => {
            appendForm(result);
          }, error => {
            this.infoMessage = 'Something wrong, please try again.';
          }) : appendForm(this.image);
        this.planIdForDeleteOrEdit = null;
        this.isClickOnEditOrDeleteLayout = false;
      } else {
        if (this.planImg) {
          const fr = new FileReader();
          fr.onload = () => {
            this.listPlans.push({
              planName: foundPlanName.name,
              planImg: this.planImg,
              imgBase64: fr.result,
              floorNumber: floorNumber
            });
          };
          const planFormData = new FormData();
          this.ng2ImgToolsService.resize([this.planImg], 4000, 2000).subscribe(result => {
            planFormData.append('plans', result);
            planFormData.append('planInfoId', namePlanId);
            planFormData.append('floorNumber', floorNumber);
            planFormData.append('projectId', localStorage.getItem('projectId'));
            this.projectService.addProjectPlan(planFormData).then((res) => {
              this.getAllNewProjectData();
              $('#planImg').modal('hide');
              this.infoMessage = 'Layout was added';
            }, error => {
              this.redirectService.checkRedirect(error.status, (message) => {
                if (message) {
                  this.infoMessage = 'Something wrong, please try again.';
                  $('#infoBox').modal('show');
                }
              });
            });
            fr.readAsDataURL(result);
          });
        } else {
          this.infoMessage = 'Image is mandatory!';
        }
      }
      this.resetPlansForm();
    }
  }

  resetRoomsForm() {
    this.image = [];
    this.nameRoom = '';
    this.defaultRoom = false;
    this.interior = '';
    this.namePlan = '';
    this.dayTime = 'day';
    this.isClickOnEditOrDeleteRoom = false;
  }

  resetPlansForm() {
    this.planImg = [];
    this.planName = '';
    this.floorNumber = '';
    this.planIdForDeleteOrEdit = null;
    this.isClickOnEditOrDeleteLayout = false;
  }

  resetARModelForm() {
    this.infoMessage = null;
    this.objectFile = [];
    this.materialFile = [];
    this.arName = '';
    this.arsize = null;
  }

  onDeleteProject() {
    $('#infoBox').modal('show');
    this.projectService.deleteProject(this.selectedProject['id']).then((res) => {
      this.infoMessage = 'Project was deleted';
      this.getAllProjects(() => {
        this.selectedProject = null;
        localStorage.removeItem('projectId');
        this.loadProjects();
      });
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
  }

  onCancel() {
    this.isClickOnCreateProject = false;
    this.isClickOnEditProject = false;
    localStorage.removeItem('projectId');
  }

  showMessageDeletePlan(id) {
    $('#infoDeletePlan').modal('show');
    this.planIdForDeleteOrEdit = id;
  }

  onDeletePlan() {
    $('#infoBox').modal('show');
    this.projectService.deletePlan(this.planIdForDeleteOrEdit).then((res) => {
      this.infoMessage = 'Plan was deleted';
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
    this.planIdForDeleteOrEdit = null;
    this.getAllNewProjectData();
  }

  onEditPlan(id) {
    this.isClickOnEditOrDeleteLayout = true;
    this.savedProjectData = this.savedProjectData ? this.savedProjectData : this.selectedProject;
    const plan = this.savedProjectData['plans'].find((pl) => {
      return id == pl.id;
    });
    const planInfoId = this.savedProjectData['plansInfo'].find((planInfo) => {
      return planInfo.name == plan.planName;
    });
    this.planIdForDeleteOrEdit = plan.id;
    this.floorNumber = plan.floorNumber;
    this.planImg = environment.serverUrl + plan.imageUrl;
    this.planName = planInfoId.id;
    $('#planImg').modal('show');
  }

  onEditRoom(id) {
    this.isClickOnEditOrDeleteRoom = true;
    this.savedProjectData = this.savedProjectData ? this.savedProjectData : this.selectedProject;
    this.savedProjectData['plans'].forEach((plan) => {
      plan.rooms.forEach((room) => {
        room['interiors'].forEach((interior) => {
          interior['daytimes'].forEach((time) => {
            if (time.imageRoomId == id) {
              const roomInfo = this.savedProjectData['roomsInfo'].find((roomInfo) =>{
                return roomInfo.name === room.name;
              });
              this.roomIdForDeleteOrEdit = time.imageRoomId;
              this.namePlan = plan.id;
              this.interior = interior.id;
              this.image = environment.serverUrl + time.imageUrl;
              this.nameRoom = roomInfo.id;
              this.dayTime = time.id === 1 ? 'day' : 'night';
              this.defaultRoom = time.default;
            }
          });
        });
      });
    });
    $('#roomImg').modal('show');
  }

  showMessageDeleteRoom(imageRoomId) {
    $('#infoDeleteRoom').modal('show');
    this.roomIdForDeleteOrEdit = imageRoomId;
  }

  onDeleteRoom() {
    $('#infoBox').modal('show');
    this.projectService.deleteRoom(this.roomIdForDeleteOrEdit).then((res) => {
      this.infoMessage = 'Room was deleted';
      this.getAllNewProjectData();
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
    this.roomIdForDeleteOrEdit = null;
  }

  getAllNewProjectData() {
    this.getAllProjects(() => {
      this.loadProjects();
      let projectId;
      if(Array.isArray(this.selectedProject)){
        projectId = this.selectedProject.length == 0 ? this.savedProjectData['id'] : this.selectedProject['id'];
      } else {
        projectId = this.selectedProject ?  this.selectedProject['id'] : this.savedProjectData['id'];
      }
      const currentProject = this.projects.find((project) => {
        return project.id == projectId;
      });
      localStorage.setItem('projectId', projectId);

      this.savedProjectData = currentProject;

      const photosLinks = this.savedProjectData['imageUrls'].map(photo =>
        environment.serverUrl + photo);
      this.logo[0] = {name: environment.serverUrl + this.savedProjectData['miniImageUrl']};
      this.projectPhotos = photosLinks;

      this.styles = [];
      this.savedProjectData['interiorsInfo'].forEach((elem) => {
        if(elem.name != 'No select') {
          this.styles.push(elem.name);
        }
      });

      this.typesRooms = [];
      this.savedProjectData['roomsInfo'].forEach((elem) => {
        if(elem.name != 'No select'){
          this.typesRooms.push(elem.name);
        }
      });

      this.plans = [];
      this.savedProjectData['plansInfo'].forEach((elem) => {
        if(elem.name != 'No select') {
          this.plans.push(elem.name);
        }
      });

      this.armodels = [];
      this.savedProjectData['arObjectsInfo'].forEach((elem) => {
        if(elem.name != 'No select') {
          this.armodels.push(elem.name);
        }
      });

      this.listPlans = [];
      this.listRooms = [];
      this.listARModels = [];
      this.savedProjectData['arObjects'].forEach((model) => {
        const additional = model.mtlUrl.map(mtl => environment.serverUrl + mtl);
        this.listARModels.push({
          name: model.name,
          size: model.size,
          modelId: model.id,
          objectFile: environment.serverUrl + model.url,
          materialFiles: additional,
        });
      });

      this.savedProjectData['plans'].forEach((plan) => {
        this.listPlans.push({
          planName: plan.planName,
          planImg: environment.serverUrl + plan.imageUrl,
          imgBase64: environment.serverUrl + plan.imageUrl,
          floorNumber: plan.floorNumber,
          planId: plan.id
        });
        plan.rooms.forEach((room) => {
          room['interiors'].forEach((interior) => {
            interior['daytimes'].forEach((time) => {
              this.listRooms.push({
                name: room.name,
                interior: interior.name,
                interiorId: interior.id,
                dayTime: time.id === 1 ? 'Day' : 'Night',
                planName: plan.planName,
                imgBase64: environment.serverUrl + time.imageUrl,
                planId: plan.id,
                roomId: room.id,
                imageRoomId: time.imageRoomId,
                defaultRoom: time.default
              });
            });
          });
        });
      });
    });
  }

  addNewARModel(arName, arsize) {
    $('#infoBox').modal('show');
    if (!arName || !this.objectFile || !arsize || !this.materialFile) {
      this.infoMessage = 'AR model data is invalid, please check it.';
    } else if (this.listARModels.length + 1 > this.savedProjectData['arObjectsInfo'].length) {
      this.infoMessage = 'You can add only ' + this.savedProjectData['arObjectsInfo'].length +
        ' AR models. You can change count models in common settings!';
    } else {
      const foundARName = this.savedProjectData['arObjectsInfo'].find(function (element) {
        return element.id = arName;
      });

      this.listARModels.push({
        objectFile: this.objectFile.name,
        materialFile: this.materialFile.name,
        size: arsize,
        name: foundARName.name
      });

      const armodelFormData = new FormData();
      armodelFormData.append('arObjects', this.objectFile);
      armodelFormData.append('arObjects', this.materialFile);
      armodelFormData.append('arInfoId', arName);
      armodelFormData.append('size', arsize);
      armodelFormData.append('projectId', localStorage.getItem('projectId'));
      this.projectMapsFiles.forEach((file) => {
        armodelFormData.append('arMapsObjects', file);
      });
      this.projectService.addProjectAr(armodelFormData).then((res) => {
        this.getAllNewProjectData();
        $('#armodel').modal('hide');
        this.infoMessage = 'AR was added';
      }, error => {
        this.redirectService.checkRedirect(error.status, (message) => {
          if (message) {
            this.infoMessage = 'Something wrong, please try again.';
            $('#infoBox').modal('show');
          }
        });
      });
      this.resetARModelForm();
    }
  }

  showMessageDeleteARModel(id) {
    $('#infoDeleteArmodel').modal('show');
    this.arIdForDeleteOrEdit = id;
  }

  onDeleteArModel() {
    $('#infoBox').modal('show');
    this.projectService.deleteArModel(this.arIdForDeleteOrEdit).then((res) => {
      this.infoMessage = 'AR model was deleted';
      this.getAllNewProjectData();
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
    this.arIdForDeleteOrEdit = null;
    this.getAllNewProjectData();
  }

  closeModal() {
    $('#infoBox').modal('hide');
    $('#projectSharingModal').modal('hide');
    this.infoMessage = null;
  }

  changeDescription(target) {
    const myRe = / (?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+|^(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/gm;
     if(new RegExp(myRe).test(target.value)) {
       target.value = target.value.replace(myRe, ' [' + target.value.match(myRe)[0].trim() + '] - link name:()');
     }
  }

  shareProject(id) {
    $('#projectSharingModal').modal('show');
    this.projectService.getShareProject(id).then((result) => {
      this.infoMessage = result.shareLink;
      this.iframeMessage = `<iframe style="width: 600px; height: 500px;"allowvr="yes" scrolling="no" 
allow="gyroscope; accelerometer; xr" src="${result.shareLink}" 
allowfullscreen allowfullscreen="true" webkitallowfullscreen="true" 
mozallowfullscreen="true" oallowfullscreen="true" msallowfullscreen="true"></iframe>`;
    }, (error) => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = 'Something wrong, please try again.';
          $('#infoBox').modal('show');
        }
      });
    });
  }

  copyLink() {
    Clipboard.copy($('#linkForSharing').val());
    this.setTooltip('Copied', '#copy-btn');
    this.hideTooltip('#copy-btn');
  }

  setTooltip(message, elelemnt?: string) {
      $(elelemnt ? elelemnt : '#copy-btn')
      .attr('data-original-title', message)
      .tooltip('show');
  }

  copyIframe() {
    Clipboard.copy($('#iframeForSharing').val());
    this.setTooltip('Copied');
    this.hideTooltip();
  }

  hideTooltip(elelemnt?: string) {
    setTimeout(function() {
      $(elelemnt ? elelemnt : '#copy-btn').tooltip('destroy');
    }, 1000);
  }

}
