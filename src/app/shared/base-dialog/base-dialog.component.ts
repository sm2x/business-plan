import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'l3co-base-dialog',
  templateUrl: './base-dialog.component.html'
})
export class BaseDialogComponent implements OnInit {

  @Input() title: string;
  @Input() buttonSave: string;

  @Output() action: EventEmitter<string> = new EventEmitter();


  constructor() {
  }

  ngOnInit() {
  }

  actionEmitter(value) {
    this.action.emit(value);
  }
}