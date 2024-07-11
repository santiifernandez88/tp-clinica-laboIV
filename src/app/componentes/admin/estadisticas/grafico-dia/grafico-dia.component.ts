import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Turno } from '../../../../interfaces/turno';
import { TurnoService } from '../../../../services/turno.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-grafico-dia',
  standalone: true,
  imports: [NgxChartsModule, ],
  templateUrl: './grafico-dia.component.html',
  styleUrl: './grafico-dia.component.css'
})
export class GraficoDiaComponent implements OnInit{
  informacion: { name: string, value: number }[] = []; // Cambiado el tipo a coincidir con ngx-charts
  view: any = [1200, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Fechas';
  showYAxisLabel = true;
  yAxisLabel = 'Cantidad';
  titulo: string = 'Fechas';
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', 'purple', 'blue', 'brown'],
  };
  public turnos: Turno[] = [];
  public turnosPorFecha: { fecha: string; cantidad: number }[] = [];

  constructor(private tur: TurnoService) {}

  ngOnInit(): void {
    this.tur.traerTurnos().subscribe(turnos => {
      // Crear un objeto para agrupar los turnos por fecha
      const turnosPorFecha: { [key: string]: number } = turnos.reduce((acc, turno) => {
        if (!acc[turno.fecha]) {
          acc[turno.fecha] = 0;
        }
        acc[turno.fecha]++;
        return acc;
      }, {} as { [key: string]: number });

      // Convertir el objeto en un array para facilitar el manejo en la vista
      this.turnosPorFecha = Object.keys(turnosPorFecha).map(fecha => ({
        fecha,
        cantidad: turnosPorFecha[fecha]
      }));

      // Asignar los datos al formato esperado por ngx-charts
      this.informacion = this.turnosPorFecha.map(item => ({
        name: item.fecha,
        value: item.cantidad
      }));
    });
  }

  descargarExcel(): void {
    // Temporalmente cambiar las claves 'name' y 'value' para el Excel
    const excelData = this.informacion.map(item => ({
      fecha: item.name,
      cantidad: item.value
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Turnos-Por-Dia');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, fileName + '.xlsx');
  }

  descargarPDF() {
    setTimeout(() => {
      const chartElement = document.getElementById('grafico6');
    if (chartElement) {
      // Crear un clon del gráfico con fondo blanco
      const clonedElement = chartElement.cloneNode(true) as HTMLElement;
      document.body.appendChild(clonedElement);
      
      html2canvas(clonedElement, {
        scale: 10, // Aumentar la escala para mejorar la calidad
        logging: true, // Añadir logging para depurar
        useCORS: true, // Habilitar CORS para cargar imágenes externas
        allowTaint: true,
      }).then(canvas => {
        document.body.removeChild(clonedElement); // Eliminar el clon del gráfico

        setTimeout(() => {
          const imageData = canvas.toDataURL('image/png');

          const pdfDefinition: any = {
            content: [
              { text: 'Turnos por Día', style: 'header' },
              {
                image: imageData,
                width: 500, // Ajustar el ancho de la imagen en el PDF
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
  
          pdfMake.createPdf(pdfDefinition).download('turnos_por_dia.pdf');
        }, 1500);
       
      }).catch(error => {
        console.error('Error al generar la imagen del gráfico:', error);
      });
    }
    }, 1000);
    
  }
}




