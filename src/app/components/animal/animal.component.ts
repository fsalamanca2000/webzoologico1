import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'] // Corrige 'styleUrl' a 'styleUrls'
})
export class AnimalComponent implements OnInit { // Asegúrate de implementar OnInit
  animalList: any = [];
  animalForm: FormGroup; // Cambia el tipo a FormGroup
  editableAnimal: boolean = false;
  idAnimal: any;

  constructor(
    private animalService: AnimalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Inicializa el FormGroup aquí
    this.animalForm = this.formBuilder.group({
      nombre: '',
      edad: 0,
      tipo: '',
      fecha: ''
    });
  }

  ngOnInit() {
    this.getAllAnimals();
  }

  getAllAnimals() {
    this.animalService.getAllAnimalsData().subscribe((data: {}) => {
      this.animalList = data;
    });
  }

  newAnimalEntry() {
    if (this.animalForm.valid) { // Verifica que el formulario sea válido
      this.animalService.newAnimal(this.animalForm.value).subscribe(() => {
        this.router.navigate(['/animal']).then(() => {
          this.newMessage('Registro exitoso');
        });
      });
    } else {
      this.toastr.error('Por favor, completa el formulario correctamente.');
    }
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }
}