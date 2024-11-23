import {Component, OnInit} from '@angular/core';
import {User} from '@core/models/auth.model';
import {AuthService} from '@core/services/auth.service';
import {Router} from '@angular/router';
import {TrainingService} from '@core/services/training.service';
import {Training} from '@core/models/training.model';
import {catchError, filter, takeUntil} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  trainings: Training[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private trainingService: TrainingService,
    private router: Router
  ) {
  }

  ngOnInit(): void {

  }

  loadTrainings(): void {
    if (!this.currentUser?.id) {
      this.error = 'Není přihlášený žádný uživatel';
      return;
    }

    this.loading = true;
    this.error = null;

    this.trainingService.getByPlayer(this.currentUser.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Chyba při načítání tréninků:', error);
          this.error = 'Nepodařilo se načíst tréninky.';
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (trainings) => {
          this.trainings = trainings;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  cancelTraining(trainingId: number): void {
    if (!trainingId) return;

    this.loading = true;
    this.error = null;

    this.trainingService.cancel(trainingId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Chyba při rušení tréninku:', error);
          this.error = 'Nepodařilo se zrušit trénink.';
          return throwError(() => error);
        })
      )
      .subscribe({
        next: () => {
          this.loadTrainings();
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
