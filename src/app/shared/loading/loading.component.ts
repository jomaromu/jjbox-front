import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @ViewChild('loading', { static: true }) loading: ElementRef<HTMLElement>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.chekLoading();
  }

  chekLoading(): void {
    this.store.select('loading').subscribe((valueLoading: boolean) => {
      const loading = this.loading.nativeElement;

      if (valueLoading) {
        loading.style.display = 'flex';
      } else {
        loading.classList.add('animate__fadeOutLeft');

        setTimeout(() => {
          loading.classList.remove('animate__fadeOutLeft');
          loading.style.display = 'none';
        }, 800);
      }
    });
  }
}
