import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GraficoDiaComponent } from "./grafico-dia/grafico-dia.component";
import { RouterLink } from '@angular/router';
import { GraficoEspecialidadComponent } from "./grafico-especialidad/grafico-especialidad.component";
import { GraficoFinalizadosComponent } from "./grafico-finalizados/grafico-finalizados.component";
import { GraficoSolicitadosComponent } from "./grafico-solicitados/grafico-solicitados.component";
import { GraficoLogsComponent } from "./grafico-logs/grafico-logs.component";

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, GraficoDiaComponent, RouterLink, GraficoEspecialidadComponent, GraficoFinalizadosComponent, GraficoSolicitadosComponent, GraficoLogsComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {

  public radio : string = '1';
}
