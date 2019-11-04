import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from 'src/app/_services/user.service';
import { TableService } from 'src/app/_services/table.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { PdfFileService } from 'src/app/_services/pdf-file.service';

import { Table } from 'src/app/_models/table.model';
import { OccurrenceValidationModel } from 'src/app/_models/occurrence-validation.model';
import { PdfFile } from 'src/app/_models/pdf-file.model';
import { TableRelatedSyntaxon } from 'src/app/_models/table-related-syntaxon';

import { RepositoryItemModel } from 'tb-tsb-lib';
import { FileData } from 'tb-dropfile-lib/lib/_models/fileData';

import * as _ from 'lodash';
import { map } from 'rxjs/operators';

@Component({
  selector: 'vl-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.scss']
})
export class TableFormComponent implements OnInit {
  // ---
  // VAR
  // ---
  tableForm: FormGroup;
  maxTitleLength = 100;
  maxDescriptionLength = 300;
  currentUser = this.userService.userEvents.getValue();
  relatedSyntaxon: Array<RepositoryItemModel> = [];
  relatedPdfFile: Array<FileData> = [];
  allowedUploadedFileTypes = ['pdf'];

  pdfFilesToSend: Array<FormData> = [];
  pdfFileIrisToLink: Array<string> = [];
  currentTablePdfFiles: Array<PdfFile> = [];
  // pdfFileIrisToUnlink: Array<string> = [];

  constructor(
    private userService: UserService,
    public tableService: TableService,
    private pdfFileService: PdfFileService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    const user: string = this.currentUser ? this.currentUser.name : '';
    this.tableForm = new FormGroup({
      createdAt: new FormControl({value: new Date(), disabled: true}, [Validators.required]),
      createdBy: new FormControl(user, [Validators.required]),
      isDiagnosis: new FormControl(false, [Validators.required]),
      title: new FormControl(''),
      description: new FormControl(''),
      biblioSource: new FormControl('')
    });

    // if current table has id -> bind form
    const ct = this.tableService.getCurrentTable();
    if (ct.id) {
      this.bindForm(ct);
    }

    // if current table has pdf file
    if (ct.pdf) {
      this.currentTablePdfFiles.push(ct.pdf);
    }
  }

  syntaxonChange(validation: RepositoryItemModel): void {
    if (this.relatedSyntaxon.length > 0) {
      this.notificationService.notify('Un tableau ne peut contenir qu\'une seule validation');
    } else {
      const alreadyExist = _.find(this.relatedSyntaxon, rs => _.isEqual(rs, validation));
      if (alreadyExist) {
        this.notificationService.notify('Vous ne pouvez pas ajouter deux fois la même référence');
      } else {
        this.relatedSyntaxon.push(validation);
      }
    }
  }

  deleteSyntaxon(data: TableRelatedSyntaxon): void {
    _.remove(this.relatedSyntaxon, rs => _.isEqual(rs, data));
  }

  deleteRelatedPdfFile(data: FileData): void {
    this.pdfFilesToSend = [];
    this.relatedPdfFile = [];
  }

  deleteTablePdfFile(pdfFile: PdfFile): void {
    _.remove(this.currentTablePdfFiles, pf => _.isEqual(pf, pdfFile));
  }

  deleteBilbioSource(data: TableRelatedSyntaxon): void {
    //
  }

  /**
   * On PDF file upload
   * @param data see tb-dropfile-lib output event
   */
  pdfUploaded(data: FileData): void {
    this.relatedPdfFile = [data[0]];
    try {
      const fd = this.createFormDataForPdfFile([this.relatedPdfFile[0].file]);
      this.pdfFilesToSend[0] = fd;
    } catch (error) {
      console.log(error);
    }
  }

  private createFormDataForPdfFile(files: Array<File>): FormData {
    const fd = new FormData();
    for (const file of files) {
      fd.append('file', file, file.name);
    }
    return fd;
  }

