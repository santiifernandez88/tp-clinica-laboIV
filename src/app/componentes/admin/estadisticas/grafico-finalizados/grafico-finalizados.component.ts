import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../../../services/turno.service';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import html2canvas from 'html2canvas';
import { EspecialistaService } from '../../../../services/especialista.service';
import { Especialista } from '../../../../interfaces/especialista';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-grafico-finalizados',
  standalone: true,
  imports: [NgxChartsModule, ReactiveFormsModule],
  templateUrl: './grafico-finalizados.component.html',
  styleUrl: './grafico-finalizados.component.css'
})
export class GraficoFinalizadosComponent implements OnInit{

  informacion: any[] = [];
  especialistas: Especialista[] = [];

  view: any = [1200, 400];

  titulo: string = 'Turnos Solicitado por Médico';
  gradient: boolean = false;
  showLegend: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Right;
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Médico';
  yAxisLabel: string = 'Cantidad de Turnos';

  dateRange: FormGroup;

  constructor(private fb: FormBuilder, private turnoService: TurnoService, private especialistaService: EspecialistaService) {
    this.dateRange = this.fb.group({
      start: [null],
      end: [null]
    });
  }

  ngOnInit(): void {
    this.especialistaService.obtenerEspecialistas().subscribe(especialistas => {
      this.especialistas = especialistas;
    });
  }

  filtrarTurnosDesdeBoton(): void {
    const inicio = this.convertirFecha(this.dateRange.value.start);
    const fin = this.convertirFecha(this.dateRange.value.end);

    console.log(inicio);
    console.log(fin);
    if (!inicio || !fin) {
      console.error('Debe seleccionar ambas fechas.');
      return;
    }

    this.filtrarTurnos(inicio, fin);
  }

  filtrarTurnos(inicio: string, fin: string): void {
    this.turnoService.obtenerCantidadTurnosFinalizadosPorMedicoEnTiempo(inicio, fin).subscribe(data => {
      this.informacion = data.map(item => ({
        name: this.getEspecialista(item.medico),
        value: item.cantidad
      }));
    });
  }

  convertirFecha(fecha: string): string | null {
    if (!fecha) return null;
    const partes = fecha.split('-');
    if (partes.length !== 3) return null;
    const anio = partes[0];
    const mes = partes[1].replace(/^0+/, ''); // Eliminar ceros iniciales
    const dia = partes[2];
    return `${dia}/${mes}/${anio}`;
  }

  getEspecialista(email: string): string {
    const especialista = this.especialistas.find(esp => esp.mail === email);
    return especialista ? `${especialista.nombre} ${especialista.apellido}` : '';
  }

  descargarExcel(): void {
    const excelData = this.informacion.map(item => ({
      medico: item.name,
      cantidad: item.value
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Turnos-Por-Medico-Solicitado');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, fileName + '.xlsx');
  }

  descargarPDF(): void {
    const chartElement = document.getElementById('grafico-finalizados');
    if (chartElement) {
      const clonedElement = chartElement.cloneNode(true) as HTMLElement;
      document.body.appendChild(clonedElement);

      html2canvas(clonedElement, {
        scale: 10,
        logging: true,
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        document.body.removeChild(clonedElement);
        const imageData = canvas.toDataURL('image/png');
        const pdfDefinition: any = {
          content: [
            { text: 'Turnos finalizados por médico en el rango seleccionado', style: 'header' },
            {
              image: imageData,
              width: 500,
            }
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [0, 0, 0, 10]
            }
          }
        };

        pdfMake.createPdf(pdfDefinition).download('turnos_por_medico_finalizado.pdf');
      }).catch(error => {
        console.error('Error al generar la imagen del gráfico:', error);
      });
    }
  }
}
