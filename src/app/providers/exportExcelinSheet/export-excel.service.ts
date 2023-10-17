import { Injectable } from '@angular/core';
// import { Workbook } from 'exceljs/dist/exceljs.min.js';
import { Workbook } from 'exceljs';
// import * as ExcelJS from 'exceljs';
import * as fs from 'file-saver';
import * as logo from './mylogo';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelSheetService {

  constructor() { }

  exportExcel(excelData: any, extraTableData?: any) {

    const uppercaseArray = excelData.headers.map((str: string) => str.toUpperCase());
    //Title, Header & Data
    const title = excelData.title;
    const header = uppercaseArray;
    const dates = excelData.dateRange;
    const data = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    for (let i = 0; i < excelData.data.length; i++) {
      let worksheet = workbook.addWorksheet(`${excelData.data[i][0][1]}`);
      //Add Row and formatting
      worksheet.mergeCells('B1', 'D4');
      let titleRow = worksheet.getCell('B1');
      titleRow.value = title + '  ( ' + dates + ' )'
      titleRow.font = {
        name: 'Calibri',
        size: 16,
        // underline: 'single',
        bold: true,
        color: { argb: '00244C' }
      }
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

      // Date
      // worksheet.mergeCells('G1:H4');
      // let d = new Date();
      // // let date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
      // let date = new Date();
      // let dateCell = worksheet.getCell('G1');
      // dateCell.value = date;
      // dateCell.font = {
      //   name: 'Calibri',
      //   size: 12,
      //   bold: true
      // }
      // dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

      //Add Image
      let myLogoImage = workbook.addImage({
        base64: logo.imgBase64,
        extension: 'png',
      });
      worksheet.mergeCells('E1:F4');
      worksheet.addImage(myLogoImage, 'E1:F4');

      //Blank Row 
      worksheet.addRow([]);

      // if (extraTableData) {
      //   // Extra Data
      //   const totalheader = extraTableData[0].headers;
      //   const totaldata = extraTableData[0].data;
      //   const callerCountheader = extraTableData[1].headers;
      //   const callerCountdata = extraTableData[1].data;
      //   const uppercaseArray = totalheader.map((str: string) => str.toUpperCase());
      //   const callerUppercaseArray = callerCountheader.map((str: string) => str.toUpperCase());
      //   // total count Row
      //   let totalCountRow = worksheet.addRow(uppercaseArray);

      //   totalCountRow.eachCell((cell, number) => {
      //     cell.fill = {
      //       type: 'pattern',
      //       pattern: 'solid',
      //       fgColor: { argb: '4167B8' },
      //       bgColor: { argb: '' }
      //     }
      //     cell.font = {
      //       bold: true,
      //       color: { argb: 'FFFFFF' },
      //       size: 12
      //     }
      //     cell.alignment = { vertical: 'middle', horizontal: 'center' }
      //   });

      //   // Adding Data with Conditional Formatting
      //   totaldata.forEach((d: any) => {
      //     let row = worksheet.addRow(d);
      //     row.eachCell((cell, number) => {
      //       cell.fill = {
      //         type: 'pattern',
      //         pattern: 'solid',
      //         fgColor: { argb: 'e91e63' },
      //         bgColor: { argb: 'e91e63' }
      //       }
      //       cell.font = {
      //         bold: true,
      //         color: { argb: 'FFFFFF' },
      //         size: 12
      //       }
      //       cell.alignment = { vertical: 'middle', horizontal: 'center' }
      //     });
      //   });

      //   worksheet.getColumn(3).width = 20;
      //   worksheet.addRow([]);

      //   // Total Caller count Data
      //   let totalCallerCountRow = worksheet.addRow(callerUppercaseArray);
      //   totalCallerCountRow.eachCell((cell, number) => {
      //     cell.fill = {
      //       type: 'pattern',
      //       pattern: 'solid',
      //       fgColor: { argb: '4167B8' },
      //       bgColor: { argb: '' }
      //     }
      //     cell.font = {
      //       bold: true,
      //       color: { argb: 'FFFFFF' },
      //       size: 12
      //     }
      //     cell.alignment = { vertical: 'middle', horizontal: 'center' }
      //   });
      //   // Adding Data with Conditional Formatting
      //   callerCountdata.forEach((d: any) => {
      //     let row = worksheet.addRow(d);
      //     row.eachCell((cell, number) => {
      //       // cell.fill = {
      //       //   type: 'pattern',
      //       //   pattern: 'solid',
      //       //   fgColor: { argb: '4167B8' },
      //       //   bgColor: { argb: '' }
      //       // }
      //       // cell.font = {
      //       //   bold: true,
      //       //   color: { argb: 'FFFFFF' },
      //       //   size: 12
      //       // }
      //       cell.alignment = { vertical: 'middle', horizontal: 'center' }
      //     });
      //   });

      //   worksheet.getColumn(3).width = 20;
      //   worksheet.addRow([]);
      // }




      //Adding Header Row
      let headerRow = worksheet.addRow(header);
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '00244C' },
          bgColor: { argb: '' }
        }
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFF' },
          size: 12
        }
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
      })
      worksheet.columns.forEach((column: any) => {
        // column.values.map((text: any, i: number) => {
        //   column.values[i] = this.toTitleCase(text);
        // });
        const lengths = column.values.map((v: any) => v?.length);
        const maxLength = Math.max(Math.max(...lengths.filter((v: any) => typeof v === 'number')) + 10);
        column.width = maxLength;
      });

      // Adding Data with Conditional Formatting
      excelData.data[i].forEach((d: any) => {
        let row = worksheet.addRow(d);
        row.eachCell((cell, number) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
        });
        //   let sales = row.getCell(6);
        //   let color = 'FF99FF99';
        //   // if (+sales.value < 200000) {
        //   //   color = 'FF9999'
        //   // }

        //   sales.fill = {
        //     type: 'pattern',
        //     pattern: 'solid',
        //     fgColor: { argb: color }
        //   }
      });

      worksheet.getColumn(3).width = 20;
      worksheet.addRow([]);

      //Footer Row
      let footerRow = worksheet.addRow(['Report Generated on ' + new Date().toDateString()]);
      footerRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB050' }
      };

      //Merge Cells
      worksheet.mergeCells(`A${footerRow.number}:G${footerRow.number}`);
      if (i == excelData.data.length - 1)
        //Generate & Save Excel File
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, title + '.xlsx');
        })
    }

  }

  toTitleCase(str: string) {
    if (str) {
      return str.replace(
        /\w\S*/g,
        function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      );
    } else {
      return null;
    }
  }
}
