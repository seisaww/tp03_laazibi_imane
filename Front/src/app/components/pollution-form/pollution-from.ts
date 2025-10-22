import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { Pollution } from '../../models/pollution.model';
import { PollutionService } from '../../services/pollution.service';

@Component({
  selector: 'app-pollution-from',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-from.html',
  styleUrl: './pollution-from.css'
})
export class PollutionFrom implements OnInit {
  
  @Input() pollutionAEditer?: Pollution;
  @Output() pollutionDeclaree = new EventEmitter<Pollution>();
  @Output() annulerModification = new EventEmitter<void>();

  formulaire: FormGroup; 
  
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private pollutionService: PollutionService
  ) {
    this.formulaire = this.fb.group({
      id: new FormControl<string | null>(null),
      titre: new FormControl<string>('', Validators.required),
      type: new FormControl<string>('', Validators.required),
      description: new FormControl<string>('', Validators.required),
      date: new FormControl<string>('', Validators.required),
      lieu: new FormControl<string>('', Validators.required),
      latitude: new FormControl<number>(0, Validators.required),
      longitude: new FormControl<number>(0, Validators.required),
      photo: new FormControl<string | null>(null)
    });
  }

  ngOnInit(): void {
    if (this.pollutionAEditer) {
      this.isEditMode = true;
      // Remplit "formulaire"
      this.formulaire.patchValue(this.pollutionAEditer);
    }
  }

  send(): void {
    if (this.formulaire.invalid) {
      return; 
    }

    const formValue = this.formulaire.value;
    const id = formValue.id;

    const pollutionData = {
      titre: formValue.titre || '',
      type: formValue.type || '',
      description: formValue.description || '',
      date: formValue.date || '',
      lieu: formValue.lieu || '',
      latitude: formValue.latitude || 0,
      longitude: formValue.longitude || 0,
      photo: formValue.photo || undefined
    };

    let pollutionRequest: Observable<Pollution>;

    if (id) {
      // Mode Édition
      const pollutionToUpdate: Pollution = { ...pollutionData, id: id };
      pollutionRequest = this.pollutionService.updatePollution(pollutionToUpdate);
    } else {
      // Mode Création
      pollutionRequest = this.pollutionService.addPollution(pollutionData);
    }

    pollutionRequest.subscribe({
      next: (savedPollution) => {
        console.log('Pollution sauvegardée avec succès !', savedPollution);
        this.pollutionDeclaree.emit(savedPollution);
        if (!this.isEditMode) {
          this.resetForm();
        }
      },
      error: (err) => console.error('Erreur lors de la sauvegarde', err)
    });
  }

  resetForm(): void {
    this.formulaire.reset();
  }

  onCancel(): void {
    this.annulerModification.emit();
  }
}