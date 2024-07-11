import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appEstadoTurno]',
  standalone: true
})
export class EstadoTurnoDirective implements OnChanges {
  @Input('appEstadoTurno') estados: boolean[] = [false, false, false, false];

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      const [cancelado, aceptado, rechazado, finalizado] = this.estados;
      if (cancelado) {
        this.renderer.setStyle(this.el.nativeElement, 'border', '5px solid purple');
      } else if (aceptado && !finalizado) {
        this.renderer.setStyle(this.el.nativeElement, 'border', '5px solid green');
      } else if (rechazado) {
        this.renderer.setStyle(this.el.nativeElement, 'border', '5px solid red');
      } else if (finalizado) {
        this.renderer.setStyle(this.el.nativeElement, 'border', '5px solid orange');
      } else if (!cancelado && !aceptado && !rechazado && !finalizado) {
        this.renderer.setStyle(this.el.nativeElement, 'border', '5px solid skyblue');
      }
    }
  }
}
