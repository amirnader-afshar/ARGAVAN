import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  ViewContainerRef,
  ViewChild,
  EventEmitter,
  Output
} from "@angular/core";

@Component({
  selector: "search",
  templateUrl: "./search.component.html"
})
export class SearchComponent {
  constructor() {}
  @Input() title: string = "";

  @Input() width: number = 990;

  @Input() height: number = 600;

  @Input() scrollHeight: number = 500;

  //FullScreen
  @Input() isFullScreen: boolean = false;

  // On Hiding
  @Output() onClosing = new EventEmitter();
  onHiding() {
    this.onClosing.emit();
  }

  // On Showing
  @Output() onOpening = new EventEmitter();
  onShowing() {
    this.onOpening.emit();
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
  @Output() onClickSearch = new EventEmitter();
  onSearchClick() {
    this.onClickSearch.emit();
  }
  //show search button

  @Output() visibleConfirmChange = new EventEmitter<boolean>();
  _visibleConfirm: boolean = true;
  @Input()
  get showSearch(): boolean {
    return this._visibleConfirm;
  }
  set showSearch(val: boolean) {
    this._visibleConfirm = val;
    this.visibleConfirmChange.emit(val);
  }
  //Select Button
  @Output() visibleNextChange = new EventEmitter<boolean>();
  _visibleNext: boolean = false;
  @Input()
  get showSelect(): boolean {
    return this._visibleNext;
  }
  set showSelect(val: boolean) {
    this._visibleNext = val;
    this.visibleNextChange.emit(val);
  }

  //Submit and Next Button
  @Output() onClickSelect = new EventEmitter();
  onSelectClick() {
    this.onClickSelect.emit();
  }

  //Cancel Button
  private onPopupCancelClick() {
    this._visible = false;
  }
}
