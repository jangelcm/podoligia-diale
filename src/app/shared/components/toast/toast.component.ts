import { Component } from '@angular/core';
import { ToastService } from 'core/services/general/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  constructor(public toast: ToastService) {
    console.log('ToastComponent initialized');
  }
}
