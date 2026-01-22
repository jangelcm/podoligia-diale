// src/app/shared/directives/click-outside.directive.ts
import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<void>();

  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        const clickedInside = this.elementRef.nativeElement.contains(
          event.target
        );
        if (!clickedInside) {
          this.appClickOutside.emit();
        }
      });
  }
}
