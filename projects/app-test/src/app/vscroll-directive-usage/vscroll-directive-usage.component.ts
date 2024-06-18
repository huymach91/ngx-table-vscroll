import { Component, OnInit } from '@angular/core';
import { NgxTableVscrollDirective } from '../../../../ngx-table-vscroll/src/public-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item, Items } from '../app.type';
import { Observable, delay } from 'rxjs';

@Component({
    selector: 'vscroll-directive-usage',
    standalone: true,
    imports: [FormsModule, CommonModule, NgxTableVscrollDirective],
    templateUrl: './vscroll-directive-usage.component.html',
    styleUrls: ['./vscroll-directive-usage.component.scss']
})

export class VscrollDirectiveUsageComponent implements OnInit {

    scroller = document.documentElement;
    data: Items = [];
    totalData = 100;

    public ngOnInit(): void {
        this.onGenerate();
    }

    public onGenerate() {
        this.loadData().pipe(
            delay(500)
        ).subscribe((data) => {
            this.data = data;
            console.log(this.data)
        });
    }

    public loadData() {
        // load data
        return new Observable<Items>((observer) => {
            const length = this.totalData;
            const data: Items = [];
            for (let i = 0; i < length; i++) {
                const id = Math.floor(Math.random() * 10000);
                const item: Item = {
                    id: `id-${id}`,
                    name: `name-${id}`,
                    age: Math.floor(Math.random() * 100),
                    desc: 'when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also t when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also t when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also t'
                }
                data.push(item);
            }
            observer.next(data);
            observer.complete();
        });
    }

}