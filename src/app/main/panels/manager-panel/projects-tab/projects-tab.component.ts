import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {ManagerService} from '../../../../services/manager.service';
declare var UnityLoader: any;
declare var UnityProgress: any;

@Component({
  selector: 'app-projects-tab',
  templateUrl: './projects-tab.component.html',
  styleUrls: ['./projects-tab.component.css', './nav-tabs.style.css']
})
export class ProjectsTabComponent extends ReactiveFormsBaseClass implements OnInit {
  private projectsTable: any;
  projectForm: FormGroup;
  roomForm: FormGroup;
  projectPhotos: any = [];
  projectPhotosFiles: any = [];
  photos360: any = [];
  photos360Files: any = [];
  logo: any  = [];
  plan: any = [];
  armodel: any = [];
  typesRooms = [];
  styles = [];
  listRooms = [];
  isClickOnCreateProject: boolean = false;
  private tableWidget: any;
  gameInstance: any;
  selectedProject: object;

  image: any;
  nameRoom: string;
  interior: string;
  dayTime: string = 'day';


  @Input() projects: any;
  @Output() shipmentSelected: EventEmitter<any> = new EventEmitter();

  testProjectData = [];

  constructor(private el: ElementRef, private fb: FormBuilder, private managerService: ManagerService) {
    super({
      name: '',
      description: '',
      miniImageUrl: '',
      photos: '',
      videoUrl: '',
      plan: '',
      armodel: ''
    }, {
      name: {
        required: 'Name is required.'
      },
      description: {
        required: 'Description is required.'
      },
      miniImageUrl: {
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
      armodel: {
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

  ngOnInit () {
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
      console.log(error);
    });
  }

  public loadProjects(): void {
    if (this.tableWidget) {
      this.tableWidget.destroy();
    }
    const tableOptions: any = {
      data: this.projects,
      responsive: true,
      lengthMenu: [ 5, 10, 15 ],
      select: true,
      paging: true,
      columns: [
        { title: 'Project name', data: 'name' },
        { title: 'Project description', data: 'description' },
        { title: 'Users', data: 'listUsers' },
        { title: 'Project code', data: 'projectCode' }
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
    this.projectForm.patchValue({
      styles: this.styles,
      typesRooms: this.typesRooms,
    });

    const projectData = this.projectForm.value;
    if (!this.projectForm.value['name'] || !this.projectForm.value['description']
      || !this.projectForm.value['miniImageUrl'] || !this.projectForm.value['videoUrl']
      || !this.projectForm.value['plan'] || !this.projectForm.value['armodel']
      || !this.projectForm.value['typesRooms'] || !this.projectForm.value['styles']) {
      alert('Project data in invalid, please check it.');
      return;
    }
    projectData.logoImg = this.logo[0];
    projectData.planImg = this.plan;
    projectData.armodelImg = this.armodel;
    // this.managerService.createProject(projectData).then((result) => {
    //   alert(result);
    // }, error => {
    //   alert('Something wrong, please try again.');
    // });
    this.testProjectData = projectData;
    alert('Common project\'s settings was saved');
    this.onClearForm();
  }

  public onEditProject() {
    const newWin = window.open('../../../../../assets/js/plugins/unity/index.html', '',
      'width=600,height=400');
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
    this.logo  = [];
    this.plan  = [];
    this.armodel = [];
    this.typesRooms = [];
    this.styles = [];
  }

  private createProjectForm (): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      miniImageUrl: ['', [Validators.required]],
      photos: ['', [Validators.required]],
      videoUrl: ['', [Validators.required]],
      plan: ['', [Validators.required]],
      armodel: ['', [Validators.required]],
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
        this.projectForm.controls['miniImageUrl'].setValue(this.logo[0] ? this.logo[0].name : '');
        break;
      case 'plan':
        this.plan[0] = event.target.files[0];
        this.projectForm.controls['plan'].setValue(this.plan[0] ? this.plan[0].name : '');
        break;
      case 'armodel':
        this.armodel[0] = event.target.files[0];
        this.projectForm.controls['armodel'].setValue(this.armodel[0] ? this.armodel[0].name : '');
        break;
      default:
        break;
    }
  }

  public deleteProjectPhoto(event) {
    this.projectPhotos.splice(this.projectPhotos.indexOf(event.target.src), 1);
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
        this.listRooms.push({name: nameRoom, interior: interior, dayTime: dayTime, image: this.image, imgBase64: fr.result});
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

  resetRoomsForm(){
    this.image = [];
    this.nameRoom = '';
    this.interior = '';
    this.dayTime = 'day';
    alert('Room was added');
  }
  onRoomImgChange(event) {
   this.image = event.target.files[0];
  }

}
