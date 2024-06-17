import { AfterViewInit, Directive, Injector, OnDestroy, TemplateRef, ViewContainerRef, effect, input } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Directive({ selector: '[NgxTableVscroll]', standalone: true })
export class NgxTableVscrollDirective implements AfterViewInit, OnDestroy {

    public scroller = input<HTMLElement>();
    public itemHeight = input.required<number>();
    public totalItems = input.required<number>();
    public container = input.required<HTMLElement>();
    public topHeight = input<number>(0);
    public footerHeight  = input<number>(0);
    public buffer = input<number>(0);
    public template = input.required<TemplateRef<any>>();
    public data = input.required<any[]>();

    private _sub: Subscription | undefined;
    private _start: number = 0;
    private _end: number = 0;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private injector: Injector
    ) {
        this.listenInputData();
    }

    public ngAfterViewInit(): void {
        const scrollerElement = this.scroller() ? this.scroller() : window;
        const containerElement = this.container();
        const tbodyElement = containerElement.querySelector('tbody') as HTMLElement | null;

        if (tbodyElement) {
            tbodyElement.style.position = 'relative';
        }

        // handle vscroll
        if (scrollerElement) {
            fromEvent(scrollerElement, 'scroll').subscribe(() => {
                this.handleVscroll();
            });
            setTimeout(() => {
                this.handleVscroll();
            });
        }
        
    }

    public ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }

    private handleVscroll(): void {
        const scrollerElement = this.scroller() ? this.scroller() : document.documentElement;
        
        if (!scrollerElement) return;
        // declare
        const containerElement = this.container();
        const tbodyElement = containerElement.querySelector('tbody') as HTMLElement | null;
        const tfootElement = containerElement.querySelector('tfoot') as HTMLElement | null;
        const scrollTop = scrollerElement.scrollTop - this.topHeight() >= 0 ? scrollerElement.scrollTop - this.topHeight() : 0;
        const viewportHeight = window.innerHeight - this.topHeight() - this.footerHeight();
        const itemHeight = this.itemHeight();
        const totalItems = this.totalItems();
        const totalHeight = totalItems * itemHeight - this.footerHeight() - this.topHeight();
        const buffer = this.buffer();
        // Calculate the visible range based on scroll position
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
        const endIndex = Math.min(totalItems, Math.ceil((scrollTop + viewportHeight) / itemHeight) + buffer);

        if (tfootElement) {
            tfootElement.style.height = `${totalHeight}px`;
        }
        
        if (startIndex !== this._start || endIndex !== this._end) {
            this._start = startIndex;
            this._end = endIndex;
            this.viewContainerRef.clear();
            if (tbodyElement ) {
                tbodyElement.style.transform = `translateY(${startIndex * itemHeight}px)`;
            }
            this.renderRange(startIndex, endIndex);
        }
    }

    private renderRange(start: number, end: number) {
        for (let i = start; i < end; i++) {
            const item = this.data()[i];
            this.viewContainerRef.createEmbeddedView(this.template(), {
                index: i,
                $implicit: item
            }, { injector: this.injector });
        }
    }

    private listenInputData() {
        effect(() => {
            const data = this.data();
            this.handleVscroll();
        })
    }

}