import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoDiaComponent } from './grafico-dia.component';

describe('GraficoDiaComponent', () => {
  let component: GraficoDiaComponent;
  let fixture: ComponentFixture<GraficoDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoDiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
