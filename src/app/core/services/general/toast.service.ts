import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal<string | null>(null);

  show(msg: string, duration = 3000) {
    console.log('ToastService: show', msg);
    this.message.set(msg);
    setTimeout(() => this.message.set(null), duration);
  }
}
