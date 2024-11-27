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
  loading = false;
  error?: string;

  constructor(private courtsService: CourtsService) {
  }

  ngOnInit(): void {
    this.loadCourts();
  }

  loadCourts(): void {
    this.loading = true;
    this.error = undefined;

    this.courtsService.getAll().subscribe({
      next: (courts) => {
        this.courts = courts;
        this.loading = false;
      },
      error: () => {
        this.error = 'Chyba při načítání kurtů';
        this.loading = false;
      }
    });
  }

  toggleAvailability(court: Court, event: Event): void {
    event.stopPropagation();

    this.courtsService.updateCourtAvailability(court.id, !court.isAvailable)
      .subscribe({
        next: () => {
          court.isAvailable = !court.isAvailable;
        },
        error: () => {
          this.error = 'Chyba při změně dostupnosti kurtu';
        }
      });
  }

  getSurfaceLabel(surface: string): string {
    const surfaces = {
      clay: 'Antuka',
      hard: 'Tvrdý',
      grass: 'Tráva'
    };
    return surfaces[surface as keyof typeof surfaces] || surface;
  }
}
