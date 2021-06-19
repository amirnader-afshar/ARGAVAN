import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { Deferred } from '../../../shared/Deferred';
import { BasePage } from '../../../shared/BasePage';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify } from '../../../shared/util/Dialog';
import { CoreService } from '../../../shared/services/CoreService';
import { ADMPrivilegePopupPage } from './privileges.popup';

@Component({
  templateUrl: './group.page.html'
})

export class ADMGroupsSecurityPage extends BasePage implements OnInit {

  ngOnInit() {

  }
  @ViewChild('Treegrid',{static: false}) dataGrid: DxDataGridComponent;
  @ViewChild('lists',{static: false}) lists: DxDataGridComponent;

  selectedRowId: string = null;
  SubjectsTypDataSource: any = {};
  dataSource: any = {};
  TreeViewDataSource: any = {};
  localData: any = [];
  AddUserPopup: boolean = false;
  AddPrivilagesPopup: boolean = false;
  selectedKeys: any = [];
  SelectedParentID: any;
  lessMode: boolean = true;
  allowDeleting: boolean = false;
  searchitem: any = {};
  userList: any = [];
  TreeViewSubjectDataSource: any = {};

  selectedUserkeys: any[] = [];

  menuItems: any[] = [
  ];

  treeItems = [
    {
      name: "AssignUser",
      text: 'انتخاب کاریر',
      icon: "fa fa-user-plus blue",
    },
    {
      name: "Privilages",
      text: 'مجوزهای دسترسی',
      icon: "fa fa-hand-pointer-o green",
    }
  ];



  constructor(public core: CoreService) {
    super(core.translate);

    //tree gide
    this.dataSource.store = new CustomStore({

      key: "ID",
      load: (loadOptions) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.core.http.get("/ADM/Setup/Group/List", (data) => {

          this.localData = data;
          deferred.resolve(data);
        })
        return deferred.promise;
      },
      update: (key, values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        var editItem = this.localData.filter(c => c.ID == key)[0];
        Object.assign(editItem, values);
        this.core.http.post("/ADM/Setup/Group/Save", (data) => {
          deferred.resolve(data);
        }, editItem, (error) => {
          deferred.reject(error);
        })
        return deferred.promise;
      },
      insert: (values) => {
        let deferred: Deferred<any> = new Deferred<any>();
        this.core.http.post("/ADM/Setup/Group/Save", (data) => {
          deferred.resolve(data);
        }, values, (error) => {
          deferred.reject(error);
        })
        return deferred.promise;
      }
      , remove: (key) => {
        let deferred: Deferred<any> = new Deferred<any>();
        var list: any = [];
        list.push(key);
        this.core.http.post("/ADM/Setup/Group/Delete", (data) => {
          deferred.resolve(data);
        }, list)
        return deferred.promise;
      }
    });
  }


  onMenuItemClick(name) {

  }

  selectionChangedHandler() {
    if (this.selectedKeys.length == 1) {
      this.selectedRowId = this.selectedKeys[0];
    }
    else {
      this.selectedRowId = null;
    }
  }

  onOkClick() {
    var param: any = {};
    param.GroupId = this.selectedRowId;
    param.UserIdList = this.selectedUserkeys;

    this.core.http.post("/ADM/Setup/AssignGroup/Save", (data) => {
      Notify.success();
      this.AddUserPopup = false;
    }, param);
  }

  onItemClick(e) {
    this.SelectedParentID = e.itemData.ID;
  }


  selectionChanged(e) {
  }

  onTreeItemClick(e) {
    if (e.name == "AssignUser") {
      var param: any = {};
      param.ID = this.selectedRowId;
      this.core.http.get("/ADM/Setup/AssignUser/List", (data) => {
        this.userList = data;
        this.selectedUserkeys = this.userList.filter(c => c.Checked == true).map(x => x.ID);
        this.AddUserPopup = true;
      }, param);
      e.handled = true;
    }
    if (e.name == "Privilages") {
      
      if (e.data != undefined) {
        this.AddPrivilagesPopup = true;
        // this.core.popup.open(ADMPrivilegePopupPage,
        //   {
        //     width: "800",
        //     height: "600",
        //     data: { itemId: e.data.ID, level: "group" }
        //   });
      }
    }
  }
}
