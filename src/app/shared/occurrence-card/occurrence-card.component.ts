import { Component, OnInit, Input } from '@angular/core';

import { OccurrenceModel } from 'src/app/_models/occurrence.model';

import { OccurrenceService } from 'src/app/_services/occurrence.service';
import { TableService } from '../../_services/table.service';

@Component({
  selector: 'vl-occurrence-card',
  templateUrl: './occurrence-card.component.html',
  styleUrls: ['./occurrence-card.component.scss']
})
export class OccurrenceCardComponent implements OnInit {
  @Input() occurrence: OccurrenceModel;
  @Input() score: number;
  @Input() openWithPreview = false;
  @Input() view: 'cards' | 'inline' = 'cards';

  preview = false;
  isLoadingOccurrenceFromDb = false;

  constructor(private occurrenceService: OccurrenceService, private tableService: TableService) { }

  ngOnInit() {
    if (this.score) { this.score = Math.round(this.score); }
    if (this.openWithPreview) { this.preview = true; }
  }

  togglePreview(): void {
    console.log(this.occurrence);
    this.preview = !this.preview;
  }

  addOccurrenceToCurrentTable(): void {
    if (this.isLoadingOccurrenceFromDb) { return; }

    this.isLoadingOccurrenceFromDb = true;
    this.occurrenceService.getEsOccurrenceWithChildrenById(this.occurrence.id).subscribe(
      occurrence => {
        this.tableService.addOccurrencesToCurrentTable([occurrence]);
        this.isLoadingOccurrenceFromDb = false;
      }, error => {
        this.isLoadingOccurrenceFromDb = false;
        // @Todo manage error
      }
    );
  }

  getObserversPreview(): string {
    if (this.occurrence && this.occurrence.vlObservers && this.occurrence.vlObservers.length > 0) {
      const vlObservers = this.occurrence.vlObservers;
      const mainObserver = vlObservers[0].name;
      const countOtherObservers = vlObservers.length - 1;
      let otherObserversStr: string;

      if (countOtherObservers === 1) {
        otherObserversStr = ' +1 autre';
      } else if (countOtherObservers > 1) {
        otherObserversStr = ` +${countOtherObservers} autres`;
      }
      return otherObserversStr ? mainObserver + otherObserversStr : mainObserver;
    } else {
      return '?';
    }
  }

}
