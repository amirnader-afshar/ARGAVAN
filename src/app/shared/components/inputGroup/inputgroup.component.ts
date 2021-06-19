import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  ViewContainerRef,
  ViewChild,
  EventEmitter,
  Output
} from "@angular/core";
@Component({
  selector: "input-group",
  templateUrl: "./inputgroup.component.html"
})
export class InputGroupComponent {
  constructor() {}
  @Input() label: string = "";

  @Input() hintText: string = "";

  @Input() icon: string = "fa fa-eye";

  // On Button Click
  @Output() onButtonClick = new EventEmitter();
  onClick() {
    this.onButtonClick.emit();
  }
}
