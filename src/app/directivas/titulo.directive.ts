import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTitulo]',
  standalone: true
})
export class TituloDirective implements OnChanges{

  @Input('appTitulo') titulo!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.updateTitulo();
    }
  }

  private updateTitulo() {
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '1.2em');
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
    this.renderer.setStyle(this.el.nativeElement, 'text-shadow', '2px 2px 4px rgba(0, 0, 0, 0.5)');
  }

}
