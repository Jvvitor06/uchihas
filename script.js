/* =========================================
   SHARINGAN EVOLUTION
========================================= */

gsap.registerPlugin(ScrollTrigger);


/* =========================================
   ELEMENTOS
========================================= */

const olhos = [
    document.querySelector("#p-comum"),
    document.querySelector("#p-t1"),
    document.querySelector("#p-t2"),
    document.querySelector("#p-t3"),
    document.querySelector("#p-madara"),
    document.querySelector("#p-itachi"),
    document.querySelector("#p-sasuke"),
    document.querySelector("#p-obito"),
    document.querySelector("#p-sarada")
];

const etapas = document.querySelectorAll(".step");
const cards = document.querySelectorAll(".info-card");

const palpebraTopo = document.querySelector("#palpebra-topo");
const palpebraBaixo = document.querySelector("#palpebra-baixo");

const olho = document.querySelector(".eye-container");

const hero = document.querySelector(".hero");
const conteudo = document.querySelector(".content");


/* =========================================
   VARIÁVEIS
========================================= */

let etapaAtual = 0;

let fazendoLoop = false;

let primeiraCarga = true;


/* =========================================
   CONFIGURAÇÃO INICIAL DOS OLHOS
========================================= */

olhos.forEach((olhoAtual, indice) => {

    gsap.set(olhoAtual, {

        opacity: indice === 0 ? 1 : 0,

        scale: indice === 0 ? 1 : 0.35,

        rotation: indice === 0 ? 0 : -180

    });

});


/* =========================================
   PÁLPEBRAS
========================================= */

gsap.set(palpebraTopo, {
    yPercent: 0
});

gsap.set(palpebraBaixo, {
    yPercent: 0
});


/* =========================================
   ABERTURA DO OLHO
========================================= */

const abertura = gsap.timeline({
    delay: 0.4
});


abertura.to(
    palpebraTopo,
    {
        yPercent: -100,
        duration: 1.4,
        ease: "power3.inOut"
    }
);


abertura.to(
    palpebraBaixo,
    {
        yPercent: 100,
        duration: 1.4,
        ease: "power3.inOut"
    },
    "<"
);


/* =========================================
   CARD INICIAL
========================================= */

cards.forEach((card, indice) => {

    gsap.set(card, {

        opacity: indice === 0 ? 1 : 0,

        y: indice === 0 ? 0 : 35

    });

});


/* =========================================
   TROCAR SHARINGAN
========================================= */

function trocarSharingan(novoIndice) {

    if (novoIndice < 0) {
        novoIndice = 0;
    }

    if (novoIndice > olhos.length - 1) {
        novoIndice = olhos.length - 1;
    }


    if (novoIndice === etapaAtual) {
        return;
    }


    const antigoIndice = etapaAtual;

    etapaAtual = novoIndice;


    /* =====================================
       OLHO ANTIGO
    ===================================== */

    gsap.to(olhos[antigoIndice], {

        opacity: 0,

        scale: 0.5,

        rotation: novoIndice > antigoIndice
            ? -90
            : 90,

        duration: 0.3,

        ease: "power2.in"

    });


    /* =====================================
       OLHO NOVO
    ===================================== */

    gsap.fromTo(

        olhos[novoIndice],

        {

            opacity: 0,

            scale: 0.35,

            rotation: novoIndice > antigoIndice
                ? 180
                : -180

        },

        {

            opacity: 1,

            scale: 1,

            rotation: 0,

            duration: 0.55,

            ease: "back.out(1.4)"

        }

    );


    /* =====================================
       ROTAÇÃO DO OLHO
    ===================================== */

    gsap.to(olho, {

        rotation: novoIndice * 35,

        duration: 0.6,

        ease: "power2.out"

    });
}


/* =========================================
   TROCAR CARD
========================================= */

function mostrarCard(indice) {

    cards.forEach((card, i) => {

        if (i === indice) {

            gsap.to(card, {

                opacity: 1,

                y: 0,

                duration: 0.45,

                ease: "power2.out",

                overwrite: true

            });

        } else {

            gsap.to(card, {

                opacity: 0,

                y: 35,

                duration: 0.3,

                ease: "power2.in",

                overwrite: true

            });

        }

    });
}


