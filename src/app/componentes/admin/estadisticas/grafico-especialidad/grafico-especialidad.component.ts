import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { TurnoService } from '../../../../services/turno.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grafico-especialidad',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './grafico-especialidad.component.html',
  styleUrl: './grafico-especialidad.component.css'
})
export class GraficoEspecialidadComponent implements OnInit{
  
  single: any[] = [];
  view: any = [1200, 400];

  // Opciones del gráfico
  titulo = 'Turnos por Especialidad';
  letras = 13;
  gradient = false;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendPosition: LegendPosition = LegendPosition.Right;
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['red', 'blue', 'green'],
  };

  informacion: any[] = [];

  constructor(private turnoService: TurnoService) { }

  ngOnInit(): void {
    this.turnoService.obtenerCantidadTurnosPorEspecialidad().subscribe(data => {
      this.informacion = data.map(item => ({
        name: item.especialidad,
        value: item.cantidad
      }));
    });
  }

  descargarExcel(): void {
    // Temporalmente cambiar las claves 'name' y 'value' para el Excel
    const excelData = this.informacion.map(item => ({
      especialidad: item.name,
      cantidad: item.value
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Turnos-Por-Especialidad');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, fileName + '.xlsx');
  }

  descargarPDF() {
    const chartElement = document.getElementById('grafico5');
    if (chartElement) {
      const canvasOptions = {
        scale: 10, // Escala para mejorar la calidad
        useCORS: true, // Habilitar CORS para cargar imágenes externas
        logging: true // Habilitar logging para depuración
      };

      // Agregar un pequeño timeout para asegurar que el gráfico se renderice completamente
      html2canvas(chartElement, canvasOptions).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0); // Ajustar el formato y la calidad de la imagen según sea necesario

        const pdf = new jsPDF('landscape', 'px', 'a4');
        const imgProps = pdf.getImageProperties(imgData);

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'JPEG', 0, 10, pdfWidth, pdfHeight); // Ajustar posición y tamaño de la imagen en el PDF
        pdf.save('Turnos-Por-Especialidad.pdf');
      }).catch(error => {
        console.error('Error al generar el PDF:', error);
      });
       
    }
  }
}



