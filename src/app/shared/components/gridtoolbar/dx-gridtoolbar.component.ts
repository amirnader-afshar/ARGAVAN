import { Component, Input, AfterViewInit, ViewChild, Output, EventEmitter, ContentChild, ComponentFactoryResolver, ComponentFactory, Injector, EmbeddedViewRef, ApplicationRef, DoCheck, OnChanges, SimpleChanges } from '@angular/core';

import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { TranslateService } from '../../services/TranslateService';
import { DxMenuComponent, DxDataGridComponent, DxResizableComponent } from 'devextreme-angular';
import { Deferred } from '../../Deferred';
import { ServiceCaller } from '../../services/ServiceCaller';
import { DateTime, DateTimeFormat } from '../../util/DateTime';
import { DXGridToolbarDataSourceComponent } from './dataSource.component';
import { Dialog } from '../../util/Dialog';
import { ConfigService } from '../../services/ConfigService';

declare var $: any;

export class GridToolbarItemClickEventArgs {
  index: number;
  data: any;
  name: string;
  handled: boolean = false;
}
export class GridToolbarItemPreperingEventArgs {
  name: string;
  data: any;
  visible: boolean = true;
  disabled: boolean = false;
}

export class GridRowDbClickEventArgs {
  data: any;
  key: any;
  index: boolean = true;
  handled: boolean = false;
}





@Component({
  selector: 'grid-toolbar',
  templateUrl: './dx-gridtoolbar.component.html',
  entryComponents: [DxMenuComponent]
})
export class DXGridToolbarComponent implements AfterViewInit, OnChanges {

  @ViewChild(DxMenuComponent, { static: true }) menu: DxMenuComponent;
  @ViewChild('resizable', { static: true }) resizable: DxResizableComponent;
  @ContentChild(DxDataGridComponent, { static: true }) grid: DxDataGridComponent;
  @ContentChild(DXGridToolbarDataSourceComponent, { static: true }) dataSource: DXGridToolbarDataSourceComponent;


  @Output() onButtonClick = new EventEmitter<string>();
  @Output() onMenuItemClick = new EventEmitter<GridToolbarItemClickEventArgs>();
  @Output() onMenuItemPrepering = new EventEmitter<GridToolbarItemPreperingEventArgs>();
  @Output() onCancelEditRow = new EventEmitter<any>();
  @Output() onRowDbClick = new EventEmitter<GridRowDbClickEventArgs>();


  allowEdit: boolean | Function = false;
  allowDelete: boolean | Function = false;
  allowInsert: boolean = false;

  fields: any = [];
  isColumnConfig: boolean = false;
  saveApi: string;
  localData: any = [];

  currentEditRow: any = null;

  @Input() guid: string = null;

  /** disable or Show Resizable Toggle */
  @Input() ToggleHeightDisabled = false;
  /** minimum and Maximum Height (DxGrid + DxResizable) --> vh */
  @Input() ToggleHeight: any;
  /** یک آبجکت به هرکامپوننتی میفرسه که بعد روی این حالات در هرجایی بشه مقدارهایی را تغییر داد. */
  @Output() ToggleHeight_ShowPanels: EventEmitter<object> = new EventEmitter();
  /** متغیری فقط برای نشان دادن تب های زیر جدول دوحالت . true , false */
  ToggleMenuGridShow = false;


  // Items
  private _rowMenuItems: any[] = [];
  @Input()
  get rowMenuItems(): any[] {
    return this._rowMenuItems;
  }

  set rowMenuItems(val: any[]) {
    this._rowMenuItems = val;
  }

  // Header Items
  private _headerMenuItems: any[] = [];
  @Input()
  get headerMenuItems(): any[] {
    return this._headerMenuItems;
  }

