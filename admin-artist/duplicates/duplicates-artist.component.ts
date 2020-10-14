import { Component, OnInit } from '@angular/core';
import { ButtonModule, PaginatorModule, DataTableModule, SharedModule } from 'primeng/primeng';
import { AuthService } from '../../../services/auth.service';
import { AdminDuplicatesService } from '../../../services/admin-duplicates.service';
import { WindowRefService } from '../../../services/window-ref.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { log } from 'util';

@Component({
  selector: 'app-duplicates',
  templateUrl: './duplicates-artist.component.html',
  styleUrls: ['./duplicates-artist.component.sass'],
  providers: [AdminDuplicatesService,WindowRefService]
})
export class DuplicatesArtistComponent implements OnInit {
  isName: boolean = false;
  isFb: boolean = false;
  isTwitter: boolean = false;
  nonDups: boolean = false;
  token: string = "";
  refer_code: string = "";
  adminduplicates: any = [];
  loading: boolean = false;
  totalResults: number = 0;
  artistStatus: any = {};
  artistObj: any = {};
  filterData = "name";
  page_no = 1;
  page_limit = 100;
  totalRows = 0;
  showing = "";
  nativeWindow: any;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private authService: AuthService,
    private adminDuplicatesService: AdminDuplicatesService,
    private winRef: WindowRefService
  ) { this.artistStatus = { 0: 'DEL', 1: 'ENBLD', 2: 'DISABL', 3: 'BAND', 4: 'FLG', 5: 'PEND' }
    this.nativeWindow = winRef.getNativeWindow();
  }

  ngOnInit() {
    let self = this;
    this.findAllDuplicates(this.filterData, this.page_no, this.page_limit);
  }

  findAllDuplicates(filterData, page_no, page_limit) {
    this.loading = true;
    let from :number = (((page_no-1) * ( this.page_limit ))+ 1);
    this.showing = "Showing "+ from+ " to "+(page_no*this.page_limit);

    this.adminDuplicatesService.getAdminArtist(filterData, page_no, page_limit)
      .subscribe((duplicates) => {
        this.adminduplicates = duplicates;
        this.totalResults = duplicates.total;
        this.totalRows = this.page_limit;
        this.showing+=" out of "+this.totalResults+" records";
        this.loading = false;
      }, (err) => {
        this.loading = false;
      })
  }

  name_link() {
    this.isName = true;
    this.isFb = false;
    this.isTwitter = false;
    this.nonDups = false;
    this.filterData = 'name';
    this.findAllDuplicates(this.filterData, this.page_no, this.page_limit);
  }

  fb_link() {
    this.isFb = true;
    this.isName = false;
    this.isTwitter = false;
    this.nonDups = false;
    this.filterData = 'facebook';
    this.findAllDuplicates(this.filterData, this.page_no, this.page_limit);
  }

  twitter_link() {
    this.isTwitter = true;
    this.isFb = false;
    this.isName = false;
    this.nonDups = false;
    this.filterData = 'twitter';
    this.findAllDuplicates(this.filterData, this.page_no, this.page_limit);
  }

  no_dup_link() {
    this.nonDups = true;
    this.isName = false;
    this.isFb = false;
    this.isTwitter = false;
    this.filterData = 'non_dups';
    this.findAllDuplicates(this.filterData, this.page_no, this.page_limit);
  }

  loadDuplicates(event: LazyLoadEvent) {
    this.loading = true;
    let self = this;
    setTimeout(() => {
      if (this.adminduplicates.artists) {
        let page_no: number = event.first / this.page_limit;
        page_no = page_no + 1;
        let from :number = (((page_no-1) * ( this.page_limit ))+ 1);
        this.showing = "Showing "+ from+ " to "+(page_no*this.page_limit);

        this.adminDuplicatesService.getAdminArtist(this.filterData, page_no, this.page_limit).subscribe((duplicates) => {
          this.adminduplicates = duplicates;
          this.totalResults = duplicates.total;
          this.totalRows = this.page_limit;
          this.showing+=" out of "+this.totalResults+" records";
          this.loading = false;
        }, (err) => {
          this.loading = false;
        })
      }
    }, 150);
  }

  showAllArtistDuplicates(eventObj: any) {
    let paramBy = '', paramByValue = '';
    paramBy = eventObj.dup_match_field;
    if (eventObj.dup_match_field == 'name') {
      paramByValue = eventObj._id
    } else if (eventObj.dup_match_field == 'facebook' || eventObj.dup_match_field == 'twitter') {
      paramByValue = eventObj.url
    }
    
    let strUrl : string = '/admin/duplicatesartist/showartistduplicates?paramBy='+paramBy+'&paramByValue='+paramByValue;
    let newWindow = this.nativeWindow.open(strUrl,'_blank');
    
    newWindow.location = (this.filterData == 'non_dups') ? strUrl+'&non_dups=true' : strUrl;
  }
}

export interface LazyLoadEvent {
  first?: number;
  rows?: number;
  sortField?: string;
  sortOrder?: number;
  multiSortMeta?: SortMeta[];
  filters?: { [s: string]: FilterMetadata; };
  globalFilter?: any;
}

export interface SortMeta {
  field: string;
  order: number;
}
export interface FilterMetadata {
  value?: any;
  matchMode?: string;
}
