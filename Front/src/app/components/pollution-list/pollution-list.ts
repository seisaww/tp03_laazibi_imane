import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollutionService } from '../../services/pollution.service';
import { Pollution } from '../../models/pollution.model';
import { Output, EventEmitter } from '@angular/core';
import { PollutionFrom } from '../pollution-form/pollution-from'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-liste-pollutions',
  imports: [CommonModule, PollutionFrom, RouterLink], 
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css'
})

export class PollutionList implements OnInit {
  pollutions: Pollution[] = [];
  filteredPollutions: Pollution[] = [];
  filterCriteria = {
    type: '',
    lieu: '',
    date: ''
  };

@Output() pollutionAEditer = new EventEmitter<Pollution>();
pollutionToEdit: Pollution | null = null;

constructor(private pollutionService: PollutionService) { }

ngOnInit(): void {
    this.loadPollutions(); 
 }

loadPollutions(): void {
  this.pollutionService.getPollutions().subscribe({
    next: (data) => {
      this.pollutions = data;
      this.applyFilters(); 
     },
      error: (error) => console.error('Erreur de chargement:', error)
    });
  }

applyFilters(): void {
  this.filteredPollutions = this.pollutions.filter(pollution => {
    const typeMatch = !this.filterCriteria.type || pollution.type === this.filterCriteria.type;
    const lieuMatch = !this.filterCriteria.lieu || 
    pollution.lieu.toLowerCase().includes(this.filterCriteria.lieu.toLowerCase());
    const dateMatch = !this.filterCriteria.date || pollution.date === this.filterCriteria.date;

    return typeMatch && lieuMatch && dateMatch;
     });
 }

handleFilterChange(key: 'type' | 'lieu' | 'date', event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement; 
    this.filterCriteria[key] = target.value;
    this.applyFilters();
  }

editPollution(pollution: Pollution): void {
    this.pollutionToEdit = pollution;
  }
  
  cancelEdit(): void {
    this.pollutionToEdit = null;
  }
  
  handlePollutionUpdated(updatedPollution: Pollution): void {
    const index = this.pollutions.findIndex(p => p.id === updatedPollution.id);
    if (index !== -1) {
      this.pollutions[index] = updatedPollution;
    }
    
    this.applyFilters(); 
    
    this.cancelEdit();
    
    alert(`Pollution ${updatedPollution.titre} modifiée avec succès.`);
  }
  get activeFilters(): { key: string, value: string }[] {
    const filters = [];
    if (this.filterCriteria.type) {
      filters.push({ key: 'Type', value: this.filterCriteria.type });
    }
    if (this.filterCriteria.lieu) {
      filters.push({ key: 'Lieu', value: this.filterCriteria.lieu });
    }
    if (this.filterCriteria.date) {
      filters.push({ key: 'Date', value: this.filterCriteria.date });
    }
    return filters;
  }

    resetFilters(): void {
    this.filterCriteria = {
      type: '',
      lieu: '',
      date: ''
    };
    
    this.applyFilters();
    
  }

deletePollution(id: string): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
    this.pollutionService.deletePollution(id).subscribe({
       next: () => {
        this.pollutions = this.pollutions.filter(p => p.id !== id);
        this.applyFilters();
      },
        error: (error) => console.error('Erreur suppression:', error)
      });
    }
  }
}

