import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {ManagerService} from '../../../../services/manager.service';
import {RedirectService} from '../../../../services/redirect.service';

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


  @Input() projects: any;
  @Output() shipmentSelected: EventEmitter<any> = new EventEmitter();

  testProjectData = [];

  constructor(private el: ElementRef, private fb: FormBuilder, private managerService: ManagerService, private redirectService: RedirectService) {
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
      ],
      columnDefs: [{
        targets: -1,
        data: null,
        defaultContent: '<button>Click!</button>'
      }]
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
    });

    const projectData = this.projectForm.value;
    if (!this.projectForm.value['name'] || !this.projectForm.value['description']
      || !this.projectForm.value['logo'] || !this.projectForm.value['videoUrl']
      || !this.projectForm.value['plan'] || !this.projectForm.value['armodelObj']
      || !this.projectForm.value['armodelMtl'] || !this.projectForm.value['typesRooms']
      || !this.projectForm.value['styles']) {
      this.infoMessage = 'Project data in invalid, please check it.';
      return;
    }

    projectData.miniImageUrl = this.miniImageUrl;
    projectData.planImg = this.plan;
    projectData.armodelObjImg = this.armodelObj;
    projectData.armodelMtlImg = this.armodelMtl;
    projectData.projectPhotos = this.projectPhotos;
    this.managerService.addProjectInfo({
      project: {
        name: projectData.name,
        description: projectData.description, videoUrl: projectData.videoUrl,
        miniImageUrl: projectData.miniImageUrl
      }, error: null
    }).then((result) => {
      this.addProjectPhotos(result, () => {
        this.addProjectPlan(result, projectData.planImg, () => {
          this.addProjectAr(result, projectData.armodelObjImg, projectData.armodelMtlImg);
        });
      });
    }, error => {
      this.infoMessage = 'Something wrong, please try again.';
    });
    this.testProjectData = projectData;
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
    this.isClickOnEditProject = true;
    this.projectForm.patchValue({
      name: this.selectedProject['name'],
      description: this.selectedProject['description'],
      videoUrl: this.selectedProject['videoUrl'],
    });
    localStorage.setItem('projectId', this.selectedProject['id']);
  }

  public onUpdateFiles(result, controlName) {
    this.projectForm.controls['photos'].setValue(this.projectPhotos ? this.projectPhotos.length + ' files' : '');
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
    this.plan = [];
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
      plan: ['', [Validators.required]],
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
      case 'plan':
        this.plan[0] = event.target.files[0];
        this.projectForm.controls['plan'].setValue(this.plan[0] ? this.plan[0].name : '');
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

  public addNewImgRoom(nameRoom, interior, dayTime) {
    this.testProjectData['rooms'] = [];
    if (this.image) {
      const fr = new FileReader();
      fr.onload = () => {
        this.listRooms.push({
          name: nameRoom,
          interior: interior,
          dayTime: dayTime,
          image: this.image,
          imgBase64: fr.result
        });
      };
      fr.readAsDataURL(this.image);
    } else {
      this.listRooms.push({name: nameRoom, interior: interior, dayTime: dayTime, image: this.image, imgBase64: ''});
    }
    this.resetRoomsForm();
  }

  saveSettingsRooms() {
    console.log(this.listRooms);
    alert('Rooms settings was saved');
  }

  resetRoomsForm() {
    this.image = [];
    this.nameRoom = '';
    this.interior = '';
    this.dayTime = 'day';
    alert('Room was added');
  }

  onRoomImgChange(event) {
    this.image = event.target.files[0];
  }

  clearInfoMessage() {
    this.infoMessage = '';
  }

}
