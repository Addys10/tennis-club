import {Component, OnInit} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {Profile} from '@core/models/profile.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  isEditing = false;
  loading = false;
  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      email: [{value: '', disabled: true}]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Chyba při načítání profilu:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      const updatedProfile = {
        firstName: this.profileForm.get('firstName')?.value,
        lastName: this.profileForm.get('lastName')?.value,
        phone: this.profileForm.get('phone')?.value
      };

      this.authService.updateProfile(updatedProfile).subscribe({
        next: (profile) => {
          this.profile = profile;
          this.isEditing = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Chyba při aktualizaci profilu:', error);
          this.loading = false;
        }
      });
    }
  }
}
