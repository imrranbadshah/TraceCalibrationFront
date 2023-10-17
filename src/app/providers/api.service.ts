import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
// import { ExportExcelService } from './exportExcel/export-excel.service';
import { ExportExcelSheetService } from './exportExcelinSheet/export-excel.service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseURL: string = "http://122.184.72.99:3000/";
  dataForExcel: any[] = [];
  constructor(private httpClient: HttpClient, public excelExportServ: ExportExcelSheetService,) { }

  /**
  * @description Get member list based on the userName
  */
  getStoredDataDump(data: any): Observable<any> {
    console.log(data)
    let URL = this.baseURL + `getStoredData?tagId=${data.tagId}&from=${data.fromDateTime.split('T')[0]}&to=${data.toDateTime.split('T')[0]}`;
    console.log('Custom login : ');
    console.log(URL);
    let headers = {
      'content-type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      // 'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
    };
    return this.httpClient.get<any>(URL, { headers: headers });
  }

  /**
   * @author Imran A
   * @description used to export datatable to 
   * @param arr 
   * @param name 
   */
  exportArrayToExcel(arr: any[], name: string, dates: any) {
    this.dataForExcel = [];
    let column = Object.keys(arr[0]);
    console.log(column);
    arr.forEach((obj: any, i) => {
      let newObj: any = [];
      // console.log(JSON.stringify(obj));
      column.map((head: string) => {
        Object.entries(obj).forEach(([key, value], j) => {
          // if (i == 0) {
          if (head == key) {
            // console.log(`${j} ==>${key}: ${value}`);
            newObj.push(value);
          }
          // }
        })
        // 
      });
      this.dataForExcel.push(newObj);
    });

    let reportData = {
      title: name.toUpperCase() + ' REPORT',
      data: this.dataForExcel,
      dateRange: `${dates[0].split("T")[0]} to ${dates[1].split("T")[0]}`,
      headers: column
    }
    // console.clear();
    // console.log("Headers", reportData.data);
    this.excelExportServ.exportExcel(reportData);
  }

  /**
   * @author Imran A
   * @description used to export datatable to 
   * @param arr 
   * @param name 
   */
  exportArrayToExcelSheet(parentArr: any[], column: string[], name: string, dates: any) {
    this.dataForExcel = [];
    parentArr.forEach((arr: any) => {
      let dataSetExcel: any[] = [];
      arr.forEach((obj: any, i: number) => {
        let newObj: any = [];
        // console.log(JSON.stringify(obj));
        column.map((head: string) => {
          Object.entries(obj).forEach(([key, value], j) => {
            // if (i == 0) {
            if (head == key) {
              // console.log(`${j} ==>${key}: ${value}`);
              newObj.push(value);
            }
            // }
          })
          // 
        });
        dataSetExcel.push(newObj);
      });
      this.dataForExcel.push(dataSetExcel);
    });
    let reportData = {
      title: name.toUpperCase() + ' REPORT',
      data: this.dataForExcel,
      dateRange: `${dates[0].split("T")[0]} to ${dates[1].split("T")[0]}`,
      headers: column
    }
    console.clear();
    // // console.log("Headers", reportData.data);
    this.excelExportServ.exportExcel(reportData);
  }
}
