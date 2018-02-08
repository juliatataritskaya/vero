import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {ManagerService} from '../../../../services/manager.service';
import {RedirectService} from '../../../../services/redirect.service';
import {environment} from '../../../../../environments/environment';

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
  projectPhotosFiles: any = [];
  photos360: any = [];
  logo: any = [];
  typesRooms = [];
  styles = [];
  armodels = [];
  listRooms = [];
  listPlans = [];
  listARModels = [];
  plans = [];
  isClickOnCreateProject = false;
  isClickOnEditProject = false;
  isClickOnEditOrDeleteLayout = false;
  isClickOnEditOrDeleteRoom = false;
  private tableWidget: any;
  gameInstance: any;
  selectedProject: object;
  miniImageUrl: string;
  infoMessage = '';

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

  constructor(private el: ElementRef, private fb: FormBuilder, private managerService: ManagerService,
              private redirectService: RedirectService) {
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
    this.managerService.getAllProjects().then(projects => {
      this.projects = projects.projectList;
      this.projects.forEach((project) => {
        project['listUsers'] = project.users.join(', ');
      });
      callback();
    }, error => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
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
        {title: 'Project name', data: 'name'},
        {title: 'Project description', data: 'description'},
        {title: 'Users', data: 'listUsers'},
        {title: 'Update list of users', data: null, defaultContent: '<button>update</button>'},
        {title: 'Project code', data: 'projectCode'}
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
  }

  public onSaveHandler(): void {
    this.infoMessage = '';
    this.projectForm.patchValue({
      styles: this.styles,
      typesRooms: this.typesRooms,
      plansName: this.plans,
      armodels: this.armodels

    });

    const projectData = this.projectForm.value;
    if (!this.projectForm.value['name'] || !this.projectForm.value['description']
      || !this.projectForm.value['logo'] || !this.projectForm.value['videoUrl']
      || !this.projectForm.value['armodels'] || !this.projectForm.value['typesRooms']
      || !this.projectForm.value['styles'] || !this.projectForm.value['plansName']) {
      this.infoMessage = 'Project data in invalid, please check it.';
      return;
    }

    if (this.styles.length > 3) {
      this.infoMessage = 'Max count interior styles are 3';
      return;
    }

    projectData.miniImageUrl = this.miniImageUrl || this.projectForm.value['logo'];
    projectData.plansName = this.plans;
    projectData.armodels = this.armodels;
    projectData.projectPhotos = this.projectPhotos;

    if (this.isClickOnEditProject) {
      this.updateProjectInfo({
        project: {
          id: this.selectedProject['id'],
          name: projectData.name,
          description: projectData.description, videoUrl: projectData.videoUrl, miniImageUrl: projectData.miniImageUrl,
          interiorsInfo: this.styles, roomsInfo: this.typesRooms, plansInfo: this.plans, arObjectsInfo: this.armodels
        }, error: null
      });
      return;
    }
    this.managerService.addProjectInfo({
      project: {
        name: projectData.name,
        description: projectData.description, videoUrl: projectData.videoUrl, miniImageUrl: projectData.miniImageUrl,
        interiorsInfo: this.styles, roomsInfo: this.typesRooms, plansInfo: this.plans, arObjectsInfo: this.armodels
      }, error: null
    }).then((result) => {
      this.savedProjectData = result.project;
      localStorage.setItem('projectId', result.project['id']);
      this.addProjectPhotos(result, () => {
        this.infoMessage = 'Common settings were saved';
        this.getAllProjects(() => {
          this.loadProjects();
        });
        // this.onClearForm();
      });
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
    });

  }

  private addProjectPhotos(result, callback) {
    const photosFormData = new FormData();
    this.projectPhotosFiles.forEach((photo) => {
      photosFormData.append('photos', photo);
    });
    photosFormData.append('projectId', result.project.id);
    this.managerService.addProjectPhotos(photosFormData).then((res) => {
      callback();
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
    });
  }

  private updateProjectPhotos() {
    const photosFormData = new FormData();
    this.selectedProject['imageUrls'].forEach((img) => {
      this.projectPhotos.forEach((photo) => {
        if (photo.indexOf(img) == -1) {
          photosFormData.append('deletedPhotosPaths', img);
        }
      });
    });
    this.projectPhotosFiles.forEach((photo) => {
      photosFormData.append('photos', photo);
    });
    photosFormData.append('projectId', localStorage.getItem('projectId'));
    this.managerService.updateProjectPhotos(photosFormData).then((res) => {
      this.projectPhotosFiles = [];
      this.projectPhotos = [];
      this.selectedProject = [];
      this.getAllProjects(() => {
        this.loadProjects();
      });
      this.onClearForm();
      this.infoMessage = 'Common settings were changed';
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
    });
  }

  private updateProjectInfo(projectInfo) {
    this.managerService.updateProjectInfo(projectInfo).then((res) => {
      this.updateProjectPhotos();
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
    });
  }

  private addProjectPlan(result, plan, callback) {
    const planFormData = new FormData();
    planFormData.append('plans', plan[0]);
    planFormData.append('projectId', result.project.id);
    this.managerService.addProjectPlan(planFormData).then((res) => {
      callback();
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
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
      return;
    }
    this.projectForm.controls['photos'].setValue(this.projectPhotos ?
      this.projectPhotos.length + result.target.files.length + ' files' : '');
    const tgt = result.target || window.event.srcElement,
      files = tgt.files;
    const filesArr = Array.prototype.slice.call(files);
    if (FileReader && files && files.length) {
      filesArr.forEach((i) => {
        const fr = new FileReader();
        this.projectPhotosFiles.push(i);
        fr.onload = () => {
          this.projectPhotos.push(fr.result);
        };
        fr.readAsDataURL(i);
      });
    }
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
    this.projectPhotos.splice(this.projectPhotos.indexOf(event.target.src), 1);
    this.projectPhotosFiles.slice(this.projectPhotos.indexOf(event.target.src), 1);
  }

  public openEditor() {
    const newWin = window.open('../../../../../assets/js/plugins/unity/index.html', '', 'width=600,height=400');
    localStorage.setItem('projectId', localStorage.getItem('projectId'));
  }

  public addNewImgRoom(nameRoomId, interiorId, dayTime, namePlanId) {
    if (!nameRoomId || !interiorId || !dayTime || !this.image) {
      this.infoMessage = 'Plans data in invalid, please check it.';
      $('#infoBox').modal('show');
      return;
    }
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
      roomFormData.append('roomObjects', this.image);
      roomFormData.append('dayTimeId', dayTimeId.toString());
      roomFormData.append('nameOfRoomId', nameRoomId);
      roomFormData.append('objectPlanId', namePlanId);
      roomFormData.append('interiorId', interiorId);
      roomFormData.append('imageRoomId', this.roomIdForDeleteOrEdit);
      roomFormData.append('projectId', localStorage.getItem('projectId'));
      this.managerService.updateRoom(roomFormData).then((res) => {
        console.log(res);
        this.getAllNewProjectData();
        this.resetRoomsForm();
        alert('Room was updated');
      }, error => {
        console.log(error);
      });
      this.roomIdForDeleteOrEdit = null;
      return;
    }

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
      roomFormData.append('roomObjects', this.image);
      roomFormData.append('dayTimeId', dayTimeId.toString());
      roomFormData.append('nameOfRoomId', nameRoomId);
      roomFormData.append('objectPlanId', namePlanId);
      roomFormData.append('interiorId', interiorId);
      roomFormData.append('projectId', localStorage.getItem('projectId'));
      this.managerService.addRoom(roomFormData).then((res) => {
        console.log(res);
        this.getAllNewProjectData();
        alert('Room was added');
        this.resetRoomsForm();
      }, error => {
        console.log(error);
      });
      fr.readAsDataURL(this.image);
    } else {
      $('#infoBox').modal('show');
      this.infoMessage = 'Image is mandatory!';
      return;
    }
  }


  public addNewImgPlan(namePlanId, floorNumber) {
    if (!namePlanId || !this.planImg || !floorNumber) {
      alert('Plans data in invalid, please check it.');
      return;
    }
    if (this.listPlans.length  + 1 >  this.savedProjectData['plansInfo'].length && !this.isClickOnEditOrDeleteLayout) {
      alert('You can add only ' + this.savedProjectData['plansInfo'].length + ' plans. You can change count plans in common settings!');
      return;
    }

    const foundPlanName = this.savedProjectData['plansInfo'].find(function (element) {
      return element.id = namePlanId;
    });

    if (this.isClickOnEditOrDeleteLayout && this.planIdForDeleteOrEdit) {
      const planFormData = new FormData();
      planFormData.append('plans', this.planImg);
      planFormData.append('planId', this.planIdForDeleteOrEdit);
      planFormData.append('planInfoId', namePlanId);
      planFormData.append('floorNumber', floorNumber);
      planFormData.append('projectId', localStorage.getItem('projectId'));
      this.managerService.updateProjectPlan(planFormData).then((res) => {
        console.log(res);
        this.resetPlansForm();
        this.getAllNewProjectData();
        alert('Layout was updated');
      }, error => {
        console.log(error);
      });
      this.planIdForDeleteOrEdit = null;
      this.isClickOnEditOrDeleteLayout = false;
      return;
    }

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
      planFormData.append('plans', this.planImg);
      planFormData.append('planInfoId', namePlanId);
      planFormData.append('floorNumber', floorNumber);
      planFormData.append('projectId', localStorage.getItem('projectId'));
      this.managerService.addProjectPlan(planFormData).then((res) => {
        console.log(res);
        this.getAllNewProjectData();
        alert('Layout was added');
      }, error => {
        console.log(error);
      });
      fr.readAsDataURL(this.planImg);
    } else {
      $('#infoBox').modal('show');
      this.infoMessage = 'Image is mandatory!';
      return;
    }

    this.resetPlansForm();
  }

  resetRoomsForm() {
    this.image = [];
    this.nameRoom = '';
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
    this.objectFile = [];
    this.materialFile = [];
    this.arName = '';
    this.arsize = null;
    alert('AR was added');
  }

  clearInfoMessage() {
    this.infoMessage = '';
  }

  onDeleteProject() {
    this.managerService.deleteProject(this.selectedProject['id']).then((res) => {
      this.infoMessage = 'Project was deleted';
      alert('Project was deleted');
      this.getAllProjects(() => {
        this.selectedProject = null;
        localStorage.removeItem('projectId');
        this.loadProjects();
      });
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
      alert('Something wrong, please try again.');
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
    this.managerService.deletePlan(this.planIdForDeleteOrEdit).then((res) => {
      this.infoMessage = 'Plan was deleted';
      alert('Plan was deleted');
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
      alert('Something wrong, please try again.');
    });
    this.planIdForDeleteOrEdit = null;
    this.getAllNewProjectData();
  }

  onEditPlan(id) {
    this.isClickOnEditOrDeleteLayout = true;
    this.savedProjectData = this.savedProjectData ? this.savedProjectData : this.selectedProject;
    const plan = this.savedProjectData['plans'].find((plan) => {
      return id == plan.id;
    });
    this.planIdForDeleteOrEdit = plan.id;
    this.floorNumber = plan.floorNumber;
    this.planImg = environment.serverUrl + plan.imageUrl;
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
              this.roomIdForDeleteOrEdit = time.imageRoomId;
              this.namePlan = plan.planName;
              this.interior = interior.id;
              this.image = environment.serverUrl + time.imageUrl;
              this.nameRoom = room.name;
              this.dayTime = time.id === 1 ? 'day' : 'night';
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
    this.managerService.deleteRoom(this.roomIdForDeleteOrEdit).then((res) => {
      this.infoMessage = 'Room was deleted';
      this.getAllNewProjectData();
      alert('Room was deleted');
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
      alert('Something wrong, please try again.');
    });
    this.roomIdForDeleteOrEdit = null;
  }

  getAllNewProjectData() {
    this.getAllProjects(() => {
      this.loadProjects();
      const projectId = this.selectedProject ? this.selectedProject['id'] : this.savedProjectData['id'];
      const currentProject = this.projects.find((project) => {
        return project.id == projectId;
      });
      localStorage.setItem('projectId', projectId);

      this.savedProjectData = currentProject;
      console.log(this.savedProjectData);

      const photosLinks = this.savedProjectData['imageUrls'].map(photo =>
        environment.serverUrl + photo);
      this.logo[0] = {name: environment.serverUrl + this.savedProjectData['miniImageUrl']};
      this.projectPhotos = photosLinks;

      this.styles = [];
      this.savedProjectData['interiorsInfo'].forEach((elem) => {
        this.styles.push(elem.name);
      });
      this.typesRooms = [];
      this.savedProjectData['roomsInfo'].forEach((elem) => {
        this.typesRooms.push(elem.name);
      });

      this.plans = [];
      this.savedProjectData['plansInfo'].forEach((elem) => {
        this.plans.push(elem.name);
      });

      this.armodels = [];
      this.savedProjectData['arObjectsInfo'].forEach((elem) => {
        this.armodels.push(elem.name);
      });

      this.listPlans = [];
      this.listRooms = [];
      this.listARModels = [];
      this.savedProjectData['arObjects'].forEach((model) => {
        this.listARModels.push({
          name: model.name,
          size: model.size,
          modelId: model.id,
          objectFile: environment.serverUrl + model.url,
          materialFile: environment.serverUrl + model.mtlUrl,
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
                dayTime: time.id === 1 ? 'Day' : 'Night',
                planName: plan.planName,
                imgBase64: environment.serverUrl + time.imageUrl,
                planId: plan.id,
                roomId: room.id,
                imageRoomId: time.imageRoomId
              });
            });
          });
        });
      });
    });
  }

  addNewARModel(arName, arsize) {
    console.log(this.listARModels.length);
    if (!arName || !this.objectFile || !arsize || !this.materialFile) {
      alert('AR model data in invalid, please check it.');
      return;
    }
    if (this.listARModels.length + 1 > this.savedProjectData['arObjectsInfo'].length) {
      alert('You can add only ' + this.savedProjectData['arObjectsInfo'].length +
        ' AR models. You can change count models in common settings!');
      return;
    }

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
      this.managerService.addProjectAr(armodelFormData).then((res) => {
        console.log(res);
        this.getAllNewProjectData();
      }, error => {
        console.log(error);
      });

    this.resetARModelForm();
  }

  showMessageDeleteARModel(id) {
    $('#infoDeleteArmodel').modal('show');
    this.arIdForDeleteOrEdit = id;
  }

  onDeleteArModel() {
    this.managerService.deleteArModel(this.arIdForDeleteOrEdit).then((res) => {
      this.infoMessage = 'AR model was deleted';
      this.getAllNewProjectData();
      alert('AR model was deleted');
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
      alert('Something wrong, please try again.');
    });
    console.log(this.arIdForDeleteOrEdit);
    this.arIdForDeleteOrEdit = null;
    this.getAllNewProjectData();
  }

}
