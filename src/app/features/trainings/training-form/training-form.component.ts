import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {User, UserRole} from '@core/models/user.model';
import {Court} from '@core/models/court.model';
import {TrainingService} from '@core/services/training.service';
import {UserService} from '@core/services/user.service';
import {CourtService} from '@core/services/court.service';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.css']
})
export class TrainingFormComponent implements OnInit {
  trainingForm: FormGroup;
  coaches: User[] = [];
  courts: Court[] = [];
  players: User[] = [];

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingService,
    private userService: UserService,
    private courtService: CourtService,
    private router: Router
  ) {
    this.trainingForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      coachId: [null],
      courtId: [null],
      playerIds: [[null]],
      price: [0, [Validators.required, Validators.min(0)]],
      notes: [''],
      maxPlayers: [6]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.userService.getAllCoaches().subscribe(
      coaches => this.coaches = coaches
    );

    this.courtService.getAll().subscribe(
      courts => this.courts = courts
    );

    this.userService.getAll().subscribe(
      users => this.players = users.filter(u => u.role === UserRole.PLAYER)
    );
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      this.trainingService.create(this.trainingForm.value).subscribe({
        next: () => {
          this.router.navigate(['/trainings']);
        },
        error: (error) => {
          console.error('Error creating training:', error);
          // Zde můžete přidat zobrazení chybové hlášky uživateli
        }
      });
    }
  }
}
