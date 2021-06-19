import { Component, OnInit, ViewChild} from '@angular/core';
import { TranslateService } from "../../../services/TranslateService";
import {
    DxLookupComponent
} from "devextreme-angular";

@Component({
  selector: 'lang-selector',
  templateUrl: './lang-selector.component.html',
  styleUrls: ['./lang-selector.component.scss']
})
export class LangSelectorComponent implements OnInit {
    LANGS: any;
    LANGS_NAMES = [];
    @ViewChild("comboBox",{ static: true }) comboBox: DxLookupComponent;

    constructor(public translate: TranslateService) {

        this.LANGS = JSON.parse(localStorage.getItem('USER_LANGS'));

        for (let i = 0; i < this.LANGS.length; i++) {

            this.LANGS_NAMES.push(this.LANGS[i].Lang_Name);
        }
        console.log(this.LANGS_NAMES);

    }

    ngOnInit() {
        this.comboBox.value = localStorage.getItem("USER_Defaultlang");
  }

    onValueChanged(e) {
        this.comboBox.value = e.value;
        this.translate.Refresh_DIC(e.value, true);

    }

}
