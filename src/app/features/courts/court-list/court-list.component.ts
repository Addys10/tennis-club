import {Component, OnInit} from '@angular/core';
import {Court} from '@core/models/court.model';
import {CourtsService} from '@core/services/court.service';

@Component({
  selector: 'app-court-list',
  templateUrl: './court-list.component.html',
  styleUrls: ['./court-list.component.css']
})
export class CourtsListComponent implements OnInit {
  courts: Court[] = [];

  constructor(private courtsService: CourtsService) {}

  ngOnInit() {
    this.loadCourts();
  }

  loadCourts() {
    this.courtsService.getAll().subscribe(
      courts => this.courts = courts
    );
  }

  toggleAvailability(court: Court) {
    this.courtsService.updateCourtAvailability(court.id, !court.isAvailable)
      .subscribe(() => {
        court.isAvailable = !court.isAvailable;
      });
  }
}
