import { Injectable } from "@angular/core";
import { ConfigService } from "./ConfigService";

@Injectable()
export class ThemeService {

    constructor(private config: ConfigService) {

    }
    debuger;

    public set() {
        // this.config.load().then(() => {
        //     let theme = this.config.get('ADM-THEME');
        //     if (theme == '0') {
        //         this.defaultTheme();
        //     } else if (theme == '1') {
        //         this.compactTheme();
        //     } else {
        //         this.defaultTheme();
        //     }
        // }).catch(err => {
        //     this.defaultTheme();
        // });
    }
    lightTheme() {
        require('!style-loader!css-loader!../../../../node_modules/devextreme/dist/css/dx.light.css');
        require('!style-loader!css-loader!sass-loader!../../../../src/assets/css/Fixer.scss');
    }

    DarkTheme() {
        require('!style-loader!css-loader!../../../../node_modules/devextreme/dist/css/dx.dark.css');
        //require('!style-loader!css-loader!sass-loader!../../../../src/assets/css/Fixer-dark.scss');
    }

    LightMaterialTheme() {
        require('!style-loader!css-loader!../../../../node_modules/devextreme/dist/css/dx.material.blue.light.compact.css');
        //require('!style-loader!css-loader!sass-loader!../../../../src/assets/css/Fixer-material-light.scss');
    }
    SetUserTheme(themeName) {
        // if (themeName === 'lightTheme') {
        //     this.lightTheme();
        // }
        // else if (themeName === 'DarkTheme') {
        //     this.DarkTheme();
        // }
        // else if (themeName === 'LightMaterialTheme') {
        //     this.LightMaterialTheme();
        // }

    }

}