import {
  Component,
  Input,
  EventEmitter,
  Output
} from "@angular/core";

@Component({
  selector: "dx-label",
  templateUrl: "./label.component.html"
})
export class LabelComponent {
  // @Input() text: string = "Label";
  @Input() icon: string = null;
  _text: string = "Label";
  _text_hint: string = "Label";
  get text(): string {
    return this._text;
  }
  @Input("text")
  set text(value: string) {
    this._text_hint= value;
    if (value.length > 50) {
      this._text = value.substring(0, 47) + " ...";
    } else {
      this._text = value;
    }
  }

  @Input() visible: boolean = true;

  _uid: string = "M" + Math.ceil(Math.random() * 10000);

  _hintVisible: boolean = false;

  @Input() hintText: string = "";

  toggleHint() {
    if (this.hintText == "") {
      this._hintVisible = false;
    } else {
      this._hintVisible = !this._hintVisible;
    }
  }

  // On Button Click
  @Output() onButtonClick = new EventEmitter();
  onClick() {
    this.onButtonClick.emit();
  }
}
