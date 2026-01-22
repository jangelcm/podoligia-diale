import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CarouselItem {
  image: string;
  title: string;
  description?: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() items: CarouselItem[] = [];
  @Input() autoPlay: boolean = true;
  @Input() interval: number = 4000; // 4 segundos por defecto

  currentIndex = 0;
  private autoPlayInterval?: any;

  ngOnInit(): void {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, this.interval);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    // Reiniciar el autoplay cuando se navega manualmente
    if (this.autoPlay) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  getVisibleItems(): CarouselItem[] {
    // En pantallas grandes mostramos 3 items a la vez
    const visibleCount = 3;
    const items = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (this.currentIndex + i) % this.items.length;
      items.push(this.items[index]);
    }
    
    return items;
  }

  getItemIndex(offset: number): number {
    return (this.currentIndex + offset) % this.items.length;
  }
}
