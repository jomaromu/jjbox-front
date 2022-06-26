import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

@Injectable()
export class Whatsapp {
  constructor(public breakPointObserver: BreakpointObserver) {}

  btnWhatsapp(): void {
    const i = document.createElement('i');

    i.style.display = 'flex';
    const body = document.body;
    const a = document.createElement('a');
    i.classList.add('animate__animated', 'whatsapp');

    i.style.position = 'fixed';
    i.style.zIndex = '999';
    i.style.color = 'white';
    i.style.fontSize = '5rem';
    i.style.bottom = '50px';
    i.style.right = '50px';
    i.style.color = 'rgb(130, 201, 30)';
    i.style.textShadow = '1px 1px 3px rgb(46, 46, 46)';
    i.style.transition = 'all 0.4s';
    i.setAttribute('id', 'btn-whatsapp');

    a.append(i);
    a.setAttribute('target', '_blank');
    a.setAttribute(
      'href',
      'https://api.whatsapp.com/send?phone=50764252114&text=Hola,%20quisiera%20hacerle%20una%20pregunta'
    );

    setTimeout(() => {
      i.classList.add('fab', 'fa-whatsapp', 'animate__bounceInDown');
      body.append(a);
    }, 1000);

    i.addEventListener('mouseenter', (e) => {
      i.style.color = 'rgb(77, 119, 14)';
    });

    i.addEventListener('mouseleave', (e) => {
      i.style.color = 'rgb(130, 201, 30)';
    });

    this.ubicacion(i);
  }

  ubicacion(i: HTMLElement): void {
    this.breakPointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          i.style.right = '40px';
          i.style.bottom = '40px';
          i.style.fontSize = '4rem';
        }
      });

    this.breakPointObserver
      .observe(['(max-width: 576px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          i.style.right = '30px';
          i.style.bottom = '30px';
          i.style.fontSize = '3.5rem';
        }
      });
  }

  hidewhatsapp(): void {
    const whatsapp = document.getElementsByClassName('fa-whatsapp');
    const arrayWhats = Array.from(whatsapp);
    arrayWhats.forEach((whats: any) => {
      whats.style.display = 'none';
    });
  }
}
