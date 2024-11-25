import {NgModule} from '@angular/core';
import {UserManagementComponent} from '@features/user-management/user-management.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [UserManagementComponent]
})
export class UserManagementModule { }
