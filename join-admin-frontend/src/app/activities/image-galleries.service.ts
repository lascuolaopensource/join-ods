import {Injectable} from "@angular/core";
import {ApiService, AuthService, Environment, Image} from "@sos/sos-ui-shared";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";


@Injectable()
export class ImageGalleriesService extends ApiService {

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public addImage(galleryId: number, image: Image): Observable<Image> {
    return this.http.post(`${this.backendUrl}/image_galleries/${galleryId}/images`, image, this.options)
      .map(response => response.json());
  }

  public updateImage(image: Image): Observable<Image> {
    return this.http.put(`${this.backendUrl}/image_galleries/images/${image.id}`, image, this.options)
      .map(response => response.json());
  }

  public deleteImage(imageId: number): Observable<void> {
    return this.http.delete(`${this.backendUrl}/image_galleries/images/${imageId}`, this.options)
      .map(() => {});
  }

}
