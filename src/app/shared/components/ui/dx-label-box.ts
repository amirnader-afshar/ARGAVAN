import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";

@Component({
  selector: "dx-label-box",
  templateUrl: "./dx-label-box.html"
})
export class DXLabelBoxComponent {
  @Input() text: string = "text";
  @Input() hint: string = null;
  @Input() visible: boolean = true;

  _uid: string = "M" + Math.ceil(Math.random() * 10000);

  _tooltipVisible: boolean = false;
  toggleHint() {
    if (this.hint == null) {
      this._tooltipVisible = false;
    } else {
      this._tooltipVisible = !this._tooltipVisible;
    }
  }
}
