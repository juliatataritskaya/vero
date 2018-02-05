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
  plan: any = [];
  armodelObj: any = [];
  armodelMtl: any = [];
  typesRooms = [];
  styles = [];
  listRooms = [];
  listPlans = [];
  plans  = [];
  isClickOnCreateProject: boolean = false;
  isClickOnEditProject: boolean = false;
  private tableWidget: any;
  gameInstance: any;
  selectedProject: object;
  miniImageUrl: string;
  infoMessage: string = '';

  image: any;
  nameRoom: string;
  interior: string;
  dayTime: string = 'day';
  namePlan: string;

  planImg: any;
  planName: string;
  floorNumber: string;


  @Input() projects: any;
  @Output() shipmentSelected: EventEmitter<any> = new EventEmitter();

  savedProjectData = [];

  constructor(private el: ElementRef, private fb: FormBuilder, private managerService: ManagerService,
              private redirectService: RedirectService) {
    super({
      name: '',
      description: '',
      logo: '',
      photos: '',
      videoUrl: '',
      plan: '',
      armodelObj: '',
      armodelMtl: ''
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
      armodelObj: {
        required: 'AR model is required.'
      },
      armodelMtl: {
        required: 'AR model is required.'
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
      console.log( this.projects);
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
      console.log(this.selectedProject);
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
      plansName: this.plans
    });

    const projectData = this.projectForm.value;
    if (!this.projectForm.value['name'] || !this.projectForm.value['description']
      || !this.projectForm.value['logo'] || !this.projectForm.value['videoUrl']
      || !this.projectForm.value['armodelObj'] || !this.projectForm.value['armodelMtl']
      || !this.projectForm.value['typesRooms'] || !this.projectForm.value['styles']
      || !this.projectForm.value['plansName']) {
      this.infoMessage = 'Project data in invalid, please check it.';
      return;
    }

    if (this.styles.length > 3) {
      this.infoMessage = 'Max count interior styles are 3';
      return;
    }

    projectData.miniImageUrl = this.miniImageUrl || this.projectForm.value['logo'];
    projectData.plansName = this.plans;
    projectData.armodelObjImg = this.armodelObj;
    projectData.armodelMtlImg = this.armodelMtl;
    projectData.projectPhotos = this.projectPhotos;

    if (this.isClickOnEditProject) {
      console.log({
        project: {
          name: projectData.name,
          description: projectData.description, videoUrl: projectData.videoUrl,
          miniImageUrl: projectData.miniImageUrl, interiorsInfo: this.styles, roomsInfo: this.typesRooms, plansInfo: this.plans
        }, error: null
      });
      this.onClearForm();
      this.infoMessage = 'Edit save';
      return;
    }
    this.managerService.addProjectInfo({
      project: {
        name: projectData.name,
        description: projectData.description, videoUrl: projectData.videoUrl,
        miniImageUrl: projectData.miniImageUrl, interiorsInfo: this.styles, roomsInfo: this.typesRooms, plansInfo: this.plans
      }, error: null
    }).then((result) => {
      this.savedProjectData = result.project;
      this.addProjectPhotos(result, () => {
        this.addProjectAr(result, projectData.armodelObjImg, projectData.armodelMtlImg);
      });
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
    });
    this.onClearForm();
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

  private addProjectAr(result, arObj, arMtl) {
    const arFormData = new FormData();
    arFormData.append('arObjects', arMtl[0]);
    arFormData.append('arObjects', arObj[0]);
    arFormData.append('projectId', result.project.id);
    this.managerService.addProjectAr(arFormData).then((res) => {
      this.infoMessage = 'Common settings were saved';
      this.getAllProjects(() => {
        this.loadProjects();
      });
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
    });
  }

  public onEditProject() {
    localStorage.setItem('projectId', this.selectedProject['id']);
    this.isClickOnEditProject = true;

    const photosLinks = this.selectedProject['imageUrls'].map(photo =>
      environment.serverUrl + photo);
    this.logo[0] = { name : environment.serverUrl + this.selectedProject['miniImageUrl']};
    this.armodelMtl[0] = { name : environment.serverUrl + this.selectedProject['arObjectInfo'].mtlUrl};
    this.armodelObj[0] = { name : environment.serverUrl + this.selectedProject['arObjectInfo'].url};
    this.projectPhotos = photosLinks;
    console.log(this.armodelMtl[0]);

    this.styles = [];
    this.selectedProject['interiorsInfo'].forEach((elem) => {
      this.styles.push(elem.name);
    });
    this.typesRooms = [];
    this.selectedProject['roomsInfo'].forEach((elem) => {
      this.typesRooms.push(elem.name);
    });

    this.plans = [];
    this.selectedProject['plansInfo'].forEach((elem) => {
      this.plans.push(elem.name);
    });

    this.listPlans = [];
    this.listRooms = [];
    this.selectedProject['plans'].forEach((plan) => {
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
              imgBase64: environment.serverUrl + time.imageUrl
            });
          });
        });
      });
    });

    this.projectForm.patchValue({
      name: this.selectedProject['name'],
      logo: this.selectedProject['miniImageUrl'],
      description: this.selectedProject['description'],
      videoUrl: this.selectedProject['videoUrl'],
      plansName: this.plans,
      miniImageUrl: this.selectedProject['miniImageUrl'],
      armodelObj: this.selectedProject['arObjectInfo'].url,
      armodelMtl: this.selectedProject['arObjectInfo'].mtlUrl,
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
    this.projectForm.controls['photos'].setValue(this.projectPhotos ? this.projectPhotos.length + result.target.files.length + ' files' : '');
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
    this.logo = [];
    this.plans = [];
    this.armodelObj = [];
    this.armodelMtl = [];
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
      armodelObj: ['', [Validators.required]],
      armodelMtl: ['', [Validators.required]],
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
      case 'armodel-obj':
        this.armodelObj[0] = event.target.files[0];
        this.projectForm.controls['armodelObj'].setValue(this.armodelObj[0] ? this.armodelObj[0].name : '');
        break;
      case 'armodel-mtl':
        this.armodelMtl[0] = event.target.files[0];
        this.projectForm.controls['armodelMtl'].setValue(this.armodelMtl[0] ? this.armodelMtl[0].name : '');
        break;
      default:
        break;
    }
  }

  public deleteProjectPhoto(event) {
    this.projectPhotos.splice(this.projectPhotos.indexOf(event.target.src), 1);
    this.projectPhotosFiles.slice(this.projectPhotos.indexOf(event.target.src), 1);
  }

  public openEditor() {
    const newWin = window.open('../../../../../assets/js/plugins/unity/index.html', '', 'width=600,height=400');
    localStorage.setItem('projectId', '1');
  }

  public addNewImgRoom(nameRoomId, interiorId, dayTime, namePlanId) {
    console.log(nameRoomId, interiorId, dayTime, namePlanId)
    if (!nameRoomId || !interiorId || !dayTime || !this.image) {
      this.infoMessage = 'Plans data in invalid, please check it.';
      $('#infoBox').modal('show');
      return;
    }
    const foundStyleName = this.savedProjectData['interiorsInfo'].find(function(element) {
      return element.id = interiorId;
    });

    const foundRoomName = this.savedProjectData['roomsInfo'].find(function(element) {
      return element.id = nameRoomId;
    });

    const foundPlanName = this.savedProjectData['plansInfo'].find(function(element) {
      return element.id = namePlanId;
    });

    if (this.image) {
      const fr = new FileReader();
      fr.onload = () => {
        this.listRooms.push({
          name: foundRoomName.name,
          interior: foundStyleName.name,
          dayTime: dayTime,
          image: this.image,
          imgBase64: fr.result,
          planName: foundPlanName.planName
        });
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
        }, error => {
          console.log(error);
        });
      };
      fr.readAsDataURL(this.image);
    } else {
      $('#infoBox').modal('show');
      this.infoMessage = 'Image is mandatory!';
      return;
    }
    this.resetRoomsForm();
  }


  public addNewImgPlan(namePlanId, floorNumber) {
    if (!namePlanId || !this.planImg || !floorNumber) {
      alert('Plans data in invalid, please check it.');
      return;
    }

    if (this.listPlans.length === this.savedProjectData['plansInfo'].length) {
      alert('You can add only ' + this.savedProjectData['plansInfo'].length + ' plans. You can change count plans in common settings!');
      return;
    }

    const foundPlanName = this.savedProjectData['plansInfo'].find(function(element) {
      return element.id = namePlanId;
    });

    if (this.planImg) {
      const fr = new FileReader();
      fr.onload = () => {
        this.listPlans.push({
          planName: foundPlanName.planName,
          planImg: this.planImg,
          imgBase64: fr.result,
          floorNumber: floorNumber
        });
        const planFormData = new FormData();
        planFormData.append('plans', this.planImg);
        planFormData.append('planInfoId', namePlanId);
        planFormData.append('floorNumber', floorNumber);
        planFormData.append('projectId', localStorage.getItem('projectId'));
        this.managerService.addProjectPlan(planFormData).then((res) => {
          console.log(res);
        }, error => {
          console.log(error);
        });
      };
      fr.readAsDataURL(this.planImg);
    } else {
      $('#infoBox').modal('show');
      this.infoMessage = 'Image is mandatory!';
      return;
    }
    this.resetPlansForm();
  }

  saveSettingsRooms() {
    // this.listRooms = [];
    alert('Rooms settings was saved');
  }

  saveSettingsPlan() {
    // this.listPlans = [];
    alert('Plans settings was saved');
  }

  resetRoomsForm() {
    this.image = [];
    this.nameRoom = '';
    this.interior = '';
    this.planName = '';
    this.dayTime = 'day';
    alert('Room was added');
  }

  resetPlansForm() {
    this.planImg = [];
    this.planName = '';
    this.floorNumber = '';
    alert('Plan was added');
  }

  onRoomImgChange(event) {
    this.image = event.target.files[0];
  }

  onPlanImgChange(event) {
    this.planImg = event.target.files[0];
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

  onDeletePlan(id) {
    console.log(id);
  }

  onEditPlan(id) {
    console.log(id);

    $('#planImg').modal('show');
  }

}
