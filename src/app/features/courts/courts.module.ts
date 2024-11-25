import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {CourtsListComponent} from '@features/courts/court-list/court-list.component';
import {CourtDetailComponent} from '@features/courts/court-detail/court-detail.component';
import {CourtsService} from '@core/services/court.service';

const routes: Routes = [
  {
    path: '',
    component: CourtsListComponent
  },
  {
    path: 'new',
    component: CourtDetailComponent
  },
  {
    path: ':id',
    component: CourtDetailComponent
  }
];

@NgModule({
  declarations: [
    CourtsListComponent,
    CourtDetailComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [CourtsService]
})
export class CourtsModule { }
