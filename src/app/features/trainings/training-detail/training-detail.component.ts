import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Training, TrainingStatus } from '@core/models/training.model';
import { TrainingService } from '@core/services/training.service';

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.css']
})
export class TrainingDetailComponent implements OnInit {
  training: Training | null = null;
  TrainingStatus = TrainingStatus;

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTraining(+id);
    }
  }

  private loadTraining(id: number): void {
    this.trainingService.getById(id).subscribe({
      next: (training) => this.training = training,
      error: (error) => console.error('Chyba při načítání tréninku:', error)
    });
  }

  getStatusClass(status: TrainingStatus): string {
    const statusClasses = {
      [TrainingStatus.PLANNED]: 'status-planned',
      [TrainingStatus.CONFIRMED]: 'status-confirmed',
      [TrainingStatus.CANCELLED]: 'status-cancelled',
      [TrainingStatus.COMPLETED]: 'status-completed'
    };
    return statusClasses[status] || 'status-planned';
  }
}
