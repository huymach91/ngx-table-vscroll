import { CommonModule } from '@angular/common';
import { Component, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxTableVscrollDirective } from 'ngx-table-vscroll';
import { Observable, delay, range } from 'rxjs';
import { Item, Items } from './app.type';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, NgxTableVscrollDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

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
