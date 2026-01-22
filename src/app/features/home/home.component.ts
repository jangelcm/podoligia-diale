import { Component } from '@angular/core';
import { ContactComponent } from 'shared/components/contact/contact.component';
import { CommonModule } from '@angular/common';
import { CarouselComponent, CarouselItem } from '../../shared/components/carousel/carousel.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [ContactComponent, CommonModule, CarouselComponent,RouterLink],
})
export class HomeComponent {
  faqExpanded: { [key: number]: boolean } = {
    0: false,
    1: false,
    2: false,
    3: false
  };

  casosReales: CarouselItem[] = [
    {
      image: 'home/landing-pie.jpg',
      title: 'Tratamiento de Uñas Encarnadas',
      description: 'Curación exitosa con técnicas especializadas'
    },
    {
      image: 'home/landing-pie.jpg',
      title: 'Eliminación de Callos Plantares',
      description: 'Resultados inmediatos y duraderos'
    },
    {
      image: 'home/landing-pie.jpg',
      title: 'Tratamiento de Fascitis Plantar',
      description: 'Recuperación completa del paciente'
    },
    {
      image: 'home/landing-pie.jpg',
      title: 'Cuidado de Pie Diabético',
      description: 'Prevención y tratamiento especializado'
    },
    {
      image: 'home/landing-pie.jpg',
      title: 'Tratamiento de Hongos en Uñas',
      description: 'Protocolo avanzado con láser'
    },
    {
      image: 'home/landing-pie.jpg',
      title: 'Corrección de Uñas Deformadas',
      description: 'Técnicas ortopodológicas efectivas'
    }
  ];

  toggleFaq(index: number): void {
    this.faqExpanded[index] = !this.faqExpanded[index];
  }
}
