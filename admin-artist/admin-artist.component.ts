import { Component, OnInit } from '@angular/core';
import {
  DropdownModule, SelectItem, CheckboxModule, ButtonModule, PaginatorModule,
  DataTableModule, SharedModule, ConfirmDialogModule, ConfirmationService
} from 'primeng/primeng';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminArtistService } from '../../services/admin-artist.service';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../services/common.service';
import * as _ from "lodash";

@Component({
  selector: 'app-admin-artist',
  templateUrl: './admin-artist.component.html',
  styleUrls: ['./admin-artist.component.sass'],
  providers: [AdminArtistService]
})
export class AdminArtistComponent implements OnInit {

  Id: SelectItem[];
  status: SelectItem[];
  statusOptions: SelectItem[];
  creators: SelectItem[];
  genre: SelectItem[];
  entries_dropdown: SelectItem[];
  selectedEntry = "100";
  isReviewed: boolean = false;
  isMarkedNonDuplicate: boolean = false;
  isArtistGenreUpdate: boolean = false;
  isResult: boolean = false;
  isSearchData: boolean = true;
  isDialogClose: boolean = true;
  isDeleteOption: boolean = true;
  isStatusChanged: boolean = false;
  isMerged: boolean = false;
  search1: any = {};
  opt: string[] = ['true', 'flase'];
  checked: boolean = false;
  opt_exact_match: boolean = false
  opt_has_img: boolean = false
  opt_has_rev: boolean = false
  opt_user_edited: boolean = false
  ID_type: any[];
  filtered_artist: any = [];
  adminArtists: any = [];
  page_no: number = 2;
  page: any;
  table_status: string = ''
  artistStatus: any = {}
  loading: boolean = false;
  categoriesList = [];
  checkedArtistId = [];
  sortBy: any = 'name';
  orderBy: any = 'asc';
  alertType = "";
  resMsg ="";
  selectedSourceArtistsId: string[] = [];
  providerList = [];
  userId: string = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private adminArtistService: AdminArtistService,
    private confirmationService: ConfirmationService,
    private actRoute: ActivatedRoute,
    private commonService: CommonService
  ) {


    this.entries_dropdown = [];
    this.entries_dropdown.push({ label: '10', value: 10 });
    this.entries_dropdown.push({ label: '50', value: 50 });
    this.entries_dropdown.push({ label: '100', value: 100 });
    this.entries_dropdown.push({ label: '250', value: 250 });

    this.Id = [];
    this.Id.push({ label: 'Select ID type', value: null });
    this.Id.push({ label: 'Equals To', value: { id: 1, name: 'Equal_To', code: 'EQ' } });
    this.Id.push({ label: 'Not Equal To', value: { id: 4, name: 'Not_Equal_To', code: 'NET' } });
    this.Id.push({ label: 'COMMA SEPERATED', value: { id: 5, name: 'COMMA_SEPERATED', code: 'CS' } });

    this.status = [];
    this.status.push({ label: 'Select status type', value: null });
    this.status.push({ label: 'Enabled/Flagged', value: { id: 3, name: 'Enabled-Flagged', code: 'Enabled_or_Flagged' } });
    this.status.push({ label: 'Disabled', value: { id: 2, name: 'Disabled', code: 'Disabled' } });
    this.status.push({ label: 'Enabled', value: { id: 1, name: 'Enabled', code: 'Enabled' } });
    this.status.push({ label: 'Deleted', value: { id: 0, name: 'Deleted', code: 'Deleted' } });
    this.status.push({ label: 'Flagged', value: { id: 4, name: 'Flagged', code: 'Flagged' } });
    this.status.push({ label: 'All', value: { id: 5, name: 'All', code: 'All' } });

    this.statusOptions = [];
    this.statusOptions.push({ label: 'Select status type', value: null });
    this.statusOptions.push({ label: 'Disabled', value: { id: 2, name: 'Disabled', code: 'Disabled' } });
    this.statusOptions.push({ label: 'Enabled', value: { id: 1, name: 'Enabled', code: 'Enabled' } });
    this.statusOptions.push({ label: 'Deleted', value: { id: 0, name: 'Deleted', code: 'Deleted' } });
    this.statusOptions.push({ label: 'Reviewed', value: { id: 4, name: 'Reviewed', code: 'Reviewed' } });
    this.statusOptions.push({ label: 'MarkNonDuplicate', value: { id: 5, name: 'MarkNonDuplicate', code: 'MarkNonDuplicate' } });
    this.statusOptions.push({ label: 'Merge', value: { id: 6, name: 'Merge', code: 'Merge' } });

    this.creators = [];
    this.creators.push({ label: 'Select creators type', value: null });
    this.creators.push({ label: 'All', value: { id: 1, name: 'All', code: 'All' } });
    this.creators.push({ label: 'Admin', value: { id: 2, name: 'Admin', code: 'Admin' } });
    this.creators.push({ label: 'User', value: { id: 3, name: 'User', code: 'User' } });
    this.creators.push({ label: 'Import', value: { id: 4, name: 'Import', code: 'Import' } });

    this.genre = [];
    this.genre.push({ label: 'Select genre type', value: null });

    this.artistStatus = { 0: 'DEL', 1: 'ENBLD', 2: 'DISABL', 3: 'BAND', 4: 'DEL', 5: 'PEND' };

    this.getCategories();
    this.getImport_providers()
  }

  ngOnInit() {
    this.actRoute.queryParams.subscribe(params => {
      if (params['merged'] == "true") {
        this.isMerged = true;
        let self = this;
        setTimeout(function () {
          self.isMerged = false;
        }, 5000);
      };
    })
  }

  paginate(data) {
    this.isResult = true;
    let self = this;
    this.loading = true;
    let page_limit = this.selectedEntry;
    let request_body = {
      "match_artist_id":  this.search1.label ? this.search1.label.name.toLowerCase() : "",
      "artist_id": this.search1.id ? this.search1.id.split(","):"",
      "status": this.search1.status ? this.search1.status.name.toLowerCase() : "enabled",
      "created_by": this.search1.creator_type ? this.search1.creator_type.name.toLowerCase() : "",
      "genre_id": this.search1.genre ? this.search1.genre.id: "",
      "artist_name": this.search1.artistname,
      "creator_id": this.search1.username,
      "exact_match": this.search1.opt_exact_match,
      "has_images": this.search1.opt_has_img,
      "has_reviews": this.search1.opt_has_rev,
      "has_user_edited": this.search1.opt_user_edited,
      "page_limit": page_limit || 100,
      "page_no": data.page + 1
    }
    for (var propName in request_body) {
      if (request_body[propName] === null || request_body[propName] === undefined || request_body[propName] === "") {
        delete request_body[propName];
      }
    }
    this.adminArtists.page_no = data.page + 1;

    this.adminArtistService.getAdminArtist(request_body,this.sortBy,this.orderBy)
      .subscribe((artists) => {
        this.adminArtists = artists;
          this.loading = false;
      },
      (err) => {
          this.loading = false;
      })
  }

  /*
  * getting all categories Data
  */
  getCategories() {
    this.commonService.getCategories().subscribe((categories) => {
      let categoryList = categories;
      this.categoriesList = [];
      categoryList.forEach((category) => {
        if (category.children && category.children.length) {
          this.categoriesList.push(category);
          this.genre.push({ 'label': category.name, 'value': { 'id': category._id, 'parent_id':'', 'name': category.name, 'code': category.name } });
          category.children.forEach((childcategory) => {
            this.categoriesList.push(childcategory);
            this.genre.push({ 'label': childcategory.name, 'value': { 'id': childcategory._id, 'parent_id':childcategory.parent_id, 'name': childcategory.name, 'code': childcategory.name } });
          })
        } else {
          this.categoriesList.push(category);
          this.genre.push({ 'label': category.name, 'value': { 'id': category._id, 'parent_id':'', 'name': category.name, 'code': category.name } });
        }
      });
    })
  }


  getData(sortBy,orderBy){
    this.selectedSourceArtistsId = [];
    this.loading = true;
    let page_limit = this.selectedEntry;
    let page_no = 1;
    let request_body = {
      "match_artist_id":  this.search1.label ? this.search1.label.name.toLowerCase() : "",
      "artist_id": this.search1.id ? this.search1.id.split(","):"",
      "status": this.search1.status ? this.search1.status.name.toLowerCase() : "enabled",
      "created_by": this.search1.creator_type ? this.search1.creator_type.name.toLowerCase() : "",
      "genre_id": this.search1.genre ? this.search1.genre.id: "",
      "artist_name": this.search1.artistname,
      "creator_id": this.search1.username,
      "exact_match": this.search1.opt_exact_match,
      "has_images": this.search1.opt_has_img,
      "has_reviews": this.search1.opt_has_rev,
      "has_user_edited": this.search1.opt_user_edited,
      "page_limit": page_limit || 100,
      "page_no": page_no || 1
    }
    for (var propName in request_body) {
      if (request_body[propName] === null || request_body[propName] === undefined || request_body[propName] === "") {
        delete request_body[propName];
      }
    }
    this.adminArtists.page_no = this.page_no
    this.adminArtistService.getAdminArtist(request_body,this.sortBy,this.orderBy)
      .subscribe((artists) => {
        this.loading = false;
        this.adminArtists = artists;
      }, (err) => {
        this.loading = false;
      })
  }
  filter() {
    this.isResult = true;
    this.isSearchData = false;
    this.loading = true;
    let self = this;
    let page_limit = this.selectedEntry;
    let request_body = {
      "match_artist_id":  this.search1.label ? this.search1.label.name.toLowerCase() : "",
      "artist_id": this.search1.id ? this.search1.id.split(","):"",
      "status": this.search1.status ? this.search1.status.name.toLowerCase() : "enabled",
      "created_by": this.search1.creator_type ? this.search1.creator_type.name.toLowerCase() : "",
      "genre_id": this.search1.genre ? this.search1.genre.id: "",
      "artist_name": this.search1.artistname,
      "creator_id": this.search1.username || this.userId,
      "exact_match": this.search1.opt_exact_match,
      "has_images": this.search1.opt_has_img,
      "has_reviews": this.search1.opt_has_rev,
      "has_user_edited": this.search1.opt_user_edited,
      "page_limit": this.selectedEntry || 100,
      "page_no": this.search1.page_input || 1
    }
    for (var propName in request_body) {
      if (request_body[propName] === null || request_body[propName] === undefined || request_body[propName] === "") {
        delete request_body[propName];
      }
    }
    this.adminArtists.page_no = this.page_no
    this.adminArtistService.getAdminArtist(request_body,this.sortBy,this.orderBy)
      .subscribe((artists) => {
        this.loading = false;
        this.adminArtists = artists;
      }, (err) => {
        this.loading = false;
      })
  }

  moreFilter() { this.isSearchData = !this.isSearchData; }

  sortColumn(event) {
    let orderBy;
    if(event.order == 1) {
      orderBy = 'desc';
    } else {
      orderBy = 'asc';
    }
    this.sortBy = event.field;
    this.orderBy = orderBy;
 
    this.getData(event.field, orderBy);
  }

  getCheckedArtistIds() {
    let checkedArtistIds: Array<any> = [];
    _.forEach(this.checkedArtistId, function( checkedArtist ) {
      checkedArtistIds.push(checkedArtist._id);
    });
    return checkedArtistIds; // This will retuen Array of ArtistIds
   }

  //code for change genre of artists
  changeGenre(selectedGenre) {
    this.loading = true;
    let body = {
      genreId: selectedGenre.id,
      artistIds: this.getCheckedArtistIds()
    }
    this.adminArtistService.changeArtistGenre(body)
      .subscribe((artists) => {
        let self = this;
        self.isArtistGenreUpdate =true;
        artists.forEach((artist, index) => {
          self.adminArtists.artists = _.filter(self.adminArtists.artists, function (artistObj) { return artistObj._id !== artist._id; });
        });
        this.adminArtists.artists = this.adminArtists.artists.concat(artists)
        setTimeout(() => {
              self.isArtistGenreUpdate =false;
        }, 4000);
          this.loading = false;
      }, (err) => {
          this.loading = false;
      })
  }

  statusChange(statusOpts){
    this.loading = true;
    let artistsIds = [];
    let self = this;
    if(this.checkedArtistId){
      artistsIds= this.getCheckedArtistIds();
     }else{
       artistsIds =[];
     }
    if(statusOpts && statusOpts.id == 4){
    let request_body={
       "Ids":artistsIds
     }
     this.adminArtistService.changeArtistReviewedStatus(request_body)
       .subscribe((responce) => {
         if (!_.isEmpty(responce)) {
           self.isReviewed = true;
           responce.forEach(element => {
             self.adminArtists.artists.forEach((artist, index) => {
               if (artist._id === element._id) {
                 self.adminArtists.artists[index] = element
               }
             });
           });
          setTimeout(() => {
                self.isReviewed =false;
          }, 4000);
            this.loading = false;
      }else{
          this.loading = false;
        return self.adminArtists.artists;

      }
        }, (err) => {
          this.loading = false;
    })
  }else if(statusOpts && statusOpts.id == 5){

    let request_body={
       "artistIds":artistsIds
     }
     this.adminArtistService.changeArtistMarkNonDuplicateStatus(request_body)
       .subscribe((responce) => {
           if(!_.isEmpty(responce)){
          self.isMarkedNonDuplicate = true;
          self.adminArtists.artists.forEach((artist, index) => {
          self.adminArtists.artists = _.filter(self.adminArtists.artists, function(artistObj) { return artistObj._id !== artist._id; });
          self.adminArtists.artists.push(responce[0]);
          });
          setTimeout(() => {
                self.isMarkedNonDuplicate =false;
          }, 4000);
            this.loading = false;
      }else{
          this.loading = false;
        return self.adminArtists.artists;

      }
        }, (err) => {
            this.loading = false;
    })

  }
  else if(statusOpts && statusOpts.id == 6){
    this.loading = false;
    this.mergeMultilpleArtist(artistsIds)
  }

  else{
        let request_body={
              "status": statusOpts ? statusOpts.id : 5,
              "artistIds":artistsIds
         }
        this.adminArtistService.changeArtistStatus(request_body)
              .subscribe((responce) => {
                if(!_.isEmpty(responce)){
                   self.isStatusChanged= true;
                   this.filter();
                   setTimeout(() => {
                     self.isStatusChanged = false;
                   }, 4000);
                } else {
                  this.loading = false;
                }
              }, (err) => {
                  this.loading = false;

              })
    }
    this.checkedArtistId = [];
}
  statusChangeAsReviewed(){
    this.loading = true;
     let artistsIds = [];
      let self = this;
    if(this.checkedArtistId){
      artistsIds= this.getCheckedArtistIds();
     }else{
       artistsIds =[];
     }
     let request_body={
      "artistIds":artistsIds
    }
    this.adminArtistService.changeArtistReviewedStatus(request_body)
      .subscribe((responce) => {
       self.adminArtists.artists .forEach((artist, index) => {
       self.adminArtists.artists = _.filter(self.adminArtists.artists, function(artistObj) { return artistObj._id !== artist._id; });
       self.adminArtists.artists.push(responce[0]);
        this.loading = false;
     });
      }, (err) => {
        this.loading = false;
      })
  }
  delete_record(id) {
    this.isDialogClose = true;
    let artistsIds = [];
    let self = this;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      accept: () => {
        this.isDialogClose = false;
        this.loading = true;
        artistsIds.push(id);
        let request_body={
          "status":0,
          "artistIds":artistsIds
        }
        this.adminArtistService.deleteAdminArtist(request_body)
          .subscribe((responce) => {
            this.isDeleteOption = false;
            self.adminArtists.artists = _.filter(self.adminArtists.artists, function(artistObj) { return artistObj._id !== id; });
            self.adminArtists.artists.push(responce[0]);
            this.loading = false;
          })
      },
      reject: () => {
        this.loading = false;
        this.isDialogClose = false;
      }
    });
  }

  clear() {
    this.search1.label = ""
    this.search1.id = ""
    this.search1.status = ""
    this.search1.creator_type = ""
    this.search1.genre = ""
    this.search1.artistname = ""
    this.search1.username = ""
    this.search1.opt_exact_match = ""
    this.search1.opt_has_img = ""
    this.search1.opt_has_rev = ""
    this.search1.opt_user_edited = ""
    this.search1.page_input = ""
    this.search1.pageno || 1;
    this.selectedSourceArtistsId = [];
    this.userId = '';
  }
  selectValue(value) {
    this.userId = '';
  }
