import {Activity, dateWithoutTimestamp, EnumHelpersService, Image, ModalsService} from "@sos/sos-ui-shared";
import {ActivatedRoute, Router} from "@angular/router";
import {ImageGalleriesService} from "../image-galleries.service";
import {EventEmitter, OnInit} from "@angular/core";
import {LanguageService} from "../../language.service";
import {first, takeWhile} from "rxjs/operators";
import {identity} from "rxjs/util/identity";


export abstract class ActivityEditComponent implements OnInit {

  public activity: Activity;
  public editing: boolean;
  public selectedLanguage: string;
  public supportedLanguages: string[] = ['it', 'en'];
  public enums = EnumHelpersService;

  public deadlineString: string;

  public sendingModel: boolean = false;

  public submitTxt: string;

  // this object keeps track of whether we have stored the activity for a certain language to avoid refreshing with the
  // lang parameter set to a non stored activity for that lang, leading to a 404 in the resolver
  protected createdForLang: { [key: string]: boolean } = {};

  protected constructor(protected route: ActivatedRoute,
                        protected router: Router,
                        protected imageGalleriesService: ImageGalleriesService,
                        protected languageService: LanguageService,
                        protected modalsService: ModalsService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(paramMap => {
      this.selectedLanguage = paramMap.has('lang') ? paramMap.get('lang') : this.languageService.language;
      this.updateActivityForLang(this.selectedLanguage);
    });
  }

  protected abstract updateActivityForLang(lang: string): void

  languageChanged(newLang: string) {
    if (this.createdForLang[newLang]) {
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate([], { relativeTo: this.route, queryParams: { lang: newLang } });
    } else {
      this.updateActivityForLang(newLang);
    }
  }

  coverPicChanged(pic: string) {
    this.activity.coverPic.data = pic;
  }

  addNewImage() {
    this.activity.gallery.images.push({ id: 0 } as Image);
  }

  // noinspection JSMethodCanBeStatic
  imageGalleryChanged(image: Image, pic: string) {
    image.data = pic;
  }

  removeImage(imageIdx: number) {
    const imageId = this.activity.gallery.images[imageIdx].id;

    const removeIt = () => {
      this.activity.gallery.images.splice(imageIdx, 1);
    };

    if (imageId === 0) {
      removeIt();
    } else {
      this.imageGalleriesService.deleteImage(imageId).subscribe(() => {
        removeIt();
      });
    }
  }

  setDeadlineDate() {
    this.activity.deadline = new Date(this.deadlineString);
  }

  protected fixDatesForForm() {
    if (this.activity.deadline) {
      // remove timezone and recreate date object from the new ISO date string
      this.deadlineString = dateWithoutTimestamp(this.activity.deadline);
      this.activity.deadline = new Date(this.deadlineString);
    }
  }

  protected saveGalleryImages(images: Image[], galleryId: number) {
    let imagesToSend = 0;
    const decCountAndCheck = () => {
      imagesToSend--;
      if (imagesToSend <= 0)
        this.sendingModel = false;
    };
    images.forEach(image => {
      // if needs update, do it
      if (image.id !== 0 && image.data) {
        imagesToSend++;
        this.imageGalleriesService.updateImage(image).subscribe(updatedImage => {
          this.activity.gallery.images.push(updatedImage);
          decCountAndCheck();
        }, () => {
          decCountAndCheck();
        });
        return;
      }

      // doesn't need update, keep it as is
      if (image.id !== 0 && !image.data) {
        this.activity.gallery.images.push(image);
        return;
      }

      // skip other for safety (those should never happen atm)
      if (image['delete'] || image.url || !image.data || !image.data.startsWith('data'))
        return;

      // finally add the new image
      imagesToSend++;
      this.imageGalleriesService.addImage(galleryId, image).subscribe(addedImage => {
        this.activity.gallery.images.push(addedImage);
        decCountAndCheck()
      }, () => {
        decCountAndCheck();
      })
    });

    if (!this.editing) {
      this.editing = true;
      this.submitTxt = 'Aggiorna';
    }
    this.createdForLang[this.activity.language] = true;
    if (imagesToSend <= 0)
      this.sendingModel = false;
  }

  abstract get hasInvalidData(): boolean

  saveActivity(evt: Event) {
    evt.preventDefault();

    if (this.sendingModel)
      return;

    if (this.hasInvalidData)
      return;

    this.askConfirmationAndSave();
  }

  private askConfirmationAndSave(): void {
    const emitter = new EventEmitter<boolean>();
    emitter.pipe(
      first(), takeWhile(identity)
    ).subscribe(() => {
      this.actuallySaveActivity();
    });

    this.modalsService.show({
      emitter,
      title: 'Attenzione!',
      content: `
        <p>Una volta inviata, questa attività sarà visibile a tutti.</p>
        <p class="bigger">Hai riletto ciò che hai scritto?</p>
      `,
      close: 'ANNULLA',
      accept: 'CONFERMA'
    });
  }

  protected abstract actuallySaveActivity(): void

}
