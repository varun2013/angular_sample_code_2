import { NgModule } from '@angular/core';
import { AdminArtistRoutingModule } from './admin-artist-routing.module';
import { AdminArtistComponent } from './admin-artist.component';
import { SharingModule } from '../../shared/shared.module';
import {
  InputTextModule, ButtonModule, DataTableModule, DialogModule, TabMenuModule,
  ToggleButtonModule, DropdownModule, CheckboxModule, PaginatorModule, SharedModule,
  ConfirmDialogModule, CalendarModule, SplitButtonModule, RadioButtonModule,
  OverlayPanelModule
} from 'primeng/primeng';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  imports: [   
    AdminArtistRoutingModule,
    SharingModule,
    InputTextModule, ButtonModule, DataTableModule, DialogModule,  TabMenuModule,
    ToggleButtonModule, DropdownModule, CheckboxModule, PaginatorModule, SharedModule, ConfirmDialogModule,
     CalendarModule, SplitButtonModule, RadioButtonModule, OverlayPanelModule,
     CKEditorModule
  ],
  declarations: [
  	AdminArtistComponent,
  ],
  providers: []
})
export class AdminArtistModule { }
