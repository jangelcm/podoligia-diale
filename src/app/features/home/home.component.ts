import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactComponent } from 'shared/components/contact/contact.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [ContactComponent, RouterLink],
})
export class HomeComponent {}