  /**
   * POST pdf files trough API and then POST / PUT table
   */
  postPdfFiles(callback: 'POST' | 'PUT') {
    if (this.pdfFilesToSend.length > 0) {
      this.pdfFileService.createPdfFile(this.pdfFilesToSend[0]).subscribe(
        pdfFile => {
          this.pdfFileIrisToLink.push(pdfFile['@id']);
          this.notificationService.notify('Fichier ' + pdfFile.originalName + ' uploadé !');
          if (callback === 'POST') { this.postTable(); }
          if (callback === 'PUT') { this.putTable(); }
        }, errorPdfFile => {
          this.notificationService.warn('Erreur lors de l\'upload du fichier  PDF ' + this.pdfFilesToSend[0].get('file').toString());
        }
      );
    }
  }

  /**
   * Create (POST) a new table
   */
  postTable() {
    const prePostedTable = _.cloneDeep(this.tableService.getCurrentTable());
    const prePostedTableValidations: Array<OccurrenceValidationModel> = [];

    // Bind metadata
    this.bindMetadataToTable(prePostedTable);

    // diagnosis
    if (this.tableForm.controls.isDiagnosis.value === true) { prePostedTable.isDiagnosis = true; } else { prePostedTable.isDiagnosis = false; }

    // Bind table validation
    const rs = this.relatedSyntaxon.length > 0 ? this.relatedSyntaxon[0] : null;
    if (rs) {
      prePostedTableValidations.push(this.getValidationModelFromRepositoryItemModel(rs));
    }

    if (prePostedTableValidations.length > 0) {
      prePostedTable.validations = prePostedTableValidations;
    }

    // POST table
    this.tableService.postTable(prePostedTable).subscribe(
      postedTable => {
        // Should we link pdf file ?
        if (this.pdfFileIrisToLink.length > 0) {
          this.tableService.linkTableToPdfFile(postedTable, this.pdfFileIrisToLink[0]).subscribe(
            linkedTable => {
              // CURRENT TABLE = LINKED TABLE
              this.tableService.setCurrentTable(linkedTable, true);
              this.pdfFileIrisToLink = [];
            }, errorLinkedTable => {
              console.log(errorLinkedTable);
            }
          );
        } else {
          // no pdf file to link
          this.tableService.setCurrentTable(postedTable, true);
        }
      }, errorPostedTable => {
        console.log(errorPostedTable);
      }
    );
  }

  /**
   * Replace (PUT) an existing table
   */
  putTable() {
    const prePatchedTable = _.cloneDeep(this.tableService.getCurrentTable());
    const prePatchedTableValidations: Array<OccurrenceValidationModel> = [];

    prePatchedTable.updatedAt = new Date();
    prePatchedTable.updatedBy = 22;

    // Bind metadata
    this.bindMetadataToTable(prePatchedTable);

    // is diagnosis
    if (this.tableForm.controls.isDiagnosis.value === true) { prePatchedTable.isDiagnosis = true; } else { prePatchedTable.isDiagnosis = false; }

    // Bind table validation
    const rs = this.relatedSyntaxon.length > 0 ? this.relatedSyntaxon[0] : null;
    if (prePatchedTable.validations.length === 0 && rs) {
      // table has no validation yet
      prePatchedTableValidations.push(this.getValidationModelFromRepositoryItemModel(rs));
      prePatchedTable.validations.push(...prePatchedTableValidations);
    } else if (prePatchedTable.validations.length > 0 && rs) {
      // table already has a validation => check table validation and related syntaxon values
      const tableValidation = prePatchedTable.validations[0];
      if (tableValidation.repository === rs.repository && tableValidation.repositoryIdNomen === rs.idNomen && tableValidation.repositoryIdTaxo === rs.idTaxo) {
        // do nothing
      } else {
        // replace existing validation
        // we 'move' the old validation id to the new validation so API platform will update the old validation instead of create a new one
        const existingValidationId = prePatchedTable.validations[0].id;
        prePatchedTable.validations[0] = this.getValidationModelFromRepositoryItemModel(rs);
        prePatchedTable.validations[0].id = existingValidationId;
      }
    } else if (prePatchedTable.validations.length > 0 && !rs) {
      // table has a validation but related syntaxon doesn't exists => delete table validation
      // remove table validation
      prePatchedTable.validations = [];
    }

    // Bind pdf files
    let deleteLinkedPdfFile = false;
    if (prePatchedTable.pdf && this.pdfFileIrisToLink.length > 0) {
      // replace existing pdf file
      const existingPdfFileId = prePatchedTable.pdf.id;
      prePatchedTable.pdf[0] = this.pdfFileIrisToLink[0];
      prePatchedTable.pdf[0].id = existingPdfFileId;
    } else if (prePatchedTable.pdf && this.currentTablePdfFiles.length === 0) {
      // remove linked pdf files
      deleteLinkedPdfFile = true;
    }

    this.tableService.putTable(prePatchedTable).subscribe(
      patchedTable => {
        // Should we link pdf file ?
        if (this.pdfFileIrisToLink.length > 0) {
          this.tableService.linkTableToPdfFile(patchedTable, this.pdfFileIrisToLink[0]).subscribe(
            linkedTable => {
              // CURRENT TABLE = LINKED TABLE
              this.tableService.setCurrentTable(linkedTable, true);
              this.pdfFileIrisToLink = [];
            }, errorLinkedTable => {
              console.log(errorLinkedTable);
              this.notificationService.warn('Nous ne parvenons pas à lier le tableau au fichier PDF');
              this.tableService.setCurrentTable(patchedTable, true);
            }
          );
        } else {
          // no pdf file to link
          // pdf file to unlink ?
          if (deleteLinkedPdfFile) {
            this.pdfFileService.removePdfFile(patchedTable.pdf.id).subscribe(
              removedPdfFile => {
                console.log(removedPdfFile);
                patchedTable.pdf = null;
                this.tableService.setCurrentTable(patchedTable, true);
                this.notificationService.notify('Le tableau a été modifié');
              }, errorRemovedPdfFile => {
                console.log(errorRemovedPdfFile);
                this.notificationService.warn('Nous ne parvenons pas à supprimer le fichier PDF lié au tableau');
                this.tableService.setCurrentTable(patchedTable, true);
              }
            );
          } else {
            this.tableService.setCurrentTable(patchedTable, true);
          }
        }
      }, errorPatchedTable => {
        console.log(errorPatchedTable);
        this.notificationService.warn('Nous ne parvenons pas à enregistrer le tableau');
      }
    );
  }

