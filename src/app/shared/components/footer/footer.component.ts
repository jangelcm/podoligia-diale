import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  phone = '903 379 990';
  email = 'dialepodo22@gmail.com';
  address = 'Calle los lirios mz H lt 18 - Villa del Sur - SJM';

  socialLinks = [
    { icon: 'instagram', url: 'https://www.instagram.com/dialepodologia22', label: 'Instagram' },
    { icon: 'tiktok', url: 'https://www.tiktok.com/@diale.podologia', label: 'TikTok' },
    { icon: 'whatsapp', url: 'https://wa.me/903379990', label: 'WhatsApp' }
  ];

  callPhone() {
    window.location.href = `tel:${this.phone.replace(/\D/g, '')}`;
  }
}
