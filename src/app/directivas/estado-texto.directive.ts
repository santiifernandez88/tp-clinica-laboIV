import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appEstadoTexto]',
  standalone: true
})
export class EstadoTextoDirective implements OnChanges{

  @Input('appEstadoTexto') estado!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.updateTextColor();
    }
  }

  private updateTextColor() {
    switch (this.estado) {
      case 'cancelado':
        this.renderer.setStyle(this.el.nativeElement, 'color', 'purple');
        break;
      case 'aceptado':
        this.renderer.setStyle(this.el.nativeElement, 'color', 'green');
        break;
      case 'rechazado':
        this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
        break;
      case 'finalizado':
        this.renderer.setStyle(this.el.nativeElement, 'color', 'orange');
        break;
      default:
        this.renderer.setStyle(this.el.nativeElement, 'color', 'skyblue');
        break;
    }
  }

}
