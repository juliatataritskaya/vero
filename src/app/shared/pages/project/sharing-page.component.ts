import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

// TODO: Display current location name
// TODO: Add plan change panel
// TODO: Add default room/plan support (optional, wip)
// TODO: Add room change dialog (optional, wip)

@Component({
  selector: 'app-sharing-page',
  templateUrl: './sharing-page.component.html',
  styleUrls: ['./sharing-page.component.css']
})
export class SharingProjectComponent implements OnInit {

  @ViewChild('sky') sky;

  project: Project;
  ready = false;
  plans: Array<Plan> = [];
  images: Array<Asset> = [];
  points: Array<Point> = [];
  currentPlan: Plan = null;
  currentRoom: Room = null;
  currentInterior: Interior = null;
  currentTime: 0 | 1 = 0;
  menuOpened = false;

  timeSwitchEnabled = false;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private ref: ChangeDetectorRef) {
    this.ref.detach();
    this.aframeInit();
  }

  set currentImage(value) {
    const sky: HTMLElement = this.sky.nativeElement;
    if (!sky) {
      console.warn('Sky element is not ready');
      return;
    }
    sky.setAttribute('src', '#' + value);
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    const project = params.project;
    const user = params.user;


    if (!project || !user) {
      alert('Invalid sharing url.');
      this.router.navigate(['/']);
    }

    this.fetchProject(user, project)
      .then(() => {
        this.onReady();
      })
      .catch((error) => {
        console.error(error);
        alert('Project not found');
        this.router.navigate(['/']);
      });
  }

  onReady() {
    this.ready = true;
    this.ref.detectChanges();

    if (!AFRAME.utils['device']['checkHeadsetConnected']()) {
      document.getElementById('scene').setAttribute('vr-mode-ui', 'enabled: false');
    }

    this.setCurrentPlan(this.plans[0]);
  }

  private toggleMenu() {
    this.menuOpened = !this.menuOpened;
    this.ref.detectChanges();
    console.info('Menu toggled');
  }

  private setCurrentPlan(plan: Plan, room?: Room) {
    this.currentPlan = plan;
    this.addPlanAssets(plan);
    if (!room) {
      this.setCurrentRoom(plan.rooms[0]);
    } else {
      this.setCurrentRoom(room);
    }
  }

  private setCurrentRoom(room: Room) {
    console.info('Switch to', room.name);

    const points: Array<Point> = [];

    // constants
    const scaleCoefficient = 2;


    let id = 0;
    for (const point3D of room.transitionPoints) {
      id++;
      const dist = getDistance(point3D);


      const x = -point3D.positionX / scaleCoefficient;
      const y = (point3D.positionY / scaleCoefficient) + 1.1;
      const z = point3D.positionZ / scaleCoefficient;

      const rotation = radToDeg(Math.atan2((0 - x), (0 - z)));

      points.push({
        id: `point-${id}`,
        text: 'Whoop',
        rotation: rotation,
        position: {
          positionX: x,
          positionY: y,
          positionZ: z,
          roomId: point3D.roomId,
          percentageV: point3D.percentageV,
          percentageH: point3D.percentageH,
          room: point3D.room
        }
      });
    }

    this.setPoints(points);

    this.currentRoom = room;

    this.setCurrentInterior(room.interiors[0]);
  }

  private switchRoom(plan: Plan, roomId: number) {
    const room = plan.rooms.find((v: Room) => {
      return v.id === roomId;
    });

    if (!room) {
      console.error(`Room #${roomId} not found in ${plan.planName}`);
      return;
    }

    console.info(`Switch to room ${room.name} in ${plan.planName}`);

    this.sky.nativeElement.emit('set-image-fade');
    setTimeout(() => {
      this.sky.nativeElement.setAttribute('material', 'color', 'rgba(255,255,255,1)');
      this.setCurrentPlan(plan, room);
    }, 500);

    this.toggleMenu();
  }

  private setCurrentInterior(interior: Interior) {
    console.info('Interior', interior.name, interior.daytimes.length);
    this.timeSwitchEnabled = interior.daytimes.length === 2;
    this.ref.detectChanges();

    this.currentInterior = interior;
    this.switchTime();
  }

  private switchTime(time: 0 | 1 = this.currentTime, ui?: boolean) {
    const daytimes = this.currentInterior.daytimes.length;
    if (daytimes === 0) {
      console.error('No daytimes in interior', this.currentInterior.name);
      return;
    }

    if (ui && !this.timeSwitchEnabled) {
      return;
    }

    if (time === 1 && daytimes === 1) {
      time = 0;
    }

    if (ui) {
      this.sky.nativeElement.emit('set-image-fade');
      setTimeout(() => {
        this.sky.nativeElement.setAttribute('material', 'color', 'rgba(255,255,255,1)');
        this.currentImage = this.currentInterior.daytimes[time].uid;
      }, 500);
    } else {
      this.sky.nativeElement.setAttribute('material', 'color', 'rgba(255,255,255,1)');
      this.currentImage = this.currentInterior.daytimes[time].uid;
    }


    console.info('Time set to', time);
    this.currentTime = time;
    this.ref.detectChanges();
  }

  private setPoints(points: Array<Point>) {
    this.points = points;
    this.ref.detectChanges();
    for (const point of points) {
      const entity = document.getElementById(point.id);
      if (!entity) {
        console.warn('Entity not found', point.id);
        continue;
      }
      const text = document.getElementById(point.id + '-text');
      if (!text) {
        console.warn('Text not found', point.id);
        continue;
      }

      let roomName: string = this.project.typeNames.rooms[point.position.roomId];
      if (!roomName) {
        roomName = 'Untitled Room';
      }

      entity.setAttribute('position', `${point.position.positionX} ${point.position.positionY} ${point.position.positionZ}`);
      entity.setAttribute('rotation', `0 ${point.rotation} 0`);
      entity.setAttribute('change-scene', `on: click; target: #image-360; room: ${point.position.roomId}`);
      text.setAttribute('value', roomName);
    }
  }

  private async fetchProject(userId: string, projectId: string): Promise<void> {
    const data: any = await this.http.get(environment.serverUrl + '/api/getProjectOptimizedAFrame', {
      headers: {
        UserId: userId
      },
      params: {
        id: projectId
      }
    }).toPromise();

    const project: Project = data.projectList[Object.keys(data.projectList)[0]];

    for (const pkey of Object.keys(project.planInfo)) {
      const plan: Plan = project.planInfo[pkey];

      const rooms: Array<Room> = [];
      const roomsMap: Map<number, Room> = new Map<number, Room>();

      for (const rkey of Object.keys(plan.rooms)) {
        const room: Room = plan.rooms[rkey];
        const interiors: Array<Interior> = [];

        for (const ikey of Object.keys(room.interiors)) {
          const interior: Interior = room.interiors[ikey];
          const daytimes: Array<Daytime> = [];

          for (const dkey of Object.keys(interior.daytimes)) {
            const daytime: Daytime = interior.daytimes[dkey];
            daytime.uid = /^.*\/(.*).jpg$/g.exec(daytime.imageUrl)[1];
            daytime.imageUrl = environment.serverUrl + daytime.imageUrl;
            daytimes.push(daytime);
          }

          interior.daytimes = daytimes;
          interiors.push(interior);
        }

        room.id = Number(rkey);
        room.interiors = interiors;
        roomsMap.set(room.id, room);
        rooms.push(room);
      }

      for (const room of rooms) {
        for (const point3D of room.transitionPoints) {
          point3D.room = roomsMap.get(point3D.roomId);
        }
      }

      for (const point3D of plan.transitionPoints) {
        point3D.room = roomsMap.get(point3D.roomId);
      }

      plan.roomsMap = roomsMap;
      plan.rooms = rooms;
      plan.imageUrl = environment.serverUrl + plan.imageUrl;
      this.plans.push(plan);
    }

    if (this.plans.length < 1) {
      alert('Invalid project data.');
      this.router.navigate(['/']);
      return;
    }

    this.project = project;
  }

  private addAsset(image: Asset) {
    const exists = this.images.some(elem => image.uid === elem.uid);
    if (exists) {
      return;
    }

    console.info('Asset added', image.uid);

    this.images.push(image);
  }

  private addPlanAssets(plan: Plan) {
    for (const room of plan.rooms) {
      for (const interior of room.interiors) {
        for (const daytime of interior.daytimes) {
          this.addAsset({
            uid: daytime.uid,
            src: daytime.imageUrl
          });
        }
      }
    }

    this.ref.detectChanges();
  }

  private getRoomById(id: number): Room | null {
    if (!this.currentPlan) {
      return null;
    }
    const room = this.currentPlan.roomsMap.get(id);
    return room ? room : null;
  }

  private aframeInit() {
    const getRoomById = this.getRoomById.bind(this);
    const setCurrentRoom = this.setCurrentRoom.bind(this);

    AFRAME.registerComponent('change-scene', {
      schema: {
        on: {type: 'string'},
        target: {type: 'selector'},
        room: {type: 'number'},
        dur: {type: 'number', default: 300}
      },
      init: function () {
        this.setupFadeAnimation();
        const sky = this.data.target;
        const duration: number = this.data.dur;
        const roomId: number = this.data.room;

        this.el.addEventListener(this.data.on, () => {
          const room: Room | null = getRoomById(roomId);
          if (!room) {
            console.warn('Room not found', roomId);
            return;
          }

          sky.emit('set-image-fade');
          setTimeout(() => {
            sky.setAttribute('material', 'color', 'rgba(255,255,255,1)');
            setCurrentRoom(room);
          }, duration + 100);
        });
      },
      setupFadeAnimation: function () {
        const sky = this.data.target;
        if (sky.dataset.setImageFadeSetup === true) {
          return;
        }

        sky.dataset.setImageFadeSetup = true;
        sky.setAttribute('animation__fade', {
          property: 'material.color',
          startEvents: 'set-image-fade',
          dir: 'alternate',
          dur: this.data.dur,
          from: '#FFF',
          to: '#111'
        });
      }
    });
  }
}

