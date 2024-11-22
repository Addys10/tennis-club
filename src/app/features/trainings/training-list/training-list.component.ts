import {Component, OnInit} from '@angular/core';
import {Training} from '@core/models/training.model';
import {TrainingService} from '@core/services/training.service';

@Component({
  selector: 'app-training-list',
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Tréninky</h1>
        <button
          routerLink="create"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Nový trénink
        </button>
      </div>

      <div class="grid gap-4">
        <div *ngFor="let training of trainings"
             class="border rounded p-4 hover:shadow-lg transition">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-bold">
                {{ training.startTime | date:'dd.MM.yyyy HH:mm' }} -
                {{ training.endTime | date:'HH:mm' }}
              </p>
              <p>Trenér: {{ training.coach.firstName }} {{ training.coach.lastName }}</p>
              <p>Kurt: {{ training.court.name }}</p>
            </div>
            <div class="space-x-2">
              <span [class]="getStatusClass(training.status)"
                    class="px-2 py-1 rounded text-sm">
                {{ training.status }}
              </span>
              <button
                [routerLink]="[training.id]"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TrainingListComponent implements OnInit {
  trainings: Training[] = [];

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.trainingService.getAll().subscribe(
      trainings => this.trainings = trainings
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }
}