import { Component, OnInit } from '@angular/core';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Especialista } from '../../../../interfaces/especialista';
import { TurnoService } from '../../../../services/turno.service';
import { EspecialistaService } from '../../../../services/especialista.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grafico-solicitados',
  standalone: true,
  imports: [NgxChartsModule, ReactiveFormsModule],
  templateUrl: './grafico-solicitados.component.html',
  styleUrl: './grafico-solicitados.component.css'
})
export class GraficoSolicitadosComponent implements OnInit{

  informacion: any[] = [];

  view: any = [1200, 400];

  titulo: string = 'Turnos Solcitados Por Médico';
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

  public especialistas : Especialista[] = [];
  dateRange: FormGroup;

  constructor(private fb: FormBuilder,private turnoService: TurnoService, private espService: EspecialistaService){
    this.dateRange = this.fb.group({
      start: [null],
      end: [null]
    });
  }

  ngOnInit(): void {
    // Obtener la lista de especialistas
   this.espService.obtenerEspecialistas().subscribe(especialistas => {
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
    this.turnoService.obtenerCantidadTurnosSolicitadosPorMedico(inicio, fin).subscribe(data => {
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
    const chartElement = document.getElementById('grafico-solicitados');
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
