import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminArtistComponent } from './admin-artist.component';

const routes: Routes = [ { path: '',component: AdminArtistComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminArtistRoutingModule { }
