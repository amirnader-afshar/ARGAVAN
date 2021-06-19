import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";

import CustomStore from "devextreme/data/custom_store";
import "rxjs/add/operator/toPromise";
import { ServiceCaller } from "../services/ServiceCaller";
import { TranslateService } from "../services/TranslateService";
import {
  DxDataGridComponent,
  DxTextBoxComponent,
  DxLookupComponent,
  DxPopupComponent
} from "devextreme-angular";
import { DateTime } from "../util/DateTime";
import { Deferred } from "../Deferred";
import { Guid } from "../types/GUID";

export enum DisplayMode {
  Popup,
  ComboBox
}

@Component({
  selector: "dx-lov",
  templateUrl: "./dx-lov.component.html"
  //host: { '(window:keydown)': 'hotkeys($event)', '(window:keypress)': 'hotkeys($event)' },
})
export class DXLovComponent {
  @ViewChild("grid", { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild("textBox", { static: false }) textBox: DxTextBoxComponent;
  @ViewChild('textBoxValidator', { static: false }) textBoxValidator;
  @ViewChild("searchBox", { static: false }) searchBox: DxTextBoxComponent;
  @ViewChild("comboBox", { static: false }) comboBox: DxLookupComponent;
  @ViewChild('comboBoxValidator', { static: false }) comboBoxValidator; 
  @ViewChild("popup", { static: false }) popup: DxPopupComponent;



  displayModeEnum = DisplayMode;
  displayField: string[];
  displayFieldType: number;
  valueField: string;
  comboDisplayExpr: string;

  // displayMode
  @Input() displayMode: string = DisplayMode[DisplayMode.Popup];

  //*********************************************
  @Output() requiredChange: EventEmitter<boolean>;
  private _required: boolean = false;
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(val: boolean) {
    this._required = val;
    this.requiredChange.emit(this._required);
  }

  // مقدار پیشفرض برای ال او وی
  @Input() sun_DefaultValue: any = 1;

  // title
  @Input() title: string = null;
  // title
  @Input() noDataText: string = "داده ای برای نمایش وجود ندارد";

  // title
  @Input() placeholder: string = null;

  // form code
  @Input() formCode: string = null;

  // show the textbox
  @Input() visible: boolean = true;

  // text attribute
  @Output() textChange: EventEmitter<string>;
  private _text: string = "";
  @Input()
  get text(): string {
    return this._text;
  }
  set text(val: string) {
    this._text = val;
    this.textChange.emit(this._text);
  }
  @Input() find: boolean = true;
  //*********************************************
  @Output() valueChange: EventEmitter<any>;
  private _value: any = null;
  @Input()
  get value(): any {
    return this._value;
  }
  set value(val: any) {

    //var id = '9903D994-4AC6-E911-80CE-441EA156190E';


    const pattern = /^[A-F0-9a-f]{8}-[A-F0-9a-f]{4}-[A-F0-9a-f]{4}-[A-F0-9a-f]{4}-[A-F0-9a-f]{12}$/i;
    if (pattern.test(val) === true) {
      this.innerSetValue(val.toLowerCase(), this.find);
    } else {
      this.innerSetValue(val, this.find);
    }

  }

  private innerSetValue(val: any, find: boolean = false) {
    let old = this._value;
    this._value = val;
    val = (val == null || val == 'undefined' || val == undefined) ? null : val;
    if (val != old || val != null) {
      this.valueChange.emit(this._value);
      if (val != null || val != "") {
        if (find && val) this.findByValue();
      }
    }
    //TODO: sm-edit: check this statement
    if (val == null && val != old) {
      this.text = null;
      this.data = null;
    }
  }
  //*********************************************
  @Output() dataChange: EventEmitter<any>;
  private _data: any = {};

  @Input()
  get data(): any {
    return this._data;
  }
  set data(val: any) {
    if (
      (this._data == null && val) ||
      (this._data && val == null) ||
      (this._data && val)
    ) {
      this._data = val ? val : {};
      this.dataChange.emit(this._data);
    }
  }

  //*********************************************
  @Output() popupWidthChange: EventEmitter<any> = new EventEmitter<any>();
  private _popupWidth: any = '60%';
  @Input()
  get popupWidth(): any {
    return this._popupWidth;
  }
  set popupWidth(val: any) {
    this._popupWidth = val;
    this.popupWidthChange.emit(this._popupWidth);
  }

  //*********************************************
  @Output()
  popupHeightChange: EventEmitter<any> = new EventEmitter<any>();
  private _popupHeight: any = '90%';
  @Input()
  get popupHeight(): any {
    return this._popupHeight;
  }
  set popupHeight(val: any) {
    this._popupHeight = val;
    this.popupHeightChange.emit(this._popupHeight);
  }
  //*********************************************
  @Output() readOnlyChange: EventEmitter<boolean>;
  private _readOnly: boolean = false;
  @Input()
  get readOnly(): boolean {
    return this._readOnly;
  }
  set readOnly(val: boolean) {
    this._readOnly = val;
    this.readOnlyChange.emit(this._readOnly);
  }
  //*********************************************
  @Output() allowClearChange: EventEmitter<boolean>;
  private _allowClear: boolean = false;
  @Input()
  get allowClear(): boolean {
    return this._allowClear;
  }
  set allowClear(val: boolean) {
    this._allowClear = val;
    this.allowClearChange.emit(this._allowClear);
  }


  //*********************************************  
  @Output() paramsChange: EventEmitter<any>;
  private _params: any = {};
  @Input()
  get params(): any {
    return this._params;
  }
  set params(val: any) {
    this._params = val;
    if (val) {
      this.refresh();
    }
    this.paramsChange.emit(this._params);
  }
  //*********************************************
  @Input() selectedField: string = "ID";
  @Input() selectedValue: string = null;
  //*********************************************
  @Output() selectableChange = new EventEmitter<boolean>();
  _selectable: boolean = true;
  @Input()
  get selectable(): boolean {
    return this._selectable;
  }
  set selectable(val: boolean) {
    this._selectable = val;
    this.selectableChange.emit(val);
  }
  //**********************************************
  // selection mode
  @Input() selectionMode: string = "single";
  selectedKeys: any = [];
  selectedRow: any = {};

  dataSource: any = {};
  localData: any[] = [];
  fields: any[] = [];
  search: string = null;
  popupVisible: boolean = false;
  gridInited: boolean = false;
  showGridData: boolean = false;

  constructor(
    private service: ServiceCaller,
    public translate: TranslateService
  ) {
    //
    this.valueChange = new EventEmitter<any>();
    this.textChange = new EventEmitter<string>();
    this.readOnlyChange = new EventEmitter<boolean>();
    this.dataChange = new EventEmitter<any>();
    this.requiredChange = new EventEmitter<boolean>();
    this.allowClearChange = new EventEmitter<boolean>();
    this.paramsChange = new EventEmitter<any>();
    //
    //this.initAutoComplete();
  }

  getFormList(params): Promise<any> {

    let that = this;
    return this.service.getPromise('/SYS/Forms/List', params, { loading: false }).then(res => {
      that.fields = res.Fields;
      that.detectFields();

      return res;
    })
  }

  ngAfterViewInit() {

    if (this.textBox) {
      let validator = this.textBoxValidator;
      if (this.required) {
        validator.instance.option("validationRules", [
          { type: "required", message: "این فیلد اجباری است" }
        ]);
      }
    }
    if (this.comboBox) {
      let validator = this.comboBoxValidator;
      if (this.required) {
        validator.instance.option("validationRules", [
          { type: "required", message: "این فیلد اجباری است" }
        ]);
      }
    }

    //
    if (this.displayMode == DisplayMode[DisplayMode.Popup]) {
      this.dataSource.store = new CustomStore({
        load: loadOptions => {
          if (!this.showGridData || !loadOptions.take) {
            let result = new Deferred();
            result.resolve({
              data: [],
              totalCount: 0
            });
            return result.promise;
          }

          let that = this;
          let filter = this.getFilter();
          filter.Skip = loadOptions.skip;
          filter.Take = loadOptions.take;
          if (loadOptions.sort && loadOptions.sort.length) {
            let sort: string[] = [];
            for (const i in loadOptions.sort) {
              let c = loadOptions.sort[i];
              sort.push(c.selector + " " + (c.desc ? "desc" : ""));
            }
            filter.Sort = sort.join(",");
          }
          if (loadOptions.filter && loadOptions.filter.length) {

            let added = false;
            for (const i in loadOptions.filter) {
              let c = loadOptions.filter[i];
              if (c instanceof Array) {
                filter.Params.push({ Name: c[0], Value: c[2] });
                added = true;
              }
            }
            if (added == false) {
              let c = loadOptions.filter;
              filter.Params.push({ Name: c[0], Value: c[2] });
            }
          }


          return this.getFormList(filter).then(data => {
            that.dataGrid.keyExpr = this.valueField;
            that.addColumns();
            return {
              data: data.Data,
              totalCount: data.TotalRowCount
            }
          })


        }
      });
    } else {
      this.bindComboData();
    }
    //
    setTimeout(() => {
      if (this.selectedField && this.selectedValue && !this.value)
        this.findByDefault();
    }, 100);




  }




  private translateCobmo(data) {
    let temp = [];
    data.forEach(element => {
      temp.push({ ...element, Title: this.translate.instant(element.Title) })
    });
    return temp;
  }
  private bindComboData() {
    let that = this;
    setTimeout(() => {

      this.getFormList(this.getFilter()).then(data => {

        let translated = this.translateCobmo(data.Data);
        this.localData = translated;

        // ! --- برای دادن مقدار پیشفرض به حالت کومبوباکس -----------------------------------
        if (this.value == null || this.value == undefined) {
          var tempdata = this.localData.filter(x => x.REFC_ITEM_VAL == this.sun_DefaultValue)[0];
          if (tempdata != null || tempdata != undefined) {
            this.value = tempdata.REFC_ID;
          }
          // // console.log("bindComboData",this.value)
        }
      });
    }, 10);
  }

  private getFilter() {
    let filter: any = {};
    filter.Code = this.formCode;

    let params = [];

    for (let i in this.params) {
      params.push({ Name: i, Value: this.params[i] });
    }
    filter.Params = params;
    filter.SearchQuery = this.search;
    return filter;
  }

  refresh() {

    if (this.displayMode == DisplayMode[DisplayMode.Popup] && this.dataGrid) {
      // keep selection before refresh
      let keys = this.selectedKeys;
      this.dataGrid.instance.refresh().then(() => {
        setTimeout(() => {
          this.selectedKeys = keys;
        });
        //
        //this.setSelectedRows();
      });


    } else {
      //TODO: refresh combobox
      this.bindComboData();
    }
  }

  private detectFields() {
    let dispList = this.fields.filter(c => c.IsDisplay == true);

    if (dispList.length > 0) {
      this.displayField = [];
      for (const key in dispList) {
        this.displayField.push(dispList[key].Name);
      }
      this.displayFieldType = dispList[0].DataType;
    } else {
      this.displayField = [this.fields[0].Name];
      this.displayFieldType = this.fields[0].DataType;
    }
    this.comboDisplayExpr = this.displayField[0];
    let valsList = this.fields.filter(c => c.IsValue);
    this.valueField =
      valsList.length > 0 ? valsList[0].Name : this.fields[0].Name;
  }

  private addColumns() {
    if (this.gridInited == true) return;
    this.dataGrid.instance.deleteColumn("ID");

    //
    for (let i in this.fields) {
      let f = this.fields[i];
      if (f.Visible == false) continue;
      let editorOptions: any = {};
      if (f.Format)
        editorOptions.format = f.Format;
      var dataType: string = "string";
      // boolean
      if (f.DataType == 1) dataType = "boolean";
      // Numeric
      else if (f.DataType == 2) dataType = "number";
      // DateTime
      else if (f.DataType == 21) dataType = "dateTime";
      else if (f.DataType == 22) dataType = "date";
      else if (f.DataType == 23) dataType = "time";
      // other
      else dataType = "string";
      let col: any = {
        dataType: dataType,
        dataField: f.Name,
        caption: this.translate.instant(f.Title),
        minWidth: "100px",
        editorOptions: editorOptions
      };
      if (f.Width) {
        col.width = f.Width;
      }
      this.dataGrid.instance.addColumn(col);
    }
    this.gridInited = true;
  }

  private findByDefault() {
    // console.log('findByDefault');
    let filter: any = {};
    filter.Code = this.formCode;
    filter.Params = [{ Name: this.selectedField, Value: this.selectedValue }];
    let that = this;
    this.getFormList(filter).then(data => {
      if (data.Data.length >= 0) {
        that.data = data.Data[0];
        that.text = this.getDisplayText(data.Data[0]);
        that.innerSetValue(data.Data[0][that.valueField]);
      }
    });
  }

  private findByValue() {
    // console.log('findByValue');
    let that = this;
    setTimeout(() => {

      let filter = that.getFilter();
      filter.SearchQuery = this.value;
      this.getFormList(filter).then(data => {
        if (data.Data.length > 0) {
          that.data = data.Data[0];
          that.text = this.getDisplayText(data.Data[0]);
          //that.innerSetValue(data.Data[0][this.valueField], false);
        }
      });
    }, 10);
  }

  private onButtonClick() {
    if (!this.readOnly) {
      this.popupVisible = true;
    }
  }

  private selectionChangedHandler() {
    if (this.selectedKeys && this.selectedKeys.length == 1 && this.isSingleModel()) {
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData()[0];
    } else if (this.selectedKeys && this.selectedKeys.length >= 1 && !this.isSingleModel()) {
      this.selectedRow = this.dataGrid.instance.getSelectedRowsData();
    } else {
      this.selectedRow = this.isSingleModel() ? {} : [];
    }
  }

  private onCancelClick() {
    this.closePopup();
  }

  private closePopup() {
    this.popupVisible = false;
    this.popup.instance.hide();
  }

  private onOkayClick() {
    this.confirmSelection();
  }

  private onRefreshClick() {
    this.refresh();
  }

  private onRowDbClick(e) {
    this.confirmSelection();
  }




  // private onComboChange(e) {
  //   if (e.selectedItem) {
  //     this.text = e.selectedItem[this.displayField[0]];
  //     this.innerSetValue(e.selectedItem[this.valueField]);
  //     this.data = e.selectedItem;
  //   } else {
  //     this.text = null;
  //     this.innerSetValue(null, false);
  //     this.data = null;
  //   }
  // }

  private isSingleModel() {
    return this.selectionMode === "single";
  }

  show() {
    this.onButtonClick();
  }

  private onComboInit(e) {

    this.comboBox.valueExpr = this.valueField;
  }

  private confirmSelection() {
    if (this.selectable) {
      this.text = this.getDisplayText(this.selectedRow);
      if (this.isSingleModel())
        this.innerSetValue(this.selectedRow[this.valueField]);
      else if (!this.isSingleModel() && this.selectedRow) {
        let keys = this.selectedRow.map(c => c[this.valueField]);
        this.innerSetValue(keys);
      }
      this.data = this.selectedRow;
      this.closePopup();
    }
  }



  private setSelectedRows() {
    // TODO: key problem
    // if (this.value != null && (this.selectedKeys == null || this.selectedKeys.length == 0)) {
    //   let keys: any[] = [];
    //   if (this.isSingleModel()) {
    //     keys.push(this.value);
    //   }
    //   else {
    //     for (const i in this.value) {
    //       keys.push(this.value[i]);
    //     }
    //   }
    // }
    if (this.displayMode == DisplayMode[DisplayMode.Popup] && this.dataGrid) {
      this.selectedKeys = [this.value];
    }
  }


  private onShown(e) {
    this.search = null;
    this.searchBox.instance.focus();
    this.showGridData = true;
    setTimeout(() => {
      this.refresh();
    });

  }

  private onShowing(e) {
    this.gridInited = false;
  }

  private onHiding(e) {
    this.selectedKeys = [];
    this.selectedRow = {};
    this.showGridData = false;
  }

  private onTextChange(e) {
    if (e.value == null || e.value == "") {
      this.text = null;
      this.innerSetValue(null);
      this.data = null;
    }
  }

  private onKeyDown(e) {

    if (e.event.ctrlKey && e.event.key == "ArrowDown") {
      this.onButtonClick();
    }
    if (e.event.key == "Enter") {
      let filter: any = this.getFilter();
      let oldText = this.text;
      let oldData = this.data;
      let that = this;
      setTimeout(() => {
        //// console.log("findBySearch/ Enter >>>", filter);
        filter.SearchQuery = this.text;
        this.getFormList(filter).then(data => {
          if (data.Data == null || data.Data.length == 0) {
            that.text = oldText;
            that.onButtonClick();
          }
          else if (data.Data.length == 1) {
            that.text = oldText;
            that.onButtonClick();
            // that.value = data.Data[0][that.valueField];
            // that.data = data.Data[0];
            // that.text = that.isSingleModel() ? this.getDisplayText(data.Data[0]) : this.getDisplayText([data.Data[0]]);
            ////that.innerSetValue(data.Data[0][this.valueField]);
          }
          else {
            that.text = oldText;
            //that.value = data.Data[0][that.valueField];
            that.search = filter.SearchQuery;
            that.refresh();
            that.onButtonClick();
          }
          filter.SearchQuery = null;
        })
      }, 100);
    }
  }

  private getDisplayText(row: any): string {
    let result: string[] = new Array<string>();

    if (this.isSingleModel()) {
      let rowText: string[] = new Array<string>();
      for (const key in this.displayField) {
        let val: string = row[this.displayField[key]];
        // format date
        if ([21, 22, 23].indexOf(this.displayFieldType) >= 0) {
          val = DateTime.convertToLocal(val)
        }
        if (val && val != "")
          rowText.push(val);
      }
      result.push(rowText.join(" - "));
    }
    else {
      for (const i in row) {
        let rowText: string[] = new Array<string>();
        for (const key in this.displayField) {
          rowText.push(row[i][this.displayField[key]]);
        }
        result.push(rowText.join(" - "));
      }
    }
    return result.join(" | ");
  }

  private onSearchKeyDown(e) {
    let grid = this.dataGrid.instance;
    let keys = grid.getSelectedRowKeys();
    switch (e.event.key) {
      case "Enter": {
        if (keys.length) {
          this.confirmSelection();
        }
        else {
          this.refresh();
        }
        //this.refresh();
        break;
      }
      case "Space": {
        if (keys.length) {
          this.confirmSelection();
        }
        break;
      }
      case "ArrowDown": {
        if (keys.length) {
          let last = keys[keys.length - 1];
          let lastIndex = grid.getRowIndexByKey(last) + 1;
          this.focusRow(lastIndex);
        } else {
          this.focusRow(0);
        }
        break;
      }
      case "ArrowUp": {
        if (keys.length) {
          let last = keys[keys.length - 1];
          let lastIndex = grid.getRowIndexByKey(last) - 1;
          this.focusRow(lastIndex);
        } else {
          this.focusRow(0);
        }
        break;
      }
      case "Escape": {
        this.closePopup();
        break;
      }
      default: {
        // grid.clearSelection();
      }
    }
    this.searchBox.instance.focus();
  }

  private focusRow(rowIndex: number) {
    let grid = this.dataGrid.instance;
    if (rowIndex < 0 || rowIndex >= grid.totalCount()) rowIndex = 0;
    let rowKey = grid.getKeyByRowIndex(rowIndex);

    grid.selectRows([rowKey], false).then(() => {
      grid.getScrollable().scrollToElement(grid.getRowElement(rowIndex));
    });
  }



  ngOnDestroy() {
    //this.allowClearChange.unsubscribe();
    //this.dataChange.unsubscribe();
    //this.paramsChange.unsubscribe();
    //this.popupHeightChange.unsubscribe();
    //this.popupWidthChange.unsubscribe();
    //this.readOnlyChange.unsubscribe();
    //this.selectableChange.unsubscribe();
    //this.textChange.unsubscribe();
    //this.valueChange.unsubscribe();
    //
    this.localData = null;
  }

}
