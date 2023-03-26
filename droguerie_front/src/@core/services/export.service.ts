import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";

import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
  providedIn: "root",
})
export class ExportService {
  constructor() {}

  public exportAsExcelFile(
    rows: any[],
    excelFileName: string,
    rows2?: any[],
    excelFileName2?: string,
    key?: string
  ): void {
    if (rows.length > 0 && rows2 == null) {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
      const workbook: XLSX.WorkBook = {
        Sheets: { "compte-rendu": worksheet },
        SheetNames: ["compte-rendu"],
      };
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    } else if (rows.length > 0 && rows2.length > 0) {
      var wb = XLSX.utils.book_new();
      let array = [];
      let array2 = [];
      for (let i = 0; i < rows2.length; i++) {
        array.push(rows2[i][key]);
        // array3 = [array, ...array[i]];
        array2 = array2.concat(array[i]);
      }
      var wsBooks = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, wsBooks, excelFileName);
      var wsPersonDetails = XLSX.utils.json_to_sheet(array2);
      XLSX.utils.book_append_sheet(wb, wsPersonDetails, excelFileName2);
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    } else {
      //   this.notifService.message('Aucune ligne à exporter...');
    }
  }
  saveAsExcelFile(buffer: any, baseFileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      baseFileName + "_" + this.getDateFormat(new Date()) + EXCEL_EXTENSION
    );
  }
  getDateFormat(date: Date): string {
    return formatDate(date, "yyyyMMdd_HHmmss", "en-US");
  }
}
