import { Component, OnInit } from '@angular/core';
import {
  DropdownModule, SelectItem, ButtonModule, DataTableModule, SharedModule,
  ConfirmDialogModule, ConfirmationService, DialogModule
} from 'primeng/primeng';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../environments/environment';
import { AdminArtistService } from '../../../../services/admin-artist.service';
import * as _ from "lodash";

@Component({
  selector: 'app-show-duplicates',
  templateUrl: './show-duplicates-artist.component.html',
  styleUrls: ['./show-duplicates-artist.component.sass'],
  providers: [AdminArtistService]
})
export class ShowDuplicatesArtistComponent implements OnInit {
  dup_actions: SelectItem[];
  dropdownValue: any;
  show_duplicates: any = [];
  body: any;
  statusBody: any = [];
  statusInput: any;
  paramBy: any;
  paramByValue: any;
  artistStatus: any;
  check: any;
  selectedValue: SelectItem[];
  mergedArtists;
  isDeleteOption: any;
  isDialogClose: boolean = true;
  artistId: any;
  non_dups;
  display: boolean = false;
  alertType: any;
  event: any;
  checkedArtistId = [];
  selectedArtists: any = {};
  isReviewed: boolean = false;
  loading: boolean = false;
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private authService: AuthService,
    private adminArtistService: AdminArtistService,
    private confirmationService: ConfirmationService,
  ) {
    this.dup_actions = [];
    this.dup_actions.push({ label: 'Select status type', value: null });
    this.dup_actions.push({ label: 'Disabled', value: { id: 2, name: 'Disabled', code: 'Disabled' } });
    this.dup_actions.push({ label: 'Enabled', value: { id: 1, name: 'Enabled', code: 'Enabled' } });
    this.dup_actions.push({ label: 'Deleted', value: { id: 0, name: 'Deleted', code: 'Deleted' } });
    this.dup_actions.push({ label: 'Reviewed', value: { id: 4, name: 'Reviewed', code: 'Reviewed' } });
    this.dup_actions.push({ label: 'MarkNonDuplicate', value: { id: 5, name: 'MarkNonDuplicate', code: 'MarkNonDuplicate' } });

    this.artistStatus = { 0: 'deleted', 1: 'enabled', 2: 'disabled', 3: 'banned', 4: 'flagged', 5: 'pending' };
  }

  ngOnInit() {
    this.actRoute.queryParams.subscribe(params => {
      this.loading = true;
      this.body = Object.assign({}, params);
      this.paramBy = this.body['paramBy'];
      this.paramByValue = this.body['paramByValue'];
      this.non_dups = this.body['non_dups'];
      this.authService.getArtistDuplicates(this.paramBy, this.paramByValue, this.non_dups)
        .subscribe((duplicates) => {
          var mergedArtists = [];
          for (let i = 0; i < duplicates.artists.length; i += 1) {
            var mergeArtist = [];
            for (let j = 0; j < duplicates.artists.length; j += 1) {
              if (duplicates.artists[i]._id != duplicates.artists[j]._id) {
                mergeArtist.push(duplicates.artists[j]._id);
              }
            }
            duplicates.artists[i].mergeArtist = mergeArtist;
            mergedArtists.push(mergeArtist);
          }
          for (let i = 0; i < duplicates.artists.length; i += 1) {
            duplicates.artists[i].image_count = duplicates.artists[i].images.length;
          }

          this.mergedArtists = mergedArtists;
          this.show_duplicates = duplicates.artists;
          this.loading = false;

        },
          (err) => {
            this.loading = false;
          })
    },
      (err) => {
        this.loading = false;
      })
  }

  // function that save source and destination venues
  setDestinationId(destinationId, sourceId) {
    this.selectedArtists[destinationId] = sourceId;
  }

  mergeArtists(destinationId) {
    let sourceId = this.selectedArtists[destinationId];
    destinationId;
    var obj = { "source_aid": sourceId, "dest_aid": destinationId };
    if (sourceId != undefined) {
      this.loading = true;
      this.adminArtistService.mergeAdminArtist(obj)
        .subscribe((artistsData) => {
          var block1 = "destination";
          var block2 = "destination";
          var block3 = "destination";

          var videosEmbeds = [];
          for (let i = 0; i < artistsData.source_artist.video_embeds.length; i += 1) {
            var boolFlag = true;
            for (let j = 0; j < artistsData.destination_artist.video_embeds.length; j += 1) {
              if (i != j) {
                if (artistsData.destination_artist.video_embeds[j] != artistsData.source_artist.video_embeds[i]) {
                  boolFlag = true;
                } else {
                  boolFlag = false;
                  break;
                }
              }
            }
            if (boolFlag)
              videosEmbeds.push(artistsData.source_artist.video_embeds[i]);
          }

          var block4 = {
            name: (artistsData.destination_artist.name != '') ? artistsData.destination_artist.name : artistsData.source_artist.name,
            _id: artistsData.destination_artist._id,
            type: "artists",
            categories: artistsData.destination_artist.categories,
            video_embeds: videosEmbeds,
          };

          for (let i = 0; i < artistsData.destination_artist.social_media.length; i += 1) {
            if (artistsData.destination_artist.social_media[i].url == '' && artistsData.source_artist.social_media[i].url != '') {
              artistsData.destination_artist.social_media[i].url = artistsData.source_artist.social_media[i].url;
            }
          }

          var block5 = {
            email: (artistsData.destination_artist.email != '') ? artistsData.destination_artist.email : artistsData.source_artist.email,
            hometown: undefined,
            website: (artistsData.destination_artist.website != '') ? artistsData.destination_artist.website : artistsData.source_artist.website,
            year_formed: (artistsData.destination_artist.year_formed != 0) ? artistsData.destination_artist.year_formed : artistsData.source_artist.year_formed,
            social_media: artistsData.destination_artist.social_media,
          };

          if (artistsData.destination_artist.description.length > 0 && artistsData.source_artist.description.length > 0) {
            var descriptions = [];
            var des = (artistsData.destination_artist.description[0] != '') ? artistsData.destination_artist.description[0] : artistsData.source_artist.description[0];
            if (des == undefined || null)
              des = '';
            descriptions.push(des);
            var block6 = {
              description: descriptions,
            }
          } else {
            var descriptions = [];
            var des = artistsData.destination_artist.description[0];
            if (des == undefined || null)
              des = '';
            descriptions.push(des);
            var block6 = {
              description: descriptions,
            }
          }

          var images = [];
          for (let i = 0; i < artistsData.source_artist.images.length; i += 1) {
            var Flag = true;
            for (let j = 0; j < artistsData.destination_artist.images.length; j += 1) {
              if (i != j) {
                if (artistsData.destination_artist.images[j].name != artistsData.source_artist.images[i].name) {
                  Flag = true;
                } else {
                  Flag = false;
                  break;
                }
              }
            }
            images.push(artistsData.source_artist.images[i]);
          }

          var data = {
            block1: block4,
            block2: block5,
            block3: block6,
            eventList: artistsData.upcoming_events,
            images: images,
          };

          var request_body = {
            block1: block1,
            block2: block2,
            block3: block3,
            data: data,
          };
          this.adminArtistService.mergeAdminArtistReviews(sourceId, destinationId, request_body)
            .subscribe((artists) => {
              window.location.reload(true);
            },
              (err) => {
                this.loading = false;
              })
        },
          (err) => {
            this.loading = false;
          })
    }
  }
  lateSelectedValue() {
    let self = this;
    setTimeout(function () {
    }, 1000)
  }

  onRowSelect(event) {
    let self = this;
    self.selectedValue.push(event);
  }

  onRowUnselect(event) {
    let self = this;
    _.filter(self.selectedValue, function (value) {
      _.slice(self.selectedValue, value._id)
      return self.selectedValue;
    });
  }
  statusChange(statusOpts) {
    let artistsIds = [];
    let self = this;
    this.loading = true;
    if (this.checkedArtistId) {
      artistsIds = this.checkedArtistId;
    } else {
      artistsIds = [];
    }
    if (statusOpts && statusOpts.id == 4) {
      let request_body = {
        "Ids": artistsIds
      }
      this.adminArtistService.changeArtistReviewedStatus(request_body)
        .subscribe((responce) => {
          if (!_.isEmpty(responce)) {
            self.isReviewed = true;
            self.show_duplicates.forEach((artist, index) => {
              self.show_duplicates = _.filter(self.show_duplicates, function (artistObj) { return artistObj._id !== artist._id; });
              self.show_duplicates.push(responce[0]);
              setTimeout(() => {
                self.isReviewed = false;
              }, 4000);
              this.loading = false;
            });
          } else {
            this.loading = false;
            return self.show_duplicates;
          }
        }, (err) => {
          this.loading = false;
        })
    } else if (statusOpts && statusOpts.id == 5) {

      let request_body = {
        "artistIds": artistsIds
      }
      this.adminArtistService.changeArtistMarkNonDuplicateStatus(request_body)
        .subscribe((responce) => {
          if (!_.isEmpty(responce)) {
            self.show_duplicates.forEach((artist, index) => {
              self.show_duplicates = _.filter(self.show_duplicates, function (artistObj) { return artistObj._id !== artist._id; });
              self.show_duplicates.push(responce[0]);
              this.loading = false;
            });
          } else {
            this.loading = false;
            return self.show_duplicates;
          }
        }, (err) => {
          this.loading = false;
        })

    } else {
      let request_body = {
        "status": statusOpts ? statusOpts.id : 5,
        "artistIds": artistsIds
      }
      this.adminArtistService.changeArtistStatus(request_body)
        .subscribe((responce) => {
          if (!_.isEmpty(responce)) {
            self.show_duplicates.forEach((artist, index) => {
              self.show_duplicates = _.filter(self.show_duplicates, function (artistObj) { return artistObj._id !== artist._id; });
              self.show_duplicates.push(responce[0]);
              this.loading = false;
            });
          } else {
            this.loading = false;
            return self.show_duplicates;
          }
        }, (err) => {
          this.loading = false;
        })
    }
  }
  go(dropdownValue) {
    var self = this;
    this.show_duplicates.dropdownValue = dropdownValue;
    _.forEach(this.selectedValue, function (value) {
      self.statusBody.push(value._id)
    });
    if (this.checkedArtistId && this.checkedArtistId.length > 0) {
      switch (this.show_duplicates.dropdownValue.name) {
        case "enable":
          let statusInput1 = {
            status: 1,
            artistIds: this.statusBody,
          }
          this.authService.putArtistDuplicatesStatus(statusInput1)
            .subscribe((duplicates) => {
              this.alertType = "success";
              this.show_duplicates.resMsg = "Enabled successfully";
            })
          break;

        case "disable":
          let statusInput2 = {
            status: 2,
            artistIds: this.statusBody,
          }
          this.authService.putArtistDuplicatesStatus(statusInput2)
            .subscribe((duplicates) => {
              this.alertType = "success";
              this.show_duplicates.resMsg = "Disabled successfully";
            })
          break;

        case "deleted":
          let statusInput3 = {
            status: 3,
            artistIds: this.statusBody,
          }
          this.authService.putArtistDuplicatesStatus(statusInput3)
            .subscribe((duplicates) => {
              this.alertType = "success";
              this.show_duplicates.resMsg = "Deleted successfully";
            })
          break;

        case "reviewed":
          let statusInput4 = {
            Ids: this.statusBody,
          }
          this.authService.putArtistDuplicatesReview(statusInput4)
            .subscribe((duplicates) => {
              this.alertType = "success";
              this.show_duplicates.resMsg = "Reviewed successfully";
            })
          break;

        case "markNonDuplicates":
          let statusInput5 = {
            Ids: this.statusBody,
          }
          this.authService.putArtistDuplicatesNonDuplicate(statusInput5)
            .subscribe((duplicates) => {
              this.alertType = "success";
              this.show_duplicates.resMsg = "Marked Non-Duplicates successfully";
            })
          break;

      }
    } else {
      this.display = true;
    }

  }
  selectArtistId(isChecked, id) {
    if (isChecked) {
      this.checkedArtistId.push(id);
    } else {
      this.display = true;
      this.checkedArtistId = this.checkedArtistId.filter((artistId) => {
        return artistId != id;

      });
    }

  }
  editSelectedItem() {
    let i = 0;
    this.display = true;
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
        let request_body = {
          "status": 0,
          "artistIds": artistsIds
        }
        this.adminArtistService.deleteAdminArtist(request_body)
          .subscribe((response) => {
            this.isDeleteOption = false;
            self.show_duplicates = _.filter(self.show_duplicates, function (artistObj) { return artistObj._id !== id; });
            self.show_duplicates.push(response[0]);
            this.loading = false;
          })
      },
      reject: () => {
        this.loading = false;
        this.isDialogClose = false;
      }
    });
  }

}
