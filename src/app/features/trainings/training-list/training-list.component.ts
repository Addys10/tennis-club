import {Component, OnInit} from '@angular/core';
import {Training} from '@core/models/training.model';
import {TrainingService} from '@core/services/training.service';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css']
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
    const statusMap: { [key: string]: string } = {
      'PLANNED': 'status-planned',
      'CONFIRMED': 'status-confirmed',
      'CANCELLED': 'status-cancelled',
      'COMPLETED': 'status-completed'
    };

    return `badge ${statusMap[status] || 'status-planned'}`;
  }
}
