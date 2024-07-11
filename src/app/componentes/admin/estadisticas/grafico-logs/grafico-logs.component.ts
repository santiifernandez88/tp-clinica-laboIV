import { Component } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { LogUsuariosService } from '../../../../services/log-usuarios.service';
import { formatDate } from '@angular/common';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grafico-logs',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './grafico-logs.component.html',
  styleUrl: './grafico-logs.component.css'
})
export class GraficoLogsComponent {
  logsDelDia: any[] = [];
  informacion: any[] = [];

  view: any = [700, 400];
  colorScheme = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private logUsuariosService: LogUsuariosService) { }

  ngOnInit(): void {
    this.obtenerLogsDelDia();
  }

  obtenerLogsDelDia(): void {
    const hoy = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    this.logUsuariosService.obtenerLogUsuarios().subscribe((logs: any[]) => {
      this.logsDelDia = logs.filter(log => log.fecha === hoy);

      const logsPorUsuario: { [key: string]: number } = {};
      this.logsDelDia.forEach(log => {
        if (logsPorUsuario[log.email]) {
          logsPorUsuario[log.email]++;
        } else {
          logsPorUsuario[log.email] = 1;
        }
      });

      this.informacion = Object.keys(logsPorUsuario).map(email => ({
        name: email,
        value: logsPorUsuario[email]
      }));
    });
  }

  descargarExcel(): void {
    const excelData = this.informacion.map(item => ({
      usuario: item.name,
      cantidad: item.value
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Logs-Usuarios');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, fileName + '.xlsx');
  }

  descargarPDF(): void {
    const chartElement = document.getElementById('grafico4');
    if (chartElement) {
      const clonedElement = chartElement.cloneNode(true) as HTMLElement;
      document.body.appendChild(clonedElement);

      html2canvas(clonedElement, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        document.body.removeChild(clonedElement);
        const imageData = canvas.toDataURL('image/png');
        const pdfDefinition: any = {
          content: [
            { text: 'Logs de Usuarios del Día', style: 'header' },
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

        pdfMake.createPdf(pdfDefinition).download('logs_del_dia.pdf');
      }).catch(error => {
        console.error('Error al generar la imagen del gráfico:', error);
      });
    }
  }

}
