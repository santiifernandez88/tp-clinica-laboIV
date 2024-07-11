import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaHoraFormat',
  standalone: true
})
export class FechaHoraFormatPipe implements PipeTransform {

  transform(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${year}-${month}-${day}`;
  }
}