function getDistance(point: Point3D): number {
  const dx = 0 - point.positionX;
  const dy = 0 - point.positionY;
  const dz = 0 - point.positionZ;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function radToDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

interface Project {
  name: string;
  description: string;
  typeNames: {
    plans: { [id: string]: string };
    rooms: { [id: string]: string };
    interiors: { [id: string]: string };
    dayTimes: { [id: string]: string };
    arObjects: { [id: string]: string };
  };
  projectCode: string;
  miniImageUrl: string;
  imageUrls: Array<string>;
  videoUrl: string;
  arObjectsInfo: {
    [id: string]: {
      name: string;
      url: string;
      additionals: Array<string>;
      size: number;
      transitionPoints: Array<Point3D>;
    }
  };
  planInfo: {
    [id: string]: Plan
  };
  defaults: {
    defaultRoomId: number;
    defaultInteriorId: number;
    defaultDaytimeId: number;
    defaultPlanId: number;
  };
}

interface Plan {
  planName: string;
  floorNumber: number;
  imageUrl: string;
  transitionPoints: Array<Point3D>;
  rooms: Array<Room>;
  roomsMap: Map<number, Room>;
}

interface Room {
  id: number;
  name: string;
  transitionPoints: Array<Point3D>;
  interiors: Array<Interior>;
}

interface Interior {
  id: number;
  name: string;
  daytimes: Array<Daytime>;
}

interface Daytime {
  id: number;
  uid: string;
  imageUrl: string;
}

interface Point3D {
  positionX: number;
  positionY: number;
  positionZ: number;
  percentageH: number;
  percentageV: number;
  roomId: number;
  room: Room;
}

interface Point {
  id: string;
  text: string;
  position: Point3D;
  rotation: number;
}

interface Asset {
  uid: string;
  src: string;
}