  saveTable() {
    const ct = this.tableService.getCurrentTable();
    // POST pdf file
    let pdfFilesToPost = false;
    if (this.pdfFilesToSend.length > 0) { pdfFilesToPost = true; }

    const callback = ct.id ? 'PUT' : 'POST';

    if (pdfFilesToPost) {
      this.postPdfFiles(callback);
    } else {
      if (callback === 'POST') {
        this.postTable();
      } else {
        this.putTable();
      }
    }
  }

  private getValidationModelFromRepositoryItemModel(rim: RepositoryItemModel): OccurrenceValidationModel {
    const name = rim.name + (rim.author && rim.author !== '' ? ' ' + rim.author : '');
    const ovm: OccurrenceValidationModel = {
      inputName: name,
      repository: rim.repository,
      repositoryIdNomen: +rim.idNomen,
      repositoryIdTaxo: rim.idTaxo.toString(),
      validName: name,
      validatedName: name,
      validatedAt: new Date(),
      validatedBy: 22
    };
    return ovm;
  }

  bindMetadataToTable(table: Table) {
    table.title = this.tableForm.controls.title.value;
    table.description = this.tableForm.controls.description.value;
    table.createdAt = this.tableForm.controls.createdAt.value;
    table.createdBy = 22;
  }

  bindForm(table: Table) {
    this.tableForm.controls.createdAt.setValue(table.createdAt, {emitEvent: false});
    this.tableForm.controls.createdBy.setValue(table.createdBy, {emitEvent: false});
    this.tableForm.controls.isDiagnosis.setValue(table.isDiagnosis, {emitEvent: false});
    this.tableForm.controls.title.setValue(table.title, {emitEvent: false});
    this.tableForm.controls.description.setValue(table.description, {emitEvent: false});
    this.tableForm.controls.biblioSource.setValue('', {emitEvent: false});
    this.tableForm.controls.isDiagnosis.setValue(table.isDiagnosis, {emitEvent: false});

    if (table.validations.length > 0) {
      this.relatedSyntaxon = [{
        repository: table.validations[0].repository,
        idNomen: table.validations[0].repositoryIdNomen,
        idTaxo: table.validations[0].repositoryIdTaxo,
        name: table.validations[0].inputName,
        author: ''
      }];
    } else {
      this.relatedSyntaxon = [];
    }
  }

}
