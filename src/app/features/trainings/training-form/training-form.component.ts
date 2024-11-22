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
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Nový trénink</h2>

        <form [formGroup]="trainingForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Datum a čas -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Začátek</label>
              <input type="datetime-local"
                     formControlName="startTime"
                     class="w-full border rounded px-3 py-2">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Konec</label>
              <input type="datetime-local"
                     formControlName="endTime"
                     class="w-full border rounded px-3 py-2">
            </div>
          </div>

          <!-- Trenér -->
          <div>
            <label class="block text-sm font-medium mb-1">Trenér</label>
            <select formControlName="coachId"
                    class="w-full border rounded px-3 py-2">
              <option [ngValue]="null">Vyberte trenéra</option>
              <option *ngFor="let coach of coaches"
                      [value]="coach.id">
                {{ coach.firstName }} {{ coach.lastName }}
              </option>
            </select>
          </div>

          <!-- Kurt -->
          <div>
            <label class="block text-sm font-medium mb-1">Kurt</label>
            <select formControlName="courtId"
                    class="w-full border rounded px-3 py-2">
              <option [ngValue]="null">Vyberte kurt</option>
              <option *ngFor="let court of courts"
                      [value]="court.id">
                {{ court.name }}
              </option>
            </select>
          </div>

          <!-- Hráči -->
          <div>
            <label class="block text-sm font-medium mb-1">Hráči</label>
            <select multiple formControlName="playerIds"
                    class="w-full border rounded px-3 py-2">
              <option *ngFor="let player of players"
                      [value]="player.id">
                {{ player.firstName }} {{ player.lastName }}
              </option>
            </select>
          </div>

          <!-- Cena -->
          <div>
            <label class="block text-sm font-medium mb-1">Cena</label>
            <input type="number"
                   formControlName="price"
                   class="w-full border rounded px-3 py-2">
          </div>

          <!-- Poznámky -->
          <div>
            <label class="block text-sm font-medium mb-1">Poznámky</label>
            <textarea formControlName="notes"
                      class="w-full border rounded px-3 py-2 h-24"></textarea>
          </div>

          <!-- Tlačítka -->
          <div class="flex justify-end space-x-4">
            <button type="button"
                    routerLink="/trainings"
                    class="px-4 py-2 border rounded hover:bg-gray-100">
              Zrušit
            </button>
            <button type="submit"
                    [disabled]="!trainingForm.valid"
                    class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50">
              Vytvořit
            </button>
          </div>
        </form>
      </div>
    </div>
  `
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
    // Inicializace formuláře v constructoru
    this.trainingForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      coachId: [null, Validators.required],
      courtId: [null, Validators.required],
      playerIds: [[]],
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
