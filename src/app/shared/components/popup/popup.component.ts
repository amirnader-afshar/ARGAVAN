import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  ViewContainerRef,
  ViewChild,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";

@Component({
  selector: "popup",
  templateUrl: "./popup.component.html",
  changeDetection: ChangeDetectionStrategy.Default
})
export class PopupComponent {
  constructor(private cdr: ChangeDetectorRef) { }
  @Input() title: string = "";

  @Input() width: number = 990;

  @Input() height: number = 500;

  //FullScreen
  @Input() isFullScreen: boolean = false;

  // On Hiding
  @Output() onClosing = new EventEmitter<any>();
  onHiding($event) {
    this.onClosing.emit($event);
  }

  // On Showing
  @Output() onOpening = new EventEmitter<any>();
  onShowing($event) {
    this.onOpening.emit($event);
  }

  // Visible
  @Output() visibleChange = new EventEmitter<boolean>();
  _visible: boolean = false;
  @Input()
  get visible(): boolean {
    return this._visible;
  }
  set visible(val: boolean) {
    this._visible = val;
    this.visibleChange.emit(val);
  }
  // Items
  private _items: any[] = [];
  @Input()
  get items(): any[] {
    return this._items;
  }

  set items(val: any[]) {
    this._items = val;
  }
  @Output() onItemClick: EventEmitter<any>;

  onPopupItemClick(data) {
    let item = data.itemData;
    let name = item.name;
    this.onItemClick.emit(name);
  }

  // Confirm Button
  @Input() submitText: string = "تایید";
  @Output() onSubmitClick = new EventEmitter<any>();
  onClick(data) {
    this.onSubmitClick.emit(data);
  }
  //showSubmit
  @Output() visibleConfirmChange = new EventEmitter<boolean>();
  _visibleConfirm: boolean = false;
  @Input()
  get showConfirm(): boolean {
    return this._visibleConfirm;
  }
  set showConfirm(val: boolean) {
    this._visibleConfirm = val;
    this.visibleConfirmChange.emit(val);
  }

  //Submit Button
  @Output() visibleNextChange = new EventEmitter<boolean>();
  _visibleNext: boolean = false;
  @Input()
  get showNext(): boolean {
    return this._visibleNext;
  }
  set showNext(val: boolean) {
    this._visibleNext = val;
    this.visibleNextChange.emit(val);
  }

  //showCancel
  @Output() visibleCancelChange = new EventEmitter<boolean>();
  _visibleCancel: boolean = true;
  @Input()
  get showCancel(): boolean {
    return this._visibleCancel;
  }
  set showCancel(val: boolean) {
    this._visibleCancel = val;
    this.visibleCancelChange.emit(val);
  }
  
  //showClose
  @Output() visibleCloseChange = new EventEmitter<boolean>();
  _visibleClose: boolean = true;
  @Input()
  get showClose(): boolean {
    return this._visibleClose;
  }
  set showClose(val: boolean) {
    this._visibleClose = val;
    this.visibleCloseChange.emit(val);
  }

  //Submit and Next Button
  @Input() submitNextText: string = "تایید و بعدی";
  @Output() onSubmitNextClick = new EventEmitter();
  onClickNext() {
    this.onSubmitNextClick.emit();
  }

  //Cancel Button
  private onPopupCancelClick() {
    this._visible = false;
    this.cdr.detectChanges();
  }
}