/* =========================================
   DESCOBRIR QUAL ETAPA ESTÁ NA TELA
========================================= */

function atualizarEtapa() {

    if (fazendoLoop) {
        return;
    }


    const inicioConteudo =
        hero.offsetHeight;


    const scrollDentroDoConteudo =
        window.scrollY - inicioConteudo;


    /*
        Ainda estamos na Hero.
    */

    if (scrollDentroDoConteudo < 0) {

    // Voltou para o começo da página
    etapaAtual = 0;

    // Esconde todos os Sharingans
    olhos.forEach((olhoAtual, indice) => {

        gsap.killTweensOf(olhoAtual);

        gsap.set(olhoAtual, {

            opacity: indice === 0 ? 1 : 0,

            scale: indice === 0 ? 1 : 0.35,

            rotation: indice === 0 ? 0 : -180

        });

    });

    // Volta a rotação do olho
    gsap.set(olho, {
        rotation: 0
    });

    // Primeiro card
    mostrarCard(0);

    return;
}


    /*
        Cada .step ocupa exatamente
        100vh.

        Portanto:

        0      = olho comum
        1      = 1 Tomoe
        2      = 2 Tomoes
        3      = 3 Tomoes
        4      = Madara
        etc.
    */

    const indice = Math.floor(

        scrollDentroDoConteudo /
        window.innerHeight

    );


    const indiceLimitado = Math.max(

        0,

        Math.min(
            indice,
            olhos.length - 1
        )

    );


    trocarSharingan(indiceLimitado);

    mostrarCard(indiceLimitado);
}


/* =========================================
   SCROLL
========================================= */

window.addEventListener(

    "scroll",

    atualizarEtapa,

    {
        passive: true
    }

);


/* =========================================
   LOOP INFINITO
========================================= */

function verificarLoop() {

    if (!hero || !conteudo) {
        return;
    }


    const inicioConteudo =
        hero.offsetHeight;


    const alturaConteudo =
        conteudo.offsetHeight;


    const fimConteudo =
        inicioConteudo +
        alturaConteudo;


    const scrollAtual =
        window.scrollY;


    /*
        CHEGOU NO FINAL
    */

    if (
        scrollAtual >=
        fimConteudo - 5
    ) {

        if (fazendoLoop) {
            return;
        }


        fazendoLoop = true;


        /*
            Volta exatamente para
            o começo da primeira etapa.
        */

        window.scrollTo({

            top:
                inicioConteudo + 2,

            behavior: "instant"

        });


        /*
            Forçamos o primeiro Sharingan.
        */

        etapaAtual = 0;


        olhos.forEach(
            (olhoAtual, indice) => {

                gsap.killTweensOf(olhoAtual);

                gsap.set(olhoAtual, {

                    opacity:
                        indice === 0 ? 1 : 0,

                    scale:
                        indice === 0 ? 1 : 0.35,

                    rotation:
                        indice === 0 ? 0 : -180

                });

            }
        );


        gsap.set(olho, {
            rotation: 0
        });


        mostrarCard(0);


        /*
            Dá um pequeno tempo para o
            navegador terminar o salto.
        */

        setTimeout(() => {

            fazendoLoop = false;

            ScrollTrigger.refresh();

        }, 100);

    }

}


/* =========================================
   VERIFICA LOOP JUNTO COM SCROLL
========================================= */

window.addEventListener(

    "scroll",

    verificarLoop,

    {
        passive: true
    }

);


/* =========================================
   INICIALIZAÇÃO
========================================= */

window.addEventListener(

    "load",

    () => {

        /*
            Garante que a página começa
            realmente no topo.
        */

        window.scrollTo(
            0,
            0
        );


        etapaAtual = 0;


        /*
            Olho comum ativo.
        */

        olhos.forEach(
            (olhoAtual, indice) => {

                gsap.set(olhoAtual, {

                    opacity:
                        indice === 0 ? 1 : 0,

                    scale:
                        indice === 0 ? 1 : 0.35,

                    rotation:
                        indice === 0 ? 0 : -180

                });

            }
        );


        mostrarCard(0);


        ScrollTrigger.refresh();

    }

);


/* =========================================
   EVITA RESTAURAÇÃO DO SCROLL
========================================= */

if ("scrollRestoration" in history) {

    history.scrollRestoration =
        "manual";

}