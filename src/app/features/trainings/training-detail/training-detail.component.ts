import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Training} from '@core/models/training.model';
import {TrainingService} from '@core/services/training.service';

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.html']
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
