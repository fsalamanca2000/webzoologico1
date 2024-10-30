import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { formatDate } from '@angular/common';

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
  updateAnimalEntry() {
    //Removiendo valores vacios del formulario de actualización
    for (let key in this.animalForm.value) {
      if (this.animalForm.value[key] === '') {
        this.animalForm.removeControl(key);
      }
    }
    this.animalService.updateAnimal(this.idAnimal, this.animalForm.value).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Animal editado");
      }
    );
  }
  getValidDate(fecha: Date) {
    const fechaFinal: Date = new Date(fecha);
    //separado los datos
    var dd = fechaFinal.getDate() + 1;//fue necesario porque siempre daba un día antes
    var mm = fechaFinal.getMonth() + 1; //porque Enero es 0
    var yyyy = fechaFinal.getFullYear();
    var mes = '';
    var dia = '';
    //Como algunos meses tienen 31 días dd puede dar 32
    if (dd == 32) {
      dd = 1;
      mm++;
    }
    //Transformación de fecha cuando el día o mes son menores a 10
    //se le coloca un cero al inicio
    //Día
    if (dd < 10) {
      dia += `0${dd}`;
    } else {
      dia += `${dd}`;
    }
    //Mes
    if (mm < 10) {
      mes += `0${mm}`;
    } else {
      mes += `${mm}`;
    }
    //formatDate para colocar la fecha en un formato aceptado por el calendario
    //GMT-0500 es para Colombia
    var finalDate = formatDate(new Date(yyyy + '-' + mes + '-' + dia + ' GMT-0500'), 'yyyy-MM-dd', "en-US");
    return finalDate;
  }
  toggleEditAnimal(id: any) {
    this.idAnimal = id;
    console.log(this.idAnimal)
    this.animalService.getOneAnimal(id).subscribe(
      data => {
        this.animalForm.setValue({
          nombre: data.nombre,
          edad: data.edad,
          tipo: data.tipo,
          fecha: this.getValidDate(data.fecha)
        });
      }
    );
    this.editableAnimal = !this.editableAnimal;
  }
  deleteAnimalEntry(id: any) {
    console.log(id)
    this.animalService.deleteAnimal(id).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Animal eliminado");
      }
    );
  }

}