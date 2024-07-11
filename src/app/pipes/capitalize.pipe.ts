import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true
})
export class CapitalizePipe implements PipeTransform {

  transform(value: any): unknown 
  {

    let mensajeAux = ""

    for (let i = 0; i < value.length; i++) {
      const letra = value[i];
    
      if(letra === letra.toUpperCase() || i === 0)
      {
        if(i !== 0)
        {
          mensajeAux+= " "
        }    
        mensajeAux += letra.toUpperCase();
      }
      else
      {
        mensajeAux += letra;
      }
    }
    
    return mensajeAux;

  }

}
