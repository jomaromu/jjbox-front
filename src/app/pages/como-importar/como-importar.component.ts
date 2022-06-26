import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import * as loadingActions from '../../reducers/loading/loading-actions';
import videojs from 'video.js';
import { Whatsapp } from '../../scripts/whatsapp';
import validator from 'validator';

@Component({
  selector: 'app-como-importar',
  templateUrl: './como-importar.component.html',
  styleUrls: ['./como-importar.component.scss'],
})
export class ComoImportarComponent implements OnInit, AfterViewInit {
  @ViewChild('videoPrincipal', { static: true }) videoPrincipal: ElementRef;
  player: videojs.Player;
  calculaPaquetes = 0;

  constructor(private store: Store<AppState>, private whatsapp: Whatsapp) {}

  ngOnInit(): void {
    this.loadingEffect();

    scrollTo(0, 0);

    this.whatsapp.btnWhatsapp();
  }

  ngAfterViewInit(): void {
    this.configVideoPrincipal();
  }

  configVideoPrincipal(): void {
    this.player = videojs(this.videoPrincipal.nativeElement, {
      autoplay: 'muted',
      controls: true,
      loop: true,
      sources: [
        {
          src: '../../../assets/video.mp4',
          type: 'video/mp4',
        },
      ],
      notSupportedMessage:
        'Este video no puede ser reproducido en su navegador',
    });

    const detectVideoPaused = setInterval(() => {
      if (this.player.paused()) {
        this.player.play();
        this.player.aspectRatio('16:9');
        clearInterval(detectVideoPaused);
      }
      clearInterval(detectVideoPaused);
    }, 300);

    // console.log(this.player);
  }

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

  calculadora(): void {
    const largo = document.getElementById('largo')! as HTMLInputElement;
    const ancho = document.getElementById('ancho')! as HTMLInputElement;
    const alto = document.getElementById('alto')! as HTMLInputElement;
    const peso = document.getElementById('peso')! as HTMLInputElement;

    const validaLargo = validator.isNumeric(largo.value);
    const validaAncho = validator.isNumeric(ancho.value);
    const validaAlto = validator.isNumeric(alto.value);
    const validaPeso = validator.isNumeric(peso.value);

    if (validaLargo && validaAncho && validaAlto && validaPeso) {
      const pVol = this.pesoVolumetrico(
        Number(largo.value),
        Number(ancho.value),
        Number(alto.value)
      );

      const pReal = Math.ceil(Number(peso.value));

      if (pVol > pReal) {
        this.calculaPaquetes = pVol * 2.5;
      } else if (pReal > pVol) {
        this.calculaPaquetes = pReal * 2.5;
      } else {
        this.calculaPaquetes = 0;
      }

    }
  }

  pesoVolumetrico(largo: number, ancho: number, alto: number): number {
    return Math.ceil((largo * ancho * alto) / 1728);
  }

  ngOnDestroy(): void {
    this.whatsapp.hidewhatsapp();
  }
}
