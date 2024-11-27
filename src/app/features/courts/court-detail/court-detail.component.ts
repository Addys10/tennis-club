// court-detail.component.ts
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CourtsService} from '@core/services/court.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-court-detail',
  templateUrl: './court-detail.component.html',
  styleUrls: ['./court-detail.component.css']
})
export class CourtDetailComponent implements OnInit {
  courtForm!: FormGroup;
  isEditing = false;
  courtId?: number;
  loading = false;

  surfaces = [
    {value: 'clay', label: 'Antuka'},
    {value: 'hard', label: 'Tvrdý'},
    {value: 'grass', label: 'Tráva'}
  ];

  constructor(
    private fb: FormBuilder,
    private courtsService: CourtsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.courtForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surface: ['clay', Validators.required],
      isIndoor: [false],
      isAvailable: [true],
      hourlyRate: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCourtIfEditing();
  }

  private loadCourtIfEditing(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.courtId = +id;
      this.loading = true;

      this.courtsService.getCourt(this.courtId).subscribe({
        next: (court) => {
          this.courtForm.patchValue(court);
          this.loading = false;
        },
        error: (error) => {
          console.error('Chyba při načítání kurtu:', error);
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.courtForm.valid) {
      this.loading = true;
      const courtData = this.courtForm.value;

      const request = this.isEditing && this.courtId
        ? this.courtsService.updateCourt(this.courtId, courtData)
        : this.courtsService.createCourt(courtData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/courts']);
        },
        error: (error) => {
          console.error('Chyba při ukládání kurtu:', error);
          this.loading = false;
        }
      });
    }
  }
}
