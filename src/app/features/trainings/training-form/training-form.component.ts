import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {User, UserRole} from '@core/models/user.model';
import {Court} from '@core/models/court.model';
import {TrainingService} from '@core/services/training.service';
import {UserService} from '@core/services/user.service';
import {TrainingStatus} from '@core/models/training.model';
import {BehaviorSubject, combineLatest, map} from 'rxjs';
import {ITimeSlot, ITrainingFormData} from '@features/trainings/training-form/training.form';
import {CourtsService} from '@core/services/court.service';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.css']
})
export class TrainingFormComponent implements OnInit {
  trainingForm!: FormGroup;
  coaches: User[] = [];
  courts: Court[] = [];
  players: User[] = [];
  loading = false;
  submitted = false;
  errorMessage = '';

  // Pro reaktivní UI
  private selectedCoachSubject = new BehaviorSubject<number | null>(null);
  private selectedCourtSubject = new BehaviorSubject<number | null>(null);
  private selectedDateSubject = new BehaviorSubject<Date | null>(null);

  // Computed properties
  availableTimeSlots$ = combineLatest([
    this.selectedCoachSubject,
    this.selectedCourtSubject,
    this.selectedDateSubject
  ]).pipe(
    map(([coachId, courtId, date]) => {
      if (coachId && courtId && date) {
        return this.calculateAvailableTimeSlots(coachId, courtId, date);
      }
      return [];
    })
  );

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingService,
    private userService: UserService,
    private courtService: CourtsService,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.trainingForm = this.fb.group({
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      coachId: [null, [Validators.required]],
      courtId: [null, [Validators.required]],
      playerIds: [[]],
      price: [0, [Validators.required, Validators.min(0)]],
      notes: [''],
      maxPlayers: [6, [Validators.required, Validators.min(1), Validators.max(6)]],
      status: [TrainingStatus.PLANNED]
    });

    // Sledování změn pro výpočet ceny
    this.trainingForm.get('coachId')?.valueChanges.subscribe(id => {
      this.selectedCoachSubject.next(id);
      this.updatePrice();
    });

    this.trainingForm.get('courtId')?.valueChanges.subscribe(id => {
      this.selectedCourtSubject.next(id);
      this.updatePrice();
    });

    this.trainingForm.get('startTime')?.valueChanges.subscribe(date => {
      if (date) {
        this.selectedDateSubject.next(new Date(date));
      }
      this.updatePrice();
    });

    this.trainingForm.get('endTime')?.valueChanges.subscribe(() => {
      this.updatePrice();
    });

    this.trainingForm.get('playerIds')?.valueChanges.subscribe(() => {
      this.updatePrice();
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    console.log('Starting data load...');

    combineLatest([
      this.userService.getAllCoaches(),
      this.courtService.getAll(),
      this.userService.getAll()
    ]).subscribe({
      next: ([coaches, courts, users]) => {
        console.log('Raw courts before filter:', courts);

        // Temporary remove filter to check data
        this.courts = courts;
        /*
        this.courts = courts.filter(court => {
          console.log(`Court ${court.name}:`, {
            isActive: court.isActive,
            isAvailable: court.isAvailable
          });
          return court.isActive
        });
        */

        this.coaches = coaches.filter(coach => coach.isActive);
        this.players = users.filter(user =>
          user.role === UserRole.PLAYER && user.isActive
        );

        console.log('Final courts array:', this.courts);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Chyba při načítání dat';
        this.loading = false;
        console.error('Error loading data:', error);
      }
    });
  }

  private updatePrice(): void {
    const formValue = this.trainingForm.value;
    if (!formValue.startTime || !formValue.endTime || !formValue.coachId) return;

    const coach = this.coaches.find(c => c.id === formValue.coachId);
    const duration = this.calculateDurationInHours(
      new Date(formValue.startTime),
      new Date(formValue.endTime)
    );

    if (coach && coach.hourlyRate) {
      const basePrice = coach.hourlyRate * duration;
      const playerCount = formValue.playerIds?.length || 0;
      const pricePerPlayer = basePrice / (playerCount || 1);

      this.trainingForm.patchValue({
        price: Math.round(pricePerPlayer)
      }, {emitEvent: false});
    }
  }

  private calculateDurationInHours(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  private calculateAvailableTimeSlots(coachId: number, courtId: number, date: Date): Promise<ITimeSlot[]> {
    // Implementace výpočtu dostupných časových slotů
    // Toto by mělo být ideálně na backendu
    return Promise.resolve([]);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.trainingForm.valid) {
      this.loading = true;
      const formData: ITrainingFormData = this.trainingForm.value;

      // Debug log
      console.log('Odesílaná data:', formData);

      this.trainingService.create(formData).subscribe({
        next: () => {
          this.router.navigate(['/trainings']);
        },
        error: (error) => {
          // Detailnější logování chyby
          console.error('Chyba při vytváření tréninku:', error);
          if (error.error) {
            console.error('Server error:', error.error);
          }
          this.errorMessage = 'Chyba při vytváření tréninku: ' + (error.error?.message || error.message);
          this.loading = false;
        }
      });
    } else {
      // Log invalid form state
      console.log('Neplatný formulář:', {
        value: this.trainingForm.value,
        errors: this.trainingForm.errors,
        controls: Object.keys(this.trainingForm.controls).reduce((acc, key) => {
          acc[key] = this.trainingForm.get(key)?.errors;
          return acc;
        }, {} as any)
      });
    }
  }

  canDeactivate(): boolean {
    return !this.trainingForm.dirty || confirm('Máte neuložené změny. Chcete opravdu odejít?');
  }

  get selectedPlayersCount(): number {
    return this.trainingForm.get('playerIds')?.value?.length || 0;
  }

  isPlayerSelected(playerId: number): boolean {
    const selectedPlayers = this.trainingForm.get('playerIds')?.value || [];
    return selectedPlayers.includes(playerId);
  }

  togglePlayerSelection(playerId: number): void {
    const playerIds = this.trainingForm.get('playerIds');
    const currentSelection = playerIds?.value || [];
    const maxPlayers = this.trainingForm.get('maxPlayers')?.value || 6;

    if (this.isPlayerSelected(playerId)) {
      // Odstranění hráče
      const newSelection = currentSelection.filter((id: number) => id !== playerId);
      playerIds?.setValue(newSelection);
    } else {
      // Přidání hráče pokud není překročen limit
      if (currentSelection.length < maxPlayers) {
        playerIds?.setValue([...currentSelection, playerId]);
      } else {
        // Můžete přidat notifikaci o překročení limitu
        alert(`Maximální počet hráčů je ${maxPlayers}`);
      }
    }

    // Aktualizace ceny
    this.updatePrice();
  }
}
