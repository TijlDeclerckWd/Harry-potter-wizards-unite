import {animate, animation, keyframes, style } from "@angular/animations";

export let bounceOutLeftAnimation = animation([
    animate('{{duration}} {{ easing }}', keyframes([
        style({
            offset: .2,
            opacity: 1,
            transform: 'translateX(20px)'
        }),
        style({
            offset: 1,
            opacity: 0,
            transform: 'translateX(-100%)'
        })
    ]))], {
    params: {
        duration: '2s',
        easing: 'ease-out'
    }
});

export let fadeInAnimation = animation([
    style({ opacity: 0}),
    animate('{{ duration }} {{ easing }}')
], {
    params: {
        duration: '2s',
        easing: 'ease-in'
    }
});

export let fadeInBottomAnimation = animation([
    style({ opacity: 0}),
    animate('{{ duration }} {{ easing }}')
], {
    params: {
        duration: '10s',
        easing: 'ease-out'
    }
});

