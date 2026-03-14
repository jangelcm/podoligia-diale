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
  imports: [ContactComponent, CommonModule, CarouselComponent, RouterLink],
})
export class HomeComponent implements OnInit {
  showMore: boolean = false;

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
  ) { }

  ngOnInit(): void {
    this.setSEOTags();
    this.addStructuredData();
  }

  private setSEOTags(): void {
    // Title
    this.title.setTitle('Diale Podología en Lima | Clínica Especializada en Cuidado del Pie');

    // Meta tags
    this.meta.updateTag({ name: 'description', content: 'Diale Podología: clínica podológica en Lima. Especialistas en hongos, uñas encarnadas, callos, fascitis plantar y cuidado del pie. Atención en San Juan de Miraflores y a domicilio.' });
    this.meta.updateTag({ name: 'keywords', content: 'podología Lima, podólogo en Lima, clínica podológica, cuidado del pie, pie diabético, uñas encarnadas, hongos, callos plantares, fascitis plantar, juanetes, podología a domicilio' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: 'Diale Podología | Clínica Especializada en Cuidado del Pie' });
    this.meta.updateTag({ property: 'og:description', content: 'Especialistas en podología clínica y estética. Tratamiento de hongos, uñas encarnadas, callos. Atención profesional a domicilio.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://dialepodologia.com/' });
    this.meta.updateTag({ property: 'og:image', content: 'https://dialepodologia.com/home/imagen-principal.png' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Diale Podología' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://dialepodologia.com/home/imagen-principal.png' });
  }

  private addStructuredData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'MedicalBusiness',
            '@id': 'https://dialepodologia.com/#medicalbusiness',
            name: 'Diale Podología',
            image: 'https://dialepodologia.com/home/imagen-principal.png',
            url: 'https://dialepodologia.com/',
            telephone: '+51903379990',
            email: 'dialepodo22@gmail.com',
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
            '@id': 'https://dialepodologia.com/#service',
            serviceType: 'Podología',
            provider: {
              '@id': 'https://dialepodologia.com/#medicalbusiness'
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
      image: 'home/ofertaPodologia.jpg',
      title: 'Atención a Domicilio',
      description: 'Comodidad y profesionalismo en tu hogar'
    },
    {
      image: 'carrusel/portada1.jpeg',
      title: 'Tratamiento de Uñas Encarnadas',
      description: 'Curación exitosa con técnicas especializadas'
    },
    {
      image: 'carrusel/portada2.jpeg',
      title: 'Eliminación de Callos Plantares',
      description: 'Resultados inmediatos y duraderos'
    },
    {
      image: 'carrusel/portada3.jpeg',
      title: 'Tratamiento de Fascitis Plantar',
      description: 'Recuperación completa del paciente'
    }

  ];

  treatments: { title: string; description: string; icon?: string }[] = [
    { title: 'Atención a Domicilio', description: 'Comodidad total sin salir de casa', icon: 'icons/home.webp' },
    { title: 'Uñas Encarnadas & Callos', description: 'Alivio inmediato garantizado', icon: 'icons/encarnada.png' },
    { title: 'Tratamiento Láser Avanzado', description: 'Elimina hongos sin dolor', icon: 'icons/laser.jfif' },
    { title: 'Productos Premium', description: 'Lo mejor para el cuidado diario', icon: 'icons/laca-antimicotica.jpg' }
  ];

  toggleFaq(index: number): void {
    this.faqExpanded[index] = !this.faqExpanded[index];
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore;
  }
}
