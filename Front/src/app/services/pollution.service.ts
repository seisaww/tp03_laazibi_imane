import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 
import { Pollution } from '../models/pollution.model';
import { POLLUTIONS_DATA } from '../data/mock-pollution'; 

@Injectable({
  providedIn: 'root'
})
export class PollutionService {
  
  private pollutions: Pollution[] = POLLUTIONS_DATA;

  constructor() { }

  addPollution(pollutionData: Omit<Pollution, 'id'>): Observable<Pollution> {
    
    const newPollution: Pollution = {
      ...pollutionData,
      id: this.generateMockId() 
    };
    this.pollutions.push(newPollution);
    console.log("Service: Ajout du mock", newPollution);
    return of(newPollution);
  }

  getPollutions(): Observable<Pollution[]> {
    console.log("Service: Renvoi des mocks intégrés");
    return of(this.pollutions); 
  }

  deletePollution(id: string): Observable<{}> {
    this.pollutions = this.pollutions.filter(p => p.id !== id);
    console.log("Service: Suppression du mock ID:", id);
    return of({}); 
  }

  
  getPollutionById(id: string): Observable<Pollution | undefined> {
    const pollution = this.pollutions.find(p => p.id === id);
    console.log("Service: Recherche du mock ID:", id, "Trouvé:", pollution);
    return of(pollution); 
  }
  updatePollution(updatedPollution: Pollution): Observable<Pollution> {
    const index = this.pollutions.findIndex(p => p.id === updatedPollution.id);
    if (index !== -1) {
      this.pollutions[index] = updatedPollution;
      console.log("Service: Modification du mock", updatedPollution);
    }
    return of(updatedPollution);
  }
  
  private generateMockId(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}