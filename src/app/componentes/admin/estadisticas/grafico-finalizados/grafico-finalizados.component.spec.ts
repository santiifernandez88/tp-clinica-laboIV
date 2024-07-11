import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoFinalizadosComponent } from './grafico-finalizados.component';

describe('GraficoFinalizadosComponent', () => {
  let component: GraficoFinalizadosComponent;
  let fixture: ComponentFixture<GraficoFinalizadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoFinalizadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoFinalizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
