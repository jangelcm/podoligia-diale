import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ContactComponent } from 'shared/components/contact/contact.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarouselComponent, CarouselItem } from '../../shared/components/carousel/carousel.component';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [ContactComponent, CommonModule, CarouselComponent,RouterLink],
})
export class HomeComponent implements OnInit {
  faqExpanded: { [key: number]: boolean } = {
    0: false,
    1: false,
    2: false,
    3: false
  };

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.setSEOTags();
    this.addStructuredData();
  }

  private setSEOTags(): void {
    // Title
    this.title.setTitle('Clínica Diale - Podología Especializada en San Juan de Miraflores | Atención a Domicilio');
    
    // Meta tags
    this.meta.updateTag({ name: 'description', content: 'Clínica de podología profesional en SJM. Tratamiento de pie diabético, uñas encarnadas, callos, fascitis plantar. Atención a domicilio. ¡Agenda tu cita ahora!' });
    this.meta.updateTag({ name: 'keywords', content: 'podología Lima, podólogo San Juan de Miraflores, pie diabético, uñas encarnadas, callos plantares, podología a domicilio, tratamiento pie diabético, cuidado del pie, productos podológicos, agenda cita podólogo' });
    
    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Clínica Diale - Podología Especializada en Lima' });
    this.meta.updateTag({ property: 'og:description', content: 'Especialistas en cuidado del pie. Tratamiento de pie diabético, uñas encarnadas, callos. Atención a domicilio en Lima. ¡Agenda tu cita!' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://www.clinicadiale.com/' });
  }

  private addStructuredData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'MedicalBusiness',
            '@id': 'https://www.clinicadiale.com/#medicalbusiness',
            name: 'Clínica Diale',
            image: 'https://www.clinicadiale.com/home/landing-pie.jpg',
            url: 'https://www.clinicadiale.com/',
            telephone: '+51916541671',
            email: 'angui.bamc@gmail.com',
            priceRange: '$$',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Calle los lirios Mz H Lt. 18 - Villa del Sur',
              addressLocality: 'San Juan de Miraflores',
              addressRegion: 'Lima',
              postalCode: '15801',
              addressCountry: 'PE'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: -12.1667,
              longitude: -76.9667
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '09:00',
                closes: '18:00'
              }
            ],
            sameAs: [
              'https://www.instagram.com/dialepodologia22',
              'https://www.tiktok.com/@diale.podologia'
            ]
          },
          {
            '@type': 'Service',
            '@id': 'https://www.clinicadiale.com/#service',
            serviceType: 'Podología',
            provider: {
              '@id': 'https://www.clinicadiale.com/#medicalbusiness'
            },
            areaServed: {
              '@type': 'City',
              name: 'Lima'
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Servicios de Podología',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Tratamiento de Pie Diabético',
                    description: 'Atención especializada para el cuidado y tratamiento del pie diabético'
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Tratamiento de Uñas Encarnadas',
                    description: 'Procedimientos profesionales para uñas encarnadas'
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Eliminación de Callos y Durezas',
                    description: 'Tratamiento especializado para callos plantares y durezas'
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Podología a Domicilio',
                    description: 'Servicio de atención podológica en la comodidad de tu hogar'
                  }
                }
              ]
            }
          }
        ]
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }

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
