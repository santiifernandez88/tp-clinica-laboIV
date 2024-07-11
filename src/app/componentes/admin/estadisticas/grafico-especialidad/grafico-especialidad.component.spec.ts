import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoEspecialidadComponent } from './grafico-especialidad.component';

describe('GraficoEspecialidadComponent', () => {
  let component: GraficoEspecialidadComponent;
  let fixture: ComponentFixture<GraficoEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoEspecialidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
