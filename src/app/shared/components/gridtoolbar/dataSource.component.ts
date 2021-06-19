import { Component, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: 'gt-datasource',
  template: ''
})
export class DXGridToolbarDataSourceComponent {

  // Load Url
  @Output() loadUrlChange = new EventEmitter<string>();
  private _loadUrl: string = null;
  @Input()
  get loadUrl(): string {
    return this._loadUrl;
  }
  set loadUrl(val: string) {
    this._loadUrl = val;
    this.loadUrlChange.emit(this._loadUrl);
  }

  // Load Url
  @Output() updateUrlChange = new EventEmitter<string>();
  private _updateUrl: string = null;
  @Input()
  get updateUrl(): string {
    return this._updateUrl;
  }
  set updateUrl(val: string) {
    this._updateUrl = val;
    this.updateUrlChange.emit(this._updateUrl);
  }

  // Load Url
  @Output() insertUrlChange = new EventEmitter<string>();
  private _insertUrl: string = null;
  @Input()
  get insertUrl(): string {
    return this._insertUrl;
  }
  set insertUrl(val: string) {
    this._insertUrl = val;
    this.insertUrlChange.emit(this._insertUrl);
  }


  // Remove Url
  @Output() removeUrlChange = new EventEmitter<string>();
  private _removeUrl: string = null;
  @Input()
  get removeUrl(): string {
    return this._removeUrl;
  }
  set removeUrl(val: string) {
    this._removeUrl = val;
    this.insertUrlChange.emit(this._removeUrl);
  }


  // Load Url
  @Output() loadParamsChange = new EventEmitter<any>();
  private _loadParams: any = null;
  @Input()
  get loadParams(): any {
    return this._loadParams;
  }
  set loadParams(val: any) {
    this._loadParams = val;
    this.loadParamsChange.emit(this._loadParams);
  }

  // Save Url
  @Output() saveParamsChange = new EventEmitter<any>();
  private _saveParams: any = null;
  @Input()
  get saveParams(): any {
    return this._saveParams;
  }
  set saveParams(val: any) {
    this._saveParams = val;
    this.loadParamsChange.emit(this._saveParams);
  }

  @Input() formCode: string = null;


}
