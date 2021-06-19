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
  selector: "trans-input",
  templateUrl: "./transinput.component.html",
  styleUrls: ["./transinput.component.scss"]
})
export class TransInputComponent {
  @Input() hintText: string = "";

  @Input() visible: boolean = true;

  _uid: string = "M" + Math.ceil(Math.random() * 10000);
}
