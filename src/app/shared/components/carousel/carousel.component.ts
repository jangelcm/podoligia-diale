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
  animationClass = '';
  private autoPlayInterval?: any;
  private touchStartX = 0;
  private touchEndX = 0;
  private isTouching = false;
  private readonly swipeThreshold = 50;

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
    if (!this.items.length) {
      return;
    }
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.triggerAnimation('next');
  }

  prev(): void {
    if (!this.items.length) {
      return;
    }
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.triggerAnimation('prev');
  }

  goToSlide(index: number): void {
    if (!this.items.length) {
      return;
    }
    this.currentIndex = index;
    this.triggerAnimation('next');
    // Reiniciar el autoplay cuando se navega manualmente
    if (this.autoPlay) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  getVisibleItems(): CarouselItem[] {
    if (!this.items.length) {
      return [];
    }
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
    if (!this.items.length) {
      return 0;
    }
    return (this.currentIndex + offset) % this.items.length;
  }

  onTouchStart(event: TouchEvent): void {
    if (!this.items.length) {
      return;
    }
    this.isTouching = true;
    this.touchStartX = event.touches[0].clientX;
    if (this.autoPlay) {
      this.stopAutoPlay();
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isTouching) {
      return;
    }
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd(): void {
    if (!this.isTouching) {
      return;
    }
    const deltaX = this.touchStartX - this.touchEndX;
    if (Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
    this.isTouching = false;
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  private triggerAnimation(direction: 'next' | 'prev'): void {
    this.animationClass = direction === 'next' ? 'slide-next' : 'slide-prev';
    setTimeout(() => {
      this.animationClass = '';
    }, 500);
  }
}
