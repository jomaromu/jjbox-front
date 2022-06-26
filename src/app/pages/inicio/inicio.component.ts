import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import * as loadingActions from '../../reducers/loading/loading-actions';
import SwiperCore, {
  Autoplay,
  SwiperOptions,
  Pagination,
  Navigation,
} from 'swiper';
import { Whatsapp } from '../../scripts/whatsapp';

SwiperCore.use([Pagination, Autoplay, Navigation]);

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  slidesPerView = 1;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: true,
    pagination: { clickable: true, type: 'progressbar' },
    scrollbar: { draggable: true },
    autoplay: {
      delay: 3500,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
    loop: true,
    grabCursor: true,
  };
  config2: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    autoplay: {
      delay: 2500,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  };
  constructor(
    private store: Store<AppState>,
    private breakPointObserver: BreakpointObserver,
    private whatsapp: Whatsapp
  ) {}

  ngOnInit(): void {
    this.loadingEffect();
    this.swiperResponsivo();
    this.whatsapp.btnWhatsapp();

    scrollTo(0, 0);
  }

  ngAfterViewInit(): void {}

  loadingEffect(): void {
    this.store.dispatch(loadingActions.cargarLoading());

    const checkReadySt = setInterval(() => {
      const readySt = document.readyState;

      if (readySt === 'complete') {
        this.store.dispatch(loadingActions.quitarLoading());
        clearInterval(checkReadySt);
      }
    }, 500);
  }

  swiperResponsivo(): void {
    this.breakPointObserver
      .observe(['(max-width: 992px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.slidesPerView = 3;
          // console.log(this.slidesPerView);
        } else {
          this.slidesPerView = 4;
          // console.log(this.slidesPerView);
        }
      });
  }

  ngOnDestroy(): void {
    this.whatsapp.hidewhatsapp();
  }
}
