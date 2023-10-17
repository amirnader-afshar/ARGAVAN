import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'panel-box',
    templateUrl: "./panelbox.component.html",
    animations: [
        trigger('visibilityChanged', [
            state('shown', style({ opacity: 1, height: '*' })),
            state('hidden', style({ opacity: 0, height: '0px', overflow: 'hidden' })),
            transition('shown => hidden', animate('200ms')),
            transition('hidden => shown', animate('300ms')),
        ])
    ]
})
export class PanelBoxComponent {

    visiblityState: string = 'shown';

    @Output() captionChange: EventEmitter<string> = new EventEmitter<string>();
    private _caption: string;
    @Input()
    get caption(): string {
        return this._caption;
    }
    set caption(val: string) {
        this._caption = val || 'caption';
        this.captionChange.emit(this._caption);
    }


    @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    private _collapsed: boolean = false;

    @Input()
    get collapsed(): boolean {
        return this._collapsed;
    }
    set collapsed(val: boolean) {
        if (val != this._collapsed) {
            // setTimeout(() => {
                this._collapsed = val;
                this.visiblityState = val ? 'hidden' : 'shown';
                this.collapsedChange.emit(this._collapsed);
            // }, 300);
        }
    }

    @Input()
    isParent: boolean = false;

    @Input()
    allowCollapse: boolean = true;

    @Input()
    visible: boolean = true;

    toggle() {
        this.collapsed = !this.collapsed;
    }

}