/* This will merge source artists into destination artist and disble all the source artists */
  mergeMultilpleArtist(artistId){
    if(!artistId.length)
      alert("Please select destination artist Id")
    else if(artistId.length>1)
      alert("Please select only one destination artist Id ")
    else if(!this.selectedSourceArtistsId.length)
      alert("Please select at least on source artist Id")
    else if(this.selectedSourceArtistsId.indexOf(artistId[0])>-1)
      alert("Source artist Id and destination artist Id cannot be same")
    else{
      let request_body = {
        data:{
          "fromArtistIds": this.selectedSourceArtistsId,
          "toArtistId": artistId[0]
        }
      }
      this.loading = true;
      this.adminArtistService.mergeMultilpleArtist(request_body).subscribe((responce) => {
        this.loading = false;
        this.selectedSourceArtistsId = [];
        this.checkedArtistId = [];
        if(this.adminArtists)
          this.paginate({page:this.adminArtists.page_no-1})
        else
          window.location.reload(true);
      },(err) => {
        this.loading = false;
      })
    }
  }
  /* This will fetch all active ticket provider name name and id */
  getImport_providers() {
    this.providerList.push({ label: 'Select a Provider', value: null });
    this.commonService.getEventforAutoComplete().subscribe(providers => {
      if (providers.length){
        providers.forEach((p)=>{
          this.providerList.push({ 'label': p.name, 'value':  p._id })
        })
      }
    });
  }
}