  set headerMenuItems(val: any[]) {
    this._headerMenuItems = val;
  }


  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    public translate: TranslateService,
    private service: ServiceCaller,
    private config: ConfigService,
  ) {

  }



  createDataSource() {
    let dataSource: any = {};
    dataSource.store = new CustomStore({
      key: 'ID',
      load: (loadOptions) => {
        loadOptions.requireTotalCount = false;
        let params: any = {};
        params.Skip = loadOptions.skip;
        params.Take = loadOptions.take;
        params.SearchQuery = loadOptions.searchExpr;
        Object.assign(params, this.dataSource.loadParams);
        //
        let deferred: Deferred<any> = new Deferred<any>();
        if (this.dataSource.loadUrl) {
          this.service.get(this.dataSource.loadUrl, (data) => {

            if ((this.grid.remoteOperations as any).paging) {
              let result = {
                data: data.Items,
                totalCount: data.TotalCount
              }
              //this.localData = data.Items;
              this.setLocalData(data.Items);
              deferred.resolve(result);
            }
            else {
              //this.localData = data;
              this.setLocalData(data);
              deferred.resolve(data);
            }
          }, params);
        }
        else {
          deferred.resolve([]);
        }

        return deferred.promise;
      },
      update: (key, values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        if (this.dataSource.updateUrl) {
          // this.grid.instance.byKey(key).then(row => {
          //   let data: any = Object.assign(row, values);
          //   data[this.grid.keyExpr.toString()] = key;
          //   if (this.dataSource.saveParams) {
          //     Object.assign(data, this.dataSource.saveParams);
          //   }
          //   console.log("update", data);
          //   this.service.post(this.dataSource.updateUrl, (result) => {
          //     deferred.resolve(result);
          //   }, data, (error) => {
          //     deferred.reject(error);
          //   });
          // });

          //let row = this.grid.instance.getDataSource().items().find(c => c.ID == key);
          let row = this.localData.find(c => c.ID == key);
          let data: any = Object.assign(row, values);
          data[this.grid.keyExpr.toString()] = key;
          if (this.dataSource.saveParams) {
            Object.assign(data, this.dataSource.saveParams);
          }
          this.service.post(this.dataSource.updateUrl, (result) => {
            deferred.resolve(result);
          }, data, (error) => {
            deferred.reject(error);
          });
        }
        else {
          deferred.resolve(true);
        }

        return deferred.promise;
      },
      insert: (values) => {
        let deferred: Deferred<any> = new Deferred<any>();

        if (this.dataSource.insertUrl) {
          let data: any = Object.assign({}, values);
          if (this.dataSource.saveParams) {
            Object.assign(data, this.dataSource.saveParams);
          }
          // console.log("insert", data);
          this.service.post(this.dataSource.insertUrl, (result) => {
            deferred.resolve(result);
          }, data, (error) => {
            deferred.reject(error);
          });
        }
        else {
          deferred.resolve(true);
        }

        return deferred.promise;
      },
      remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        if (this.dataSource.removeUrl) {
          let list: any[] = [];
          list.push(key);
          this.service.post(this.dataSource.removeUrl, (result) => {
            deferred.resolve(result);
          }, list, (error) => {
            deferred.reject(error);
          });
        }
        else {
          deferred.resolve(true);
        }
        return deferred.promise;
      }
    });
    return dataSource;
  }

  ngOnInit() {
    // console.log('init ...');

    this.grid.columnResizingMode = 'widget';
    if (!this.grid.sorting)
      this.grid.sorting = {};
    this.grid.sorting.mode = 'multiple';
    if (!this.grid.filterRow)
      this.grid.filterRow = {};

    this.grid.filterRow.visible = this.config.get('ADM-USER-SHOW-FILTER') == '1';
    this.grid.filterRow.showOperationChooser = false;


    if (!this.grid.pager)
      this.grid.pager = {};

    this.grid.pager.visible = this.config.get('ADM-USER-SHOW-PAGING') == '1';
    this.grid.pager.showInfo = true;


    this.grid.onToolbarPreparing.subscribe((e) => {
      e.toolbarOptions.visible = false;
    });
  }


  /** با ارسال مقدار های متفاوت برای این متغیر ارتفاع گرید تغییر میکند */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.ToggleHeight) {
      this.grid.height = `${changes.ToggleHeight.currentValue + 'vh'}`;
      this.resizable.height = `${(changes.ToggleHeight.currentValue + 3) + 'vh'}`;
    }

    /** درحالتی که چند جدول در صفحه داریم آنهایی که مقدارش تروو هست را فقط پاک میکند */
    if (changes.ToggleHeightDisabled) {
      if (changes.ToggleHeightDisabled.currentValue === true) {
        this.resizable.height = '0';
        $('dx-resizable').ready(function () {
          $('#dxresizable_true > i').remove();
          $('#dxresizable_true > div').remove();
          $('#dxresizable_true').removeAttr('style');
        });

      }
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {

      if (this.dataSource.formCode)
        this.grid.dataSource = this.createDynamicDataSource();
      else
        this.grid.dataSource = this.createDataSource();
    }

    this.allowInsert = this.grid.editing.allowAdding;
    this.allowEdit = this.grid.editing.allowUpdating;
    this.allowDelete = this.grid.editing.allowDeleting;
    //
    if (this.guid) {
      this.grid.instance.option('stateStoring.enabled', true);
      this.grid.instance.option('stateStoring.storageKey', this.guid);
    }
    this.grid.instance.option('scrolling.showScrollbar', 'always');
    this.grid.hoverStateEnabled = true;
    this.grid.columnAutoWidth = true;
    this.grid.rowAlternationEnabled = true;
    this.grid.showRowLines = true;
    this.grid.showBorders = true;
    this.grid.allowColumnReordering = true;
    this.grid.allowColumnResizing = true;
    this.grid.editing.texts.confirmDeleteMessage = null;

    //
    this.grid.instance.deleteColumn('CMD');
    //
    let col = {
      visibleIndex: 0,
      width: 80,
      alignment: 'center',
      name: 'CMD',
      id: 'CMD',
      allowExporting: false,
      allowFiltering: false,
      allowFixing: false,
      allowGrouping: false,
      allowHeaderFiltering: false,
      allowHiding: false,
      allowReordering: false,
      allowResizing: false,
      allowSearch: false,
      allowSorting: false,
      allowEditing: false,
      //fixed: true,
      //fixedPosition: "right"
    };
    if (this.allowDelete || this.allowInsert || this.allowEdit || (this.rowMenuItems && this.rowMenuItems.length))
      this.grid.instance.addColumn(col);

    // Provide double click for grid  
    this.grid.onRowClick.subscribe(this.onRowClick);
    // provide shortcuts
    this.grid.onKeyDown.subscribe(this.onKeyDown);
    // remove default command column
    this.grid.onContentReady.subscribe(e => {
      this.grid.editing.allowAdding = false;
      this.grid.editing.allowUpdating = false;
      this.grid.editing.allowDeleting = false;
      e.component.columnOption('command:edit', 'visible', false);
    });
    // add custom command column
    this.grid.onCellPrepared.subscribe(this.onCellPrepared);
  }



  private onCellPrepared = (e) => {
    //
    if (e.rowType === 'header' && e.column.name === 'CMD') {
      let cellElement = (e.cellElement as HTMLDivElement);
      const childComponentFactory = this.resolver.resolveComponentFactory(DxMenuComponent);
      let componentRef = childComponentFactory.create(this.injector);
      this.appRef.attachView(componentRef.hostView);
      let root = {
        icon: 'fa fa-bars white grid-header-bar-icon',
        name: 'root',
        items: []
      };
      if (this.allowInsert) {
        root.items.push({
          text: 'ایجاد (ctrl + insert)',
          icon: 'fa fa-plus green',
          name: 'DXInsert',
          beginGroup: true
        });
      }

      root.items.push({
        text: 'بروز رسانی (ctrl + dot)',
        icon: 'fa fa-refresh blue',
        name: 'DXRefresh',
      });
      root.items.push({
        text: 'نمایش ردیف فیلتر',
        icon: 'fa fa-search blue',
        name: 'DXToggleFilterRow',
      });
      root.items.push({
        text: 'انتخاب ستونها',
        icon: 'fa fa-table blue',
        name: 'DXColumnChooser',
      });
      root.items.push({
        text: 'مشاهده جزئیات بیشتر',
        name: 'GridResizingToggle',
        icon: 'fa fa-arrows-v text-muted',
      });

      if (this.allowDelete && this.grid.selection.mode == 'multiple') {
        root.items.push({
          text: 'حذف موارد انتخاب شده',
          icon: 'fa fa-trash red',
          name: 'DXSelectedDelete',
        });
      }

      for (const key in this.headerMenuItems) {
        if (this.headerMenuItems.hasOwnProperty(key)) {
          const item = this.headerMenuItems[key];
          root.items.push(item);
        }
      }


      if (root.items) {

        for (let i in root.items) {
          let event = new GridToolbarItemPreperingEventArgs();
          event.data = null;
          event.name = root.items[i].name;
          this.onMenuItemPrepering.emit(event);
          root.items[i].visible = event.visible;
          root.items[i].disabled = event.disabled;
        }

        componentRef.instance.items = [root];
        cellElement.innerHTML = '';
        cellElement.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
        componentRef.instance.onItemClick.subscribe((d) => {
          this.menuClick(d.itemData.name, e.rowIndex, e.data);
        });
      }
    }
    if (e.rowType === 'data' && e.column.name === 'CMD') {
      let cellElement = (e.cellElement as HTMLDivElement);
      const childComponentFactory = this.resolver.resolveComponentFactory(DxMenuComponent);
      let componentRef = childComponentFactory.create(this.injector);
      this.appRef.attachView(componentRef.hostView);
      //
      let isEditing: boolean = e.isEditing || (e.row ? e.row.isEditing : false);
      if (isEditing) {
        let rootV = [
          {
            icon: 'fa fa-floppy-o blue',
            name: 'DXSave',
          },
          {
            icon: 'fa fa-undo',
            name: 'DXCancel',
          }
        ];
        componentRef.instance.items = rootV;
      }
      else if (!isEditing) {
        let clone: any[] = this.rowMenuItems ? this.rowMenuItems.map(x => Object.assign({}, x)) : [];

        let root = {
          icon: 'fa fa-cogs',
          name: 'root',
          items: []
        };
        if (this.allowEdit) {
          root.items.push({
            text: 'ویرایش ( Enter )',
            icon: 'fa fa-pencil yellow',
            name: 'DXEdit',
          });
        }
        if (this.allowDelete) {
          root.items.push({
            text: 'حذف (ctrl + delete)',
            icon: 'fa fa-trash red',
            name: 'DXDelete'

          });
        }
        for (let j in clone) {
          let i = clone[j];
          root.items.push({
            text: i.text,
            name: i.name,
            icon: i.icon,
            visible: i.visible,
            disabled: i.disabled,
          });
        }

        for (let i in root.items) {
          let event = new GridToolbarItemPreperingEventArgs();
          event.data = e.data;
          event.name = root.items[i].name;
          this.onMenuItemPrepering.emit(event);
          root.items[i].visible = event.visible;
          root.items[i].disabled = event.disabled;
        }

        if (root.items) {
          componentRef.instance.items = [root]
        }

      }
      cellElement.innerHTML = '';
      cellElement.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
      componentRef.instance.onItemClick.subscribe((d) => {
        this.menuClick(d.itemData.name, e.rowIndex, e.data);
      });

    }
    if (e.rowType === 'data' && e.column.dataType === 'date') {
      let cellElement = (e.cellElement as HTMLDivElement);
      let isEditing: boolean = e.isEditing || (e.row ? e.row.isEditing : false);
      if (!isEditing)
        cellElement.innerHTML = DateTime.convertToLocal(e.value);
    }
    if (e.rowType === 'data' && e.column.dataType === 'dateTime') {
      let cellElement = (e.cellElement as HTMLDivElement);
      let isEditing: boolean = e.isEditing || (e.row ? e.row.isEditing : false);
      if (!isEditing)
        cellElement.innerHTML = DateTime.convertToLocal(e.value, DateTimeFormat.DateTime);
    }
    if (e.rowType == 'data' && e.column.dataType == 'time') {
      let cellElement = (e.cellElement as HTMLDivElement);
      let isEditing: boolean = e.isEditing || (e.row ? e.row.isEditing : false);
      if (!isEditing)
        cellElement.innerHTML = DateTime.convertToLocal(e.value, DateTimeFormat.Time);
    }
    if (e.rowType == 'data' && e.column.dataType == 'currency') {
      let cellElement = (e.cellElement as HTMLDivElement);
      let isEditing: boolean = e.isEditing || (e.row ? e.row.isEditing : false);
      if (!isEditing && e.value != null)
        cellElement.innerHTML = e.value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }
  };


  private onRowClick = (e) => {

    let component = e.component;
    let prevClickTime: any = component.lastClickTime2;
    component.lastClickTime2 = new Date();
    if (e.rowType == 'data') {
      let event = new GridRowDbClickEventArgs();
      event.data = e.data;
      event.index = e.rowIndex;
      event.key = e.key;
      //
      if (prevClickTime && (component.lastClickTime2 - prevClickTime < 300)) {
        this.onRowDbClick.emit(event);
        if (!event.handled) {
          let defaults = this.rowMenuItems ? this.rowMenuItems.filter(c => c.default) : [];
          if (defaults.length) {
            this.menuClick(defaults[0].name, e.rowIndex, e.data);
          }
          else {
            this.menuClick('DXEdit', e.rowIndex, e.data);
          }
        }
      }
      else {
      }
    }
  }

  private onKeyDown = (e) => {
    let grid = this.grid.instance;
    let keys = grid.getSelectedRowKeys();
    let rowIndex = -1;
    let rowData = null;
    if (keys.length == 1) {
      rowIndex = grid.getRowIndexByKey(keys[0]);
      rowData = grid.getSelectedRowsData()[0];
    }
    // 
    switch (e.event.code) {
      case 'Insert':
        if (e.event.ctrlKey)
          this.menuClick('DXInsert', -1, null);
        break
      case 'Enter':
        if (rowIndex > -1) {
          this.menuClick('DXEdit', rowIndex, rowData);
        }
        break
      case 'Delete':
        if (e.event.ctrlKey) {
          this.menuClick('DXDelete', rowIndex, rowData);
          e.event.preventDefault();
        }
        break
      case 'Period':
        if (e.event.ctrlKey) {
          this.menuClick('DXRefresh', -1, null);
          e.event.preventDefault();
        }
        break
    }
  }


  private checkColumns() {

  }

  private menuClick(name: string, rowIndex: number, data: any) {
    let item = new GridToolbarItemClickEventArgs();
    item.data = data;
    item.index = rowIndex;
    item.name = name;
    let grid = this.grid.instance;
    switch (item.name) {
      case 'root':
        return;
      case 'DXDelete':
        {
          if (this.allowDelete) {
            this.onMenuItemClick.emit(item);
            if (item.handled == false) {
              Dialog.delete().done(() => {
                let key = grid.getKeyByRowIndex(item.index);
                grid.getDataSource().store().remove(key).then(() => {

                  grid.refresh();
                });
              }).final(() => {

                grid.focus();
              });;
            }
          }
          break;
        }
      case 'DXInsert':
        {
          if (this.allowInsert) {
            this.onMenuItemClick.emit(item);
            if (item.handled == false)
              grid.addRow();
          }
          break;
        }
      case 'DXSelectedDelete':
        {
          this.onMenuItemClick.emit(item);
          break;
        }
      case 'DXEdit':
        {
          if (this.allowEdit) {
            this.onMenuItemClick.emit(item);
            this.currentEditRow = {};
            Object.assign(this.currentEditRow, item.data);
            if (item.handled == false)
              grid.editRow(rowIndex);
          }
          break;
        }
      case 'DXSave':
        {
          this.onMenuItemClick.emit(item);
          if (item.handled == false)
            grid.saveEditData();
          break;
        }
      case 'DXCancel':
        {

          this.onMenuItemClick.emit(item);
          if (item.handled == false) {
            Object.assign(item.data, this.currentEditRow);
            this.onCancelEditRow.emit(item);
            grid.cancelEditData();
          }
          break;
        }
      case 'DXToggleFilterRow':
        {
          grid.option({ filterRow: { visible: !this.grid.filterRow.visible } });
          break;
        }

      case 'DXColumnChooser':
        {
          grid.showColumnChooser();
          break;
        }
      case 'DXRefresh':
        {
          grid.refresh();
          break;
        }
      case 'GridResizingToggle':
        {
          /**
           * کلیک روی مشاهذه بیشتر جدول
           *  یک آبجکت به هرکامپوننتی میفرسه که بعد روی این حالات در هرجایی بشه مقدارهایی را تغییر داد. 
          * */
          this.ToggleMenuGridShow = !this.ToggleMenuGridShow;
          if (this.ToggleMenuGridShow) {
            this.ToggleHeight_ShowPanels.emit({ ShowPanel: true });
            if (this.ToggleHeight_ShowPanels) {
              this.grid.height = `${this.ToggleHeight + 'vh'}`;
              this.resizable.height = `${(this.ToggleHeight + 3) + 'vh'}`;
            }

          } else {
            this.ToggleHeight_ShowPanels.emit({ ShowPanel: false });
            if (!this.ToggleHeight_ShowPanels) {
              this.grid.height = `${this.ToggleHeight + 'vh'}`;
              this.resizable.height = `${(this.ToggleHeight + 3) + 'vh'}`;
            }
          }
          break;
        }
      default:
        this.onMenuItemClick.emit(item);
    }
  }


  addColumns() {
    if (this.isColumnConfig)
      return;
    // console.log("addColumns")
    // console.log(this.fields)

    this.grid.instance.deleteColumn('ID');
    //
    for (var i in this.fields) {
      var f = this.fields[i];
      var dataType: string = 'string';
      if (f.Name == 'ID')
        continue;
      // boolean
      if (f.DataType == 1)
        dataType = 'boolean';
      // Numeric
      else if (f.DataType == 2)
        dataType = 'number';
      // DateTime
      else if (f.DataType == 21)
        dataType = 'dateTime';
      else if (f.DataType == 22)
        dataType = 'date';
      else if (f.DataType == 23)
        dataType = 'time';
      // other
      else
        dataType = 'string';

      var col = {
        dataField: f.Name,
        caption: this.translate.instant(f.Title),
        width: f.Width,
        dataType: dataType,
        validationRules: f.Required == true && f.ControlType != 4 ? [{ type: 'required', message: 'این فیلد اجباری است' }] : null,
        allowEditing: f.AllowEdit,
        lookup: f.ControlType != 5 ? null : this.createLookupDataSource(f),
      };

      this.grid.instance.addColumn(col);
    }
    this.grid.instance.endUpdate();
    this.isColumnConfig = true;
  }


  cellTemplate(cell, field) {
    this.service.post('/SYS/Forms/List/Post', (data) => {
    }, { code: field.Lookup, Params: [{ Name: 'ID', Value: cell.value }] });
  }

  createLookupDataSource(field): any {
    let item = {
      allowClearing: field.Required != true,
      dataSource: new CustomStore({
        key: 'ID',
        load: (loadOptions) => {
          // 
          let deferred: Deferred<any> = new Deferred<any>();
          this.service.get('/SYS/Forms/List', (data) => {
            deferred.resolve(data.Data);
          }, { code: field.Lookup });
          return deferred.promise;
        },
        byKey: (key) => {
          let deferred: Deferred<any> = new Deferred<any>();
          this.service.get('/SYS/Forms/List', (data) => {
            deferred.resolve(data.Data);
          }, { code: field.Lookup, Params: [{ Name: 'ID', Value: key }] });
          return deferred.promise;
        }
      }),
      displayExpr: 'Title',
      valueExpr: 'ID'
    };

    return item;
  }


  createDynamicDataSource(): any {
    let dataSource: any = {};
    dataSource.store = new CustomStore({
      key: 'ID',
      load: (loadOptions) => {
        let that = this;
        let filter: any = {};
        filter.Code = this.dataSource.formCode;
        filter.Params = [];
        for (let i in this.dataSource.loadParams) {
          filter.Params.push({ Name: i, Value: this.dataSource.loadParams[i] });
        }
        filter.Skip = loadOptions.skip;
        filter.Take = loadOptions.take;
        if (loadOptions.sort && loadOptions.sort.length) {
          let sort: string[] = [];
          for (const i in loadOptions.sort) {
            let c = loadOptions.sort[i];
            sort.push(c.selector + ' ' + (c.desc ? 'desc' : ''));
          }
          filter.Sort = sort.join(',');
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


        // return this.getFormList(filter).then(data => {
        //   that.dataGrid.keyExpr = this.valueField;
        //   that.addColumns();
        //   return {
        //     data: data.Data,
        //     totalCount: data.TotalRowCount
        //   }
        // })
        let deferred: Deferred<any> = new Deferred<any>();
        this.service.getPromise('/SYS/Forms/List', filter).then((data) => {
          this.saveApi = data.SaveApi;
          this.fields = data.Fields;
          this.addColumns();
          deferred.resolve(data.Data);
        });
        return deferred.promise;
      },
      update: (key, values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        if (this.saveApi) {
          let row = this.grid.instance.getDataSource().items().find(c => c.ID == key);
          let data: any = Object.assign(row, values);
          this.service.post(this.saveApi, (result) => {
            deferred.resolve(result);
          }, data, (error) => {
            deferred.reject(error);
          });
        }
        else {
          var fields = [];
          fields.push({ Name: 'ID', Value: key });
          for (var i in values) {
            fields.push({ Name: i, Value: values[i] });
          }
          let data = {
            ID: key,
            FormCode: this.dataSource.formCode,
            Fields: fields
          };
          this.service.post('/SYS/Forms/Save', (result) => {
            deferred.resolve(result);
          }, data, (error) => {
            deferred.reject(error);
          });
        }
        return deferred.promise;
      },
      insert: (values) => {
        let deferred: Deferred<any> = new Deferred<any>();

        if (this.saveApi) {
          this.service.post(this.saveApi, (result) => {
            deferred.resolve(result);
          }, values, (error) => {
            deferred.reject(error);
          });
        }
        else {
          var fields = [];
          for (var i in values) {
            fields.push({ Name: i, Value: values[i] });
          }
          var data = {
            FormCode: this.dataSource.formCode,
            Fields: fields
          };
          this.service.post('/SYS/Forms/Save', (result) => {
            deferred.resolve(result);
          }, data, (error) => {
            deferred.reject(error);
          });
        }
        return deferred.promise;
      }
    });
    return dataSource;
  }


  private _showRefresh: boolean = false;
  @Input()
  get showRefresh(): boolean {
    return this._showRefresh;
  }
  set showRefresh(val: boolean) {
    this._showRefresh = val;
  }


  private _showNew: boolean = false;
  @Input()
  get showNew(): boolean {
    return this._showNew;
  }
  set showNew(val: boolean) {
    this._showNew = val;
  }

  private _showEdit: boolean = false;
  @Input()
  get showEdit(): boolean {
    return this._showEdit;
  }
  set showEdit(val: boolean) {
    this._showEdit = val;
  }

  private _showDelete: boolean = false;
  @Input()
  get showDelete(): boolean {
    return this._showDelete;
  }
  set showDelete(val: boolean) {
    this._showDelete = val;
  }


  setLocalData(data) {
    if (this.localData != undefined && this.localData.length > 0) {
      for (var i = 0; i < data.length; i++) {
        //let dataFeild = this.localData.find(c => c.ID == data[i].ID);
        let dataFeild = this.localData.find(c => c[this.grid.keyExpr.toString()] == data[i][this.grid.keyExpr.toString()]);
        if (dataFeild == undefined) {
          this.localData.push(data[i]);
        }
      }
    }
    else {
      Object.assign(this.localData, data);
    }
  }


  /** تغییر اندازه جدول به هر اندازه ای که کاربر دوست داره --------------------------- */
  onResizeableGrid(e) {
    this.grid.height = e.height - 20;
  }

}


