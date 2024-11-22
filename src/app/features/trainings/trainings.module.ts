import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TrainingListComponent} from '@features/trainings/training-list/training-list.component';
import {TrainingFormComponent} from '@features/trainings/training-form/training-form.component';
import {TrainingDetailComponent} from '@features/trainings/training-detail/training-detail.component';

const routes: Routes = [
  {path: '', component: TrainingListComponent},
  {path: 'create', component: TrainingFormComponent},
  {path: ':id', component: TrainingDetailComponent}
];

@NgModule({
  declarations: [
    TrainingListComponent,
    TrainingFormComponent,
    TrainingDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TrainingsModule {
}
