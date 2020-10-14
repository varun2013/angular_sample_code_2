import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { environment } from '../../environments/environment';
import { HeaderService } from './headers.service';
import { AuthClient } from './auth-client.service';
import { AdminArtistClientService } from './admin-artist-client.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AdminArtistService {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private authClient: AuthClient,
    private adminArtistClientService: AdminArtistClientService
  ) { }

  /*
  *  function is used for getting Artist list with filter options
  */
  getAdminArtist(body, sortBy, orderBy): any {
    let url = environment.apiUrl + 'admin/artists?page_no=' + body.page_no + '&page_limit=' + body.page_limit + '&sortBy=' + sortBy + '&orderBy=' + orderBy;
    let headers = this.headerService.createRawAuthorizationHeader();

    return this.adminArtistClientService.get_artist_data(url, body, headers)
      .map((response: any) => {
        let adminArtistResponse = response;
        return adminArtistResponse.data;
      })
  }
  /*
  *  function is used to merge the Artist which are duplicate
  */
  mergeAdminArtist(body): any {
    let url = environment.apiUrl + 'admin/artists/merge/' + body.source_aid + '/' + body.dest_aid;
    let headers = this.headerService.createRawAuthorizationHeader();

    return this.adminArtistClientService.merge_artist_data(url, headers)
      .map((response: any) => {

        let adminArtistResponse = response;
        return adminArtistResponse.data;
      })
  }
  /*
  *  function is used to merge all artist reviews
  */
  mergeAdminArtistReviews(source_aid, dest_aid, body): any {
    let url = environment.apiUrl + 'admin/artists/merge/' + source_aid + '/' + dest_aid;
    let headers = this.headerService.createRawAuthorizationHeader();

    return this.adminArtistClientService.merge_artist_reviews_data(url, body, headers)
      .map((response: any) => {

        let adminArtistResponse = response;
        return adminArtistResponse.data;
      })
  }
  /*
  *  function is used to change the artist status
  */
  changeArtistStatus(body): any {
    let url = environment.apiUrl + 'admin/artist/status';
    let headers = this.headerService.createRawAuthorizationHeader();
    return this.adminArtistClientService.change_artist_status(url, body, headers)
      .map((response: any) => {
        let adminArtistResponse = response;
        return adminArtistResponse.data;
      })
  }
  /*
   *  function is used to change the artist Genere
  */
  changeArtistGenre(body): any {
    let url = environment.apiUrl + 'admin/artists/genre';
    let headers = this.headerService.createRawAuthorizationHeader();
    return this.adminArtistClientService.change_artist_genre(url, body, headers)
      .map((response: any) => {
        let adminArtistResponse = response;
        return adminArtistResponse.data;
      })
  }
  /*
   *  function is used to set the Artist review status
  */
  changeArtistReviewedStatus(body): any {
    let type = "artist";
    let url = environment.apiUrl + 'admin/reviewed/' + type;
    let headers = this.headerService.createRawAuthorizationHeader();
    return this.adminArtistClientService.change_artist_reviewed_status(url, body, headers)
      .map((response: any) => {
        let adminArtistResponse = response;
        return adminArtistResponse.data;
      })
  }
  /*
  *  Mark artist non duplicate
 */
  changeArtistMarkNonDuplicateStatus(body): any {
    let url = environment.apiUrl + 'admin/artist/non-duplicate';
    let headers = this.headerService.createRawAuthorizationHeader();
    return this.adminArtistClientService.change_artist_markNonDuplicate_status(url, body, headers)
      .map((response: any) => {
        let adminArtistResponse = response;
        return adminArtistResponse.data;
      })
  }
  /*
  *  function is used to delete Artist
 */
  deleteAdminArtist(body): any {
    let url = environment.apiUrl + 'admin/artist/status';
    let headers = this.headerService.createRawAuthorizationHeader();
    return this.adminArtistClientService.delete_artist_data(url, body, headers)
      .map((response: any) => {
        let adminArtistResponse = response;
        return adminArtistResponse.data;
      })
  }
  /*
  *  function is used to remove an artist from a event
 */
  removeAdminArtist(body): any {
    let url = environment.apiUrl + 'admin/artist/remove?artistId=' + body.artistId + '&eventId=' + body.eventId;
    let headers = this.headerService.createRawAuthorizationHeader();
    return this.adminArtistClientService.remove_artist_data(url, headers)
      .map((response: any) => {
        let adminArtistResponse = response;
        return adminArtistResponse.data;
      })
  }
  /*
  *  function is used to merge multiple artist in one go
 */
  mergeMultilpleArtist(body): any {
    let url = environment.apiUrl + 'admin/merge-multilple-artist';
    let headers = this.headerService.createRawAuthorizationHeader();
    return this.adminArtistClientService.get_artist_data(url, body, headers)
      .map((response: any) => {
        let adminVenueResponse = response;
        return adminVenueResponse.data;
      })
  }
}
