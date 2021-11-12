import { Component, OnInit ,Input} from '@angular/core';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'edu-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  @Input() item: any = {};
  en = environment;
  constructor() { }

  ngOnInit(): void {
  
  }

}
