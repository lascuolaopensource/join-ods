import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from "@angular/core";


@Component({
  selector: 'sos-admin-pic-upload',
  template: `
    <div class="card" [class.is-invalid]="!picture">
      <img class="card-img-top" *ngIf="picture" [src]="picture" />
      <div class="card-body text-center">
        <button type="button" class="btn btn-sm btn-outline-black text-upper-bold mb-1"
                (click)="uploadPic($event)">Cambia</button>
        <button type="button" class="btn btn-sm btn-outline-black text-upper-bold mb-1"
                *ngIf="removable" (click)="removeIt.emit()">Rimuovi</button>
        <input type="file" accept="image/*" (change)="previewFile()" class="d-none" />
      </div>
    </div>
  `
})
export class PicUploadComponent implements AfterViewInit {

  private inputElement: HTMLInputElement;
  private _picture: string;
  @Output() pictureChange: EventEmitter<string> = new EventEmitter();
  @Input() removable: boolean = false;
  @Output() removeIt: EventEmitter<void> = new EventEmitter<void>();

  constructor(private element: ElementRef) {}

  @Input()
  get picture(): string {
    return this._picture;
  }

  set picture(pic: string) {
    this._picture = pic;
    if (pic && pic.startsWith('data'))
      this.pictureChange.emit(pic);
  }

  ngAfterViewInit(): void {
    this.inputElement = this.element.nativeElement.querySelector('input[type=file]') as HTMLInputElement;
  }

  uploadPic(evt: Event): void {
    evt.stopPropagation();
    evt.preventDefault();
    this.inputElement.click();
  }

  previewFile(): void {
    const file = this.inputElement.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      this.picture = reader.result;
    }, false);

    if (file)
      reader.readAsDataURL(file);
  }

}
