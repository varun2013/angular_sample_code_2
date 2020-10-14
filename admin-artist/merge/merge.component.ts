import { Component, OnInit, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { CommonService } from '../../../services/common.service';
import { AdminArtistService } from '../../../services/admin-artist.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArtistProfileService } from '../../../services/artist-profile.service';
declare var $: any;
import { ButtonModule, RadioButtonModule, CheckboxModule } from 'primeng/primeng';
import * as _ from "lodash";
@Component({
  selector: 'app-merge',
  templateUrl: './merge.component.html',
  styleUrls: ['./merge.component.sass'],
  providers: [AdminArtistService, ArtistProfileService]
})
export class MergeComponent implements OnInit {
  artists: any = [{}];
  adminArtists: any = [{}];
  adminReviewsArtists: any = [{}];
  categoriesList: any = [];
  userSelectedCategories = "";
  userDestSelectedCategories = "";
  userSelectedCategory: any = [];
  userSelectedCategory2: any = [];
  isMerge: boolean = true;
  isMergeTable: boolean = false;
  isMergeTableReview: boolean = false;



  search1: any = {};
  block1: any = {};
  block2: any = {};
  block3: any = {};
  event: any = {};
  eventId: string;
  artistIsSelected: boolean = false;
  artist: any = {};
  artistId: string;
  message: string;
  source_type: string;
  destination_type: string;
  checkbox: string[] = [];
  checkbox2: string[] = [];
  loading: boolean = false;

  constructor(
    private adminArtistService: AdminArtistService,
    private commonService: CommonService,
    private actRoute: ActivatedRoute,
    private artistProfileService: ArtistProfileService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { this.getCategories(); }

  ngOnInit() {
    this.search1.block1 = "destination";
    this.search1.block2 = "destination";
    this.search1.block3 = "destination";
    $('body').on("click", ".dropdown-menu", function (e) {
      $(this).parent().is(".open") && e.stopPropagation();
    });
    this.loading = true;
    this.actRoute.params.subscribe(params => {
      this.artistId = params['id'];
      if (this.artistId != undefined && this.artistId.length != 0) {
        this.artistProfileService.getAdminArtist(this.artistId)
          .subscribe((artistProfileResponse) => {
            this.artist = artistProfileResponse;
            this.artist.favourite_categories = [];
            this.search1.source_artistname = this.artistId + '-' + this.artist.name;

            this.loading = false;
          }, err => {
            let errorObj = this.commonService.errorMessage(err);
            this.message = errorObj['message'];
            this.loading = false;
          });
      }
    });

    this.adminArtists.source_artist = {};
    this.adminArtists.destination_artist = {};
    this.adminArtists.destination_artist.video_embeds = [];
    this.adminArtists.source_artist.video_embeds = [];
    this.adminArtists.source_artist.social_media = {
      'facebook': { 'url': '' },
      'twitter': { 'url': '' },
      'youtube': { 'url': '' },
      'pinterest': { 'url': '' },
      'wikipedia': { 'url': '' },
      'instagram': { 'url': '' },
      'tumblr': { 'url': '' },
      'myspace': { 'url': '' },
      'vimeo': { 'url': '' },
      'vevo': { 'url': '' },
      'soundcloud': { 'url': '' },
      'reverbnation': { 'url': '' },
      'bandcamp': { 'url': '' }
    };
    this.adminArtists.destination_artist.social_media = {
      'facebook': { 'url': '' },
      'twitter': { 'url': '' },
      'youtube': { 'url': '' },
      'pinterest': { 'url': '' },
      'wikipedia': { 'url': '' },
      'instagram': { 'url': '' },
      'tumblr': { 'url': '' },
      'myspace': { 'url': '' },
      'vimeo': { 'url': '' },
      'vevo': { 'url': '' },
      'soundcloud': { 'url': '' },
      'reverbnation': { 'url': '' },
      'bandcamp': { 'url': '' }
    };

  }
  selectArtist(id, artist) {
    if (id == "0") {
      this.event.location = "";
      return false;
    }
    this.artistIsSelected = true;
    this.event.location = artist;
    this.event.artist_id = id;
  }

  getCategories() {
    this.commonService.getCategories()
      .subscribe((categories) => {
        let categoryList = categories;
        this.categoriesList = [];
        categoryList.forEach((category, index) => {
          if (category.children && category.children.length) {
            this.categoriesList.push(category);
            category.children.forEach((childcategory, index) => {
              this.categoriesList.push(childcategory);
            })
          } else {
            this.categoriesList.push(category);
          }
        });
      });
  }

  selectSourceCategories(isChecked, id) {
    $('body').on("click", ".dropdown-menu", function (e) {
      $(this).parent().is(".open") && e.stopPropagation();
    });
    if (isChecked) {
      this.adminArtists.source_artist.categories.push(id);
      this.categoriesList.forEach((category, index) => {
        if (category.children && category.children.length) {
          category.children.forEach((childcategory, childcategoryid) => {
            if (id == childcategory.parent_id) {
              if (!(this.adminArtists.source_artist.categories.indexOf(childcategory._id) > -1)) {
                this.adminArtists.source_artist.categories.push(childcategory._id);
              }
            }
          })
        }
      });
    } else {

      this.categoriesList.forEach((category, index) => {
        if (category.children && category.children.length) {
          category.children.forEach((childcategory, childcategoryid) => {
            if (id == childcategory.parent_id) {
              for (let childIndex = index + 1; childIndex <= (index + category.children.length); childIndex++) {
                this.adminArtists.source_artist.categories = this.adminArtists.source_artist.categories.filter((genereId) => {
                  return genereId != childcategory._id;
                });
                this.userSelectedCategory[childIndex] = false;
              }
            }
          })
        }
      });

      this.adminArtists.source_artist.categories = this.adminArtists.source_artist.categories.filter((category) => {
        if (category && category.name) {
          return category.id != id;
        } else {
          return category != id;
        }
      });
    }

    this.selectedSourceCategories();
  }
  selectDestinationCategories(isChecked, id) {
    $('body').on("click", ".dropdown-menu", function (e) {
      $(this).parent().is(".open") && e.stopPropagation();
    });
    if (isChecked) {
      this.adminArtists.destination_artist.categories.push(id);
      this.categoriesList.forEach((category, index) => {
        if (category.children && category.children.length) {
          category.children.forEach((childcategory, childcategoryid) => {
            if (id == childcategory.parent_id) {
              if (!(this.adminArtists.destination_artist.categories.indexOf(childcategory._id) > -1)) {
                this.adminArtists.destination_artist.categories.push(childcategory._id);
              }
            }
          })
        }
      });
    } else {
      this.categoriesList.forEach((category, index) => {
        if (category.children && category.children.length) {
          category.children.forEach((childcategory, childcategoryid) => {
            if (id == childcategory.parent_id) {
              for (let childIndex = index + 1; childIndex <= (index + category.children.length); childIndex++) {
                this.adminArtists.destination_artist.categories = this.adminArtists.destination_artist.categories.filter((genereId) => {
                  return genereId != childcategory._id;
                });
                this.userSelectedCategory2[childIndex] = false;
              }
            }
          })
        }
      });

      this.adminArtists.destination_artist.categories = this.adminArtists.destination_artist.categories.filter((category) => {
        if (category && category.name) {
          return category.id != id;
        } else {
          return category != id;
        }
      });
    }

    this.selectedDestinationCategories();
  }


  selectedSourceCategories() {
    this.userSelectedCategories = "";
    var self = this;
    var props = ['name'];
    var userSelectedCategories = this.categoriesList.filter(function (category, index) {
      return self.adminArtists.source_artist.categories.some(function (selectedCategory) {
        if (selectedCategory && selectedCategory.name) {
          if (category._id == selectedCategory.id) {
            self.userSelectedCategory[index] = true;
          }
          return category._id == selectedCategory.id;
        } else {
          if (category._id == selectedCategory) {
            self.userSelectedCategory[index] = true;
          }
          return category._id == selectedCategory;
        }
      });
    }).map(function (categories) {
      return props.reduce(function (newSelected, name) {
        newSelected[name] = categories[name];
        return newSelected;
      }, {});
    });
    userSelectedCategories.forEach((value, index) => {
      if (userSelectedCategories.length < 4) {
        if (index != userSelectedCategories.length - 1) {
          this.userSelectedCategories += value.name + ", ";
        } else {
          this.userSelectedCategories += value.name;
        }
      } else {
        this.userSelectedCategories = userSelectedCategories.length + " More Genres";
      }
    })
  }

  selectedDestinationCategories() {
    this.userDestSelectedCategories = "";
    var self = this;
    var props = ['name'];
    var userDestSelectedCategories = this.categoriesList.filter(function (category, index) {
      return self.adminArtists.destination_artist.categories.some(function (selectedCategory) {
        if (selectedCategory && selectedCategory.name) {
          if (category._id == selectedCategory.id) {
            self.userSelectedCategory2[index] = true;
          }
          return category._id == selectedCategory.id;
        } else {
          if (category._id == selectedCategory) {
            self.userSelectedCategory2[index] = true;
          }
          return category._id == selectedCategory;
        }
      });
    }).map(function (categories) {
      return props.reduce(function (newSelected, name) {
        newSelected[name] = categories[name];
        return newSelected;
      }, {});
    });

    userDestSelectedCategories.forEach((value, index) => {
      if (userDestSelectedCategories.length < 4) {
        if (index != userDestSelectedCategories.length - 1) {
          this.userDestSelectedCategories += value.name + ", ";
        } else {
          this.userDestSelectedCategories += value.name;
        }
      } else {
        this.userDestSelectedCategories = userDestSelectedCategories.length + " More Genres";
      }
    })
  }
  getArtists(location, type) {
    this.artistIsSelected = false;
    this.commonService.getArtistsforAutoComplete(location, type)
      .subscribe((artist) => {
        if (artist.length < 1) {
          this.artists = [{ 'id': "0", 'value': "artist not found" }];
        } else {
          this.artists = artist;
        }
      },
      (err) => {
        this.artists = [{ 'id': "0", 'value': "artists not found" }];
      })
  }
  mergeArtists() {
    this.isMerge = false;
    this.isMergeTable = true;
    this.isMergeTableReview = false;
    let self = this;
    let request_body = {
      "source_aid": this.artistId,
      "dest_aid": this.event.artist_id
      //"source_aid":"5aaf8a2c2a6a5978ca5b0f5c",
      //"dest_aid":"5aaf8a2c2a6a5978ca5b0f4c"
    }

    this.adminArtistService.mergeAdminArtist(request_body)
      .subscribe((artists) => {
        this.adminArtists = artists;
        this.adminArtists.upcoming_events.forEach((eventObj, index) => {
          this.checkbox.push(eventObj._id);
        })
        this.selectedSourceCategories();
        this.selectedDestinationCategories();
        this.adminArtists.source_artist.social_media = _.keyBy(this.adminArtists.source_artist.social_media, 'media_type');
        this.adminArtists.destination_artist.social_media = _.keyBy(this.adminArtists.destination_artist.social_media, 'media_type');
      })
  }
  mergeVenueReviewsConfirm() {
    this.isMerge = false;
    this.isMergeTable = false;
    this.isMergeTableReview = true;
    if (this.search1.block1 == "source") {

      this.block1 = {
        "_id": this.adminArtists.source_artist._id,
        "name": this.adminArtists.source_artist.name,
        "categories": this.adminArtists.source_artist.categories,
        "type": this.adminArtists.source_artist.type,

      }
    }
    if (this.search1.block2 == "source") {
      this.block2 = {
        "email": this.adminArtists.source_artist.email,
        "hometown": this.adminArtists.source_artist.hometown,
        "year_formed": this.adminArtists.source_artist.year_formed,
        "website": this.adminArtists.source_artist.website,
        "video_embeds": this.adminArtists.source_artist.video_embeds,
        "social_media": [
          {
            "url": this.adminArtists.source_artist.social_media.facebook ? this.adminArtists.source_artist.social_media.facebook.url : " ",
            "media_type": "facebook"
          },
          {
            "url": this.adminArtists.source_artist.social_media.twitter ? this.adminArtists.source_artist.social_media.twitter.url : "",
            "media_type": "twitter"
          },
          {
            "url": this.adminArtists.source_artist.social_media.youtube ? this.adminArtists.source_artist.social_media.youtube.url : "",
            "media_type": "youtube"
          },

          {
            "url": this.adminArtists.source_artist.social_media.pinterest ? this.adminArtists.source_artist.social_media.pinterest.url : "",
            "media_type": "pinterest"
          },
          {
            "url": this.adminArtists.source_artist.social_media.wikipedia ? this.adminArtists.source_artist.social_media.wikipedia.url : "",
            "media_type": "wikipedia"
          },
          {
            "url": this.adminArtists.source_artist.social_media.instagram ? this.adminArtists.source_artist.social_media.instagram.url : "",
            "media_type": "instagram"
          },
          {
            "url": this.adminArtists.source_artist.social_media.tumblr ? this.adminArtists.source_artist.social_media.tumblr.url : "",
            "media_type": "tumblr"
          },
          {
            "url": this.adminArtists.source_artist.social_media.myspace ? this.adminArtists.source_artist.social_media.myspace.url : "",
            "media_type": "myspace"
          },
          {
            "url": this.adminArtists.source_artist.social_media.vimeo ? this.adminArtists.source_artist.social_media.vimeo.url : "",
            "media_type": "vimeo"
          },
          {
            "url": this.adminArtists.source_artist.social_media.vevo ? this.adminArtists.source_artist.social_media.vevo.url : "",
            "media_type": "vevo"
          },
          {
            "url": this.adminArtists.source_artist.social_media.soundcloud ? this.adminArtists.source_artist.social_media.soundcloud.url : "",
            "media_type": "soundcloud"
          },
          {
            "url": this.adminArtists.source_artist.social_media.reverbnation ? this.adminArtists.source_artist.social_media.reverbnation.url : "",
            "media_type": "reverbnation"
          },
          {
            "url": this.adminArtists.source_artist.social_media.bandcamp ? this.adminArtists.source_artist.social_media.bandcamp.url : "",
            "media_type": "bandcamp"
          }]
      }
    }
    if (this.search1.block3 == "source") {
      this.block3 = {
        "description": this.adminArtists.source_artist.description,
      }
    }
    if (this.search1.block1 == "destination") {

      this.block1 = {
        "_id": this.adminArtists.destination_artist._id,
        "name": this.adminArtists.destination_artist.name,
        "categories": this.adminArtists.destination_artist.categories,
        "type": this.adminArtists.destination_artist.type,

      }
    }
    if (this.search1.block2 == "destination") {
      this.block2 = {
        "email": this.adminArtists.destination_artist.email,
        "hometown": this.adminArtists.destination_artist.hometown,
        "year_formed": this.adminArtists.destination_artist.year_formed,
        "website": this.adminArtists.destination_artist.website,
        "video_embeds": this.adminArtists.destination_artist.video_embeds,
        "social_media": [
          {
            "url": this.adminArtists.destination_artist.social_media.facebook ? this.adminArtists.destination_artist.social_media.facebook.url : "",
            "media_type": "facebook"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.twitter ? this.adminArtists.destination_artist.social_media.twitter.url : "",
            "media_type": "twitter"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.youtube ? this.adminArtists.destination_artist.social_media.youtube.url : "",
            "media_type": "youtube"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.pinterest ? this.adminArtists.destination_artist.social_media.pinterest.url : "",
            "media_type": "pinterest"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.wikipedia ? this.adminArtists.destination_artist.social_media.wikipedia.url : "",
            "media_type": "wikipedia"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.instagram ? this.adminArtists.destination_artist.social_media.instagram.url : "",
            "media_type": "instagram"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.tumblr ? this.adminArtists.destination_artist.social_media.tumblr.url : "",
            "media_type": "tumblr"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.myspace ? this.adminArtists.destination_artist.social_media.myspace.url : "",
            "media_type": "myspace"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.vimeo ? this.adminArtists.destination_artist.social_media.vimeo.url : "",
            "media_type": "vimeo"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.vevo ? this.adminArtists.destination_artist.social_media.vevo.url : "",
            "media_type": "vevo"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.soundcloud ? this.adminArtists.destination_artist.social_media.soundcloud.url : "",
            "media_type": "soundcloud"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.reverbnation ? this.adminArtists.destination_artist.social_media.reverbnation.url : "",
            "media_type": "reverbnation"
          },
          {
            "url": this.adminArtists.destination_artist.social_media.bandcamp ? this.adminArtists.destination_artist.social_media.bandcamp.url : "",
            "media_type": "bandcamp"
          }
        ]
      }
    }
    if (this.search1.block3 == "destination") {
      this.block3 = {
        "description": this.adminArtists.destination_artist.description
      }
    }

    let request_body = {
      "block1": this.search1.block1,
      "block2": this.search1.block2,
      "block3": this.search1.block3,
      "data": {
        "block1": this.block1,
        "block2": this.block2,
        "block3": this.block3,
        "eventList": this.checkbox,
        "images": this.checkbox2
      }
    }

    let source_aid = this.artistId;
    let dest_aid = this.event.artist_id;
    //let source_aid = "5aaf8a2c2a6a5978ca5b0f5c";
    //let dest_aid = "5aaf8a2c2a6a5978ca5b0f4c";

    this.adminArtistService.mergeAdminArtistReviews(source_aid, dest_aid, request_body)
      .subscribe((artists) => {
        this.adminReviewsArtists = artists;
        this.router.navigate(['/admin/admin-artist'], { queryParams: { "merged": "true" } })
      },
      (err) => {
      })
  }
}
