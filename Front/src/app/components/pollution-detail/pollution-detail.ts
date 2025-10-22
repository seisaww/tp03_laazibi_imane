import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { Pollution } from '../../models/pollution.model';
import { PollutionService } from '../../services/pollution.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [DatePipe, RouterLink], 
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.css'
})
export class PollutionDetail implements OnInit {

  pollution: Pollution | undefined;

  constructor(
    private route: ActivatedRoute,
    private pollutionService: PollutionService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadPollution(id);
    } else {
      console.error("Aucun ID trouvé dans l'URL");
    }
  }

loadPollution(id: string): void { 
  this.pollutionService.getPollutionById(id).subscribe({
    
    next: (data: Pollution | undefined) => {
      this.pollution = data; 
    },
    error: (error: any) => {
      console.error('Erreur lors du chargement de la pollution:', error);
    }
  }); 
}
}