import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Training} from '@core/models/training.model';
import {TrainingService} from '@core/services/training.service';

@Component({
  selector: 'app-training-detail',
  template: `
    <div class="container mx-auto p-4" *ngIf="training">
      <div class="max-w-3xl mx-auto bg-white shadow rounded-lg">
        <!-- Hlavička -->
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">Detail tréninku</h1>
            <span [class]="getStatusClass(training.status)"
                  class="px-3 py-1 rounded-full text-sm">
              {{ training.status }}
            </span>
          </div>
        </div>

        <!-- Základní informace -->
        <div class="p-6 border-b">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-500">Čas</h3>
              <p class="mt-1">
                {{ training.startTime | date:'dd.MM.yyyy HH:mm' }} -
                {{ training.endTime | date:'HH:mm' }}
              </p>
            </div>
            <div>
              <h3 class="font-medium text-gray-500">Kurt</h3>
              <p class="mt-1">{{ training.court.name }}</p>
            </div>
          </div>
        </div>

        <!-- Trenér -->
        <div class="p-6 border-b">
          <h3 class="font-medium text-gray-500">Trenér</h3>
          <div class="mt-2 flex items-center">
            <div>
              <p class="font-medium">
                {{ training.coach.firstName }} {{ training.coach.lastName }}
              </p>
              <p class="text-sm text-gray-500">{{ training.coach.email }}</p>
            </div>
          </div>
        </div>

        <!-- Hráči -->
        <div class="p-6 border-b">
          <h3 class="font-medium text-gray-500 mb-2">Hráči</h3>
          <div class="space-y-2">
            <div *ngFor="let player of training.players"
                 class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div>
                <p class="font-medium">
                  {{ player.firstName }} {{ player.lastName }}
                </p>
                <p class="text-sm text-gray-500">{{ player.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Další informace -->
        <div class="p-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-500">Cena</h3>
              <p class="mt-1">{{ training.price }} Kč</p>
            </div>
            <div>
              <h3 class="font-medium text-gray-500">Poznámky</h3>
              <p class="mt-1">{{ training.notes || 'Žádné poznámky' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TrainingDetailComponent implements OnInit {
  training: Training | null = null;

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingService
  ) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trainingService.getById(+id).subscribe(
        training => this.training = training
      );
    }
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
