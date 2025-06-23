import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fechaDDMMYYYY', standalone: true })
export class FechaDDMMYYYY implements PipeTransform {
  transform(value: string | Date): string {
    const d = new Date(value);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
