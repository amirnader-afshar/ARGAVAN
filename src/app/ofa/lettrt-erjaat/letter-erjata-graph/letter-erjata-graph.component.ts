import { Component, OnInit } from '@angular/core';
import ArrayStore from 'devextreme/data/array_store'
import {Router, ActivatedRoute } from '@angular/router';

import { RouteData } from '../../../shared/util/RouteData';
import { ServiceCaller } from '../../../shared/services/ServiceCaller';
@Component({
  selector: 'app-letter-erjata-graph',
  templateUrl: './letter-erjata-graph.component.html',
  styleUrls: ['./letter-erjata-graph.component.scss']
})
export class LetterErjataGraphComponent implements OnInit {
  flowNodesDataSource: ArrayStore;
  flowEdgesDataSource: ArrayStore;
  item;
  letterType;
  dataToPostBody;
  menuItems=[ { name: "cancel",
  text: 'بازگشت',
  icon: "fa fa-arrow-left",
  visible: true
}];
  constructor(private routeData: RouteData, public service: ServiceCaller,private route: ActivatedRoute, public router: Router) {
    this.item = this.routeData.pop('ofa_outLetter');
    this.loadGraph();
    this.route.queryParams.subscribe(params => {          
      this.letterType=params["letterType"];
    });
}
loadGraph(){
  this.dataToPostBody = {
    'Data': {
      'SPName': '[OFA].[OFA_Sp_LETTER_ERJA_GRAPH_SELECT]',
      'Data_Input': {         
       'Header': {'LETTER_ERJA_LETTER_ID':this.item.LETTER_ID
                   }
      , 'Detail': '', 'InputParams': '' }
    }
    
  }

  this.service.postPromise("/adm/CommenContext/Run", this.dataToPostBody).
  then((data) => {     
    

      this.flowNodesDataSource = new ArrayStore({
        key: "id",
        data: data.ReturnData.Data_Output[0].Header.GRAPH_NODES
    });
    this.flowEdgesDataSource = new ArrayStore({
        key: "id",
        data: data.ReturnData.Data_Output[0].Detail.GRAPH_EDGES
    }); 
          
  });
}

  ngOnInit(): void {
    
  
  }

  onMenuItemClick(name) {

    if (name == "cancel") {

      if(this.letterType=='out')
        this.router.navigate(["ofa/outLetter"],{ queryParams: { LETTER_ID: this.item.LETTER_ID 
                                                                ,GRID_SOURCE:this.letterType} } );
      else  
        this.router.navigate(["ofa/inLetter"],{ queryParams: { LETTER_ID: this.item.LETTER_ID 
                                                                ,GRID_SOURCE:this.letterType} });
      
    }
  }

}
