import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  ViewContainerRef,
  ViewChild,
  EventEmitter,
  Output,
  ElementRef,
} from "@angular/core";

@Component({
  selector: "bordered-input",
  templateUrl: "./borderedinput.component.html"
})
export class BorderedInputComponent {

  @ViewChild('inputText', {static: false}) inputOne: ElementRef;

  constructor() { }

  @Input() hintText: string = "";
  @Input() text: string = "";

  // On Button Click
  // @Output() onButtonClick = new EventEmitter();
  // onClick() {
  //     this.onButtonClick.emit();
  // }

  _uid: string = "input" + Math.ceil(Math.random() * 10000);

  _hintVisible: boolean = false;


  toggleHint() {
    if (this.hintText == "") {
      this._hintVisible = false;
    } else {
      this._hintVisible = !this._hintVisible;
    }
  }

  selected(ev) {
    console.log('UID', this._uid);
    const inputElem = <HTMLInputElement>this.inputOne.nativeElement;
    inputElem.select();
  }
}

