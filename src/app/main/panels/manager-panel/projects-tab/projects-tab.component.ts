import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {ManagerService} from '../../../../services/manager.service';

@Component({
  selector: 'app-projects-tab',
  templateUrl: './projects-tab.component.html',
  styleUrls: ['./projects-tab.component.css']
})
export class ProjectsTabComponent extends ReactiveFormsBaseClass implements OnInit {
  private projectsTable: any;
  projectForm: FormGroup;
  projectPhotos: any = [];
  projectPhotosFiles: any = [];
  photos360: any = [];
  photos360Files: any = [];
  logo: any = [];
  plan: any = [];
  armodel: any = [];
  isClickOnCreateProject: boolean = false;
  private tableWidget: any;
  @Input() projects: any;
  @Output() shipmentSelected: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef, private fb: FormBuilder, private managerService: ManagerService) {
    super({
      name: '',
      description: '',
      logo: '',
      photos: [],
      youtube: '',
      plan: '',
      armodel: '',
      photos360: []
    }, {
      name: {
        required: 'Email is required.',
        minlength: 'Email must contain at least 5 symbols.',
      },
      description: {
        required: 'Password is required.',
        minlength: 'Password must contain at least 10 symbols.'
      },
      logo: {
        required: 'Email is required.'
      },
      photos: {
        required: 'Email is required.'
      },
      youtube: {
        required: 'Email is required.'
      },
      plan: {
        required: 'Email is required.'
      },
      armodel: {
        required: 'Email is required.'
      },
      photos360: {
        required: 'Email is required.'
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
      callback();
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
        { title: 'Project description', data: 'description' }
      ]
    };
    this.projectsTable = $(this.el.nativeElement.querySelector('table'));
    this.tableWidget = this.projectsTable.DataTable(tableOptions);
    this.tableWidget.on('select', (e, dt, type, indexes) => {
      this.shipmentSelected.emit(this.projects[indexes[0]]);
    });
  }

  public onSaveHandler(): void {
    this.isClickOnCreateProject = false;
    // if (!this.loginForm.valid) {
    //   this.showError('Login data in invalid, please check it.');
    //   return;
    // }
    const projectData = this.projectForm.value;
    this.managerService.createProject(projectData).then((result) => {
      alert(result);
    }, error => {
      alert('Something wrong, please try again.');
    });
  }

  public onUpdateFiles(result, controlName) {
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

  public onUpdate360Files(result) {
    const tgt = result.target || window.event.srcElement,
      files = tgt.files;
    const filesArr = Array.prototype.slice.call(files);
    if (FileReader && files && files.length) {
      filesArr.forEach((i) => {
        this.photos360Files.push(i);
        const fr = new FileReader();
        fr.onload = () => {
          this.photos360.push(fr.result);
        };
        fr.readAsDataURL(i);
      });
    }
  }

  private createProjectForm (): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      logo: [this.logo, [Validators.required]],
      photos: [this.projectPhotosFiles, [Validators.required]],
      youtube: ['', [Validators.required]],
      plan: [this.plan, [Validators.required]],
      armodel: [this.armodel, [Validators.required]],
      photos360: [this.photos360Files, [Validators.required]]
    });

    this.projectForm.valueChanges.subscribe(data => this.onValueChanged(this.projectForm, data));

    this.onValueChanged(this.projectForm);
  }

  public onFileChange(event, controlName) {
    switch (controlName) {
      case 'logo':
        this.logo[0] = event.target.files[0];
        break;
      case 'plan':
        this.plan[0] = event.target.files[0];
        break;
      case 'armodel':
        this.armodel[0] = event.target.files[0];
        break;
      default:
        break;
    }
  }

  public deleteProjectPhoto(event) {
    this.projectPhotos.splice(this.projectPhotos.indexOf(event.target.src), 1);
  }

  public deletePhoto360(event) {
    this.photos360.splice(this.photos360.indexOf(event.target.src), 1);
  }
}
