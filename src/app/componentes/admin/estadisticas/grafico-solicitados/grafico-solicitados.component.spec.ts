import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoSolicitadosComponent } from './grafico-solicitados.component';

describe('GraficoSolicitadosComponent', () => {
  let component: GraficoSolicitadosComponent;
  let fixture: ComponentFixture<GraficoSolicitadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoSolicitadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoSolicitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
