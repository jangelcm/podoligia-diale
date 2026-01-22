import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  phone = '916 541 671';
  email = 'angui.bamc@gmail.com';
  address = 'Calle los lirios mz H lt 18 - Villa del Sur - SJM';
  
  socialLinks = [
    { icon: 'instagram', url: 'https://www.instagram.com/dialepodologia22', label: 'Instagram' },
    { icon: 'tiktok', url: 'https://www.tiktok.com/@diale.podologia', label: 'TikTok' },
    { icon: 'whatsapp', url: 'https://wa.me/916541671', label: 'WhatsApp' }
  ];

  callPhone() {
    window.location.href = `tel:${this.phone.replace(/\D/g, '')}`;
  }
}
