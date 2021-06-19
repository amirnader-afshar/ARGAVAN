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
  selector: "textview",
  templateUrl: "./textview.component.html",
  styleUrls: ["./textview.component.scss"]
})
export class TextViewComponent {
  @Input() height: number = 100;
  
}
