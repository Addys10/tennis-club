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
  courtForm: FormGroup;
  isEditing = false;
  courtId?: number;

  constructor(
    private fb: FormBuilder,
    private courtsService: CourtsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courtForm = this.fb.group({
      name: ['', Validators.required],
      surface: ['clay', Validators.required],
      isIndoor: [false],
      isAvailable: [true],
      hourlyRate: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.courtId = +id;
      this.loadCourt();
    }
  }

  loadCourt() {
    if (this.courtId) {
      this.courtsService.getCourt(this.courtId).subscribe(
        court => this.courtForm.patchValue(court)
      );
    }
  }

  onSubmit() {
    if (this.courtForm.valid) {
      const courtData = this.courtForm.value;

      const request = this.isEditing && this.courtId
        ? this.courtsService.updateCourt(this.courtId, courtData)
        : this.courtsService.createCourt(courtData);

      request.subscribe(() => {
        this.router.navigate(['/courts']);
      });
    }
  }
}
