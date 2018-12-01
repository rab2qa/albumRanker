import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Container } from './../../classes/container';

@Component({
    selector: 'ranker-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit {

    @Input() container: Container<any>;
    @Input() canReorder: boolean = false;

    public listHeader: string;

    public ngOnInit(): void {
        this.listHeader = this.setListHeader(this.container.name);
    }

    public setListHeader(name) {
        if (name.toLowerCase() === 'albums') {
            return 'Artist/Album Title';
        } else if (name.toLowerCase() === 'artists') {
            return 'Artist';
        } else if (name.toLowerCase() === 'songs') {
            return 'Artist/Song Title';
        }
    }

    public handleItemDropped(event: CdkDragDrop<string[]>): void {
        if (this.canReorder) {
            moveItemInArray(this.container.page, event.previousIndex, event.currentIndex);
        }
    }

} // End class ContainerComponent
