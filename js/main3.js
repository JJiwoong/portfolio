//////////////////////////////

const text = new SplitType(".title,.project-tit,.desc", {
    types: "words, chars",
});
/////////////////

let tl = gsap.timeline();

tl.from(".title .char", {
    opacity: 0,
    yPercent: 130,
    duration: 2,
    stagger: 0.1,
    ease: "expo.out",
});
tl.from(".project-tit .char", {
    opacity: 0,
    yPercent: 130,
    duration: 2,
    stagger: 0.06,
    ease: "expo.out",
    scrollTrigger:{
        trigger: ".work_wrap",
        start: "top 10%",
        end: "+=30%",
        scrub:1,
    }
});

function cursor2() {
    gsap.set(".cursor2", {
        xPercent: -50,
        yPercent: -50,
    });
    let ball = document.querySelector(".cursor2");
    let pos = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    };
    let mouse = {
        x: pos.x,
        y: pos.y,
    };
    let speed = 0.2;
    let xSet = gsap.quickSetter(ball, "x", "px");
    let ySet = gsap.quickSetter(ball, "y", "px");

    window.addEventListener("mousemove", function (e) {
        console.log(e);
        mouse.x = e.x;
        mouse.y = e.y;
    });

    gsap.ticker.add(function () {
        let dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;
        xSet(pos.x);
        ySet(pos.y);
    });
}
cursor2();

// let imgBoxx=document.querySelectorAll(".img-box")
// let wrap=document.querySelectorAll(".work_wrap")
// imgBoxx.forEach(function(ib){

    

// gsap.fromTo(ib,{
//     opacity:1,
//     scrollTrigger:{
//         trigger:wrap,
//         start:"top top",
//         end:"bottom bottom",
//         scrub:1
//     }
// },{
//     opacity:0,
//     scrollTrigger:{
//         trigger:wrap,
//         start:"top top",
//         end:"bottom bottom",
//         scrub:1
//     }
// })
// })

    var infoBoxes = document.querySelectorAll('.infobox');
    var imgBoxes = document.querySelectorAll('.img-box');
    var wrap= document.querySelectorAll('.work_wrap')

    infoBoxes.forEach(function(infoBox) {
        infoBox.addEventListener('mouseover', function() {
            imgBoxes.forEach(function(imgBox) {
                imgBox.classList.add('hide');
            });
        });

        infoBox.addEventListener('mouseleave', function() {
            imgBoxes.forEach(function(imgBox) {
                imgBox.classList.remove('hide');
            });
        });
    });




var path = anime.path('.orbit-context path');
var motionPath = anime({
    targets: '.square',
    easing: 'easeInQuad',
    translateX: path('x'),
    translateY: path('y'),
    rotate: path('angle'),
    duration: 8000,
    loop: true,
});

let cursorImgBox = document.querySelector('.cursor2 .img-box');
let hover = document.querySelectorAll('.work_wrap');
let hide = document.querySelectorAll(".infobox")



hover.forEach(i => {
    imageUrl = $(i).attr('data-img');
    let cursorImg = document.querySelector(`${imageUrl}`);

    i.addEventListener('mouseover', () => {
        cursorImgBox.classList.add('on');
        cursorImg.classList.add('on');

        // cursorImg.style.backgroundImage = "url("+imageUrl+")"
    });
    i.addEventListener('mouseout', () => {
        cursorImgBox.classList.remove('on');
        cursorImg.classList.remove('on');
    });

})


let stickys = document.querySelectorAll(".sticky");

stickys.forEach(function (sticky) {
    gsap.to(sticky, {
        scrollTrigger: {
            trigger: sticky,
            start: "30% top",
            end: "+=150%",
            scrub: 1,
        },
        y: 250,
        scale: 0,
        rotation: -15,
        opacity:0,
        ease: "power3.out"
    })

})
//두번째 영역
let conScales = document.querySelectorAll(".con-scale")
let conScales2 = document.querySelectorAll(".con-scale2")

conScales.forEach(function (conScale) {
    gsap.fromTo(conScale, {
        y: 100,
        scale: 0.7,
        rotation:5,
    }, {
        scrollTrigger: {
            trigger: conScale,
            start: "top 80%",
            end: "top 20%",
            scrub: 2,
        },
        y: 0,
        scale: 1,
        duration: 1,
        rotation: 0,
        ease: "power3.out"
    })
});
conScales2.forEach(function (conScale2) {
    gsap.fromTo(conScale2, {
        y: 100,
        scale: 0.5,
        rotation:-15,
    }, {
        scrollTrigger: {
            trigger: conScale2,
            start: "top 80%",
            end: "top 60%",
            scrub: 2,
        },
        y: 0,
        scale: 1,
        duration: 0.5,
        rotation: 0,
        ease: "power3.out"
    })
});

const wrapElements = (elems, wrapType, wrapClass) => {
    elems.forEach(char => {
        const wrapEl = document.createElement(wrapType);
        wrapEl.classList = wrapClass;
        char.parentNode.appendChild(wrapEl);
        wrapEl.appendChild(char);
    });
}

Splitting();


const fx1Titles = [...document.querySelectorAll('.project-tit[data-splitting][data-effect1]')];
const fx5Titles = [...document.querySelectorAll('.project-tit[data-splitting][data-effect5]')];
const fx8Titles = [...document.querySelectorAll('.other-tit[data-splitting][data-effect8]')];
const fx9Titles = [...document.querySelectorAll('.project-tit[data-splitting][data-effect9]')];
const fx10Titles = [...document.querySelectorAll('.project-tit[data-splitting][data-effect10]')];
const fx11Titles = [...document.querySelectorAll('.project-tit[data-splitting][data-effect11]')];
const fx16Titles = [...document.querySelectorAll('.contact-msg[data-splitting][data-effect16]')];

const scrollText = () => {
fx10Titles.forEach(title => {
        
    const chars = title.querySelectorAll('.char');

    gsap.fromTo(chars, { 
        'will-change': 'opacity', 
        opacity: 0,
        filter: 'blur(20px)'
    },
    {
        duration: 0.25,
        ease: 'power1.inOut',
        opacity: 1,
        filter: 'blur(0px)',
        stagger: { each: 0.015, from: 'random'},
        scrollTrigger: {
            trigger: ".wrap2",
            start: "top 10%",
            end: "+=30%",
            toggleActions: "play resume resume reset",
        }
    });

   

    
});
fx16Titles.forEach(title => {
        
    gsap.fromTo(title, {
        transformOrigin: '0% 50%',
        rotate: 3
    }, {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
            trigger: title,
            start: "top 30%",
            end: "top 20%",
            scrub: true,
            markers:true
        },
    });

    gsap.fromTo(title.querySelectorAll('.word'), {
        'will-change': 'opacity',
        opacity: 0.1
    }, 
    {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
            trigger: title,
            start: 'top bottom-=20%',
            end: 'center top+=20%',
            scrub: true,
            markers:true
        }
    });

});
  
fx1Titles.forEach(title => {
        
    const chars = title.querySelectorAll('.char');

    gsap.fromTo(chars, { 
        'will-change': 'opacity, transform', 
        opacity: 0, 
        scale: 0.6,
        rotationZ: () => gsap.utils.random(-20,20)
    },
    {
        ease: 'power4',
        opacity: 1,
        scale: 1,
        rotation: 0,
        stagger: 0.4,
        scrollTrigger: {
            trigger: title,
            start: 'center+=20% bottom',
            end: '+=50%',
            scrub: 1
        },
    });

});

fx5Titles.forEach(title => {
        
    const chars = title.querySelectorAll('.char');

    gsap.fromTo(chars, { 
        'will-change': 'opacity, transform', 
        opacity: 0, 
        xPercent: () => gsap.utils.random(-200,200), 
        yPercent: () => gsap.utils.random(-150,150) 
    },
    {
        ease: 'power1.inOut',
        opacity: 1,
        xPercent: 0,
        yPercent: 0,
        stagger: { each: 0.05, grid: 'auto', from: 'random'},
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: '10% bottom',
            scrub:2

        }
    });

});
fx9Titles.forEach(title => {

    const words = title.querySelectorAll('.word');

    for (const word of words) {

        const chars = word.querySelectorAll('.char');

        gsap.fromTo(chars,  { 
            'will-change': 'transform', 
            scaleX: 0,
            x: (_, target) => window.innerWidth/2 - target.offsetLeft - target.offsetWidth/2
        },
        {
            ease: 'power1.inOut',
            scaleX: 1,
            x: 0,
            scrollTrigger: {
                trigger: word,
                start: 'top 200%',
                end: 'top top',
                scrub: true
            }
        });

    }

});
fx11Titles.forEach(title => {
        
    const chars = title.querySelectorAll('.char');
    wrapElements(chars, 'span', 'char-wrap');

    gsap.fromTo(chars, { 
        'will-change': 'transform', 
        transformOrigin: '0% 50%',
        xPercent: 105,
    }, 
    {
        duration: 1,
        ease: 'expo',
        xPercent: 0,
        stagger: 0.042,
        scrollTrigger: {
            trigger: title,
            start: 'top bottom',
            end: 'top top+=10%',
            toggleActions: "play resume resume reset",
        }
    });

});
const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];
    fx8Titles.forEach(title => {
        
        const chars = title.querySelectorAll('.char');

        chars.forEach((char, position) => {
            let initialHTML = char.innerHTML;
            
            gsap.fromTo(char, {
                opacity: 0
            },
            {
                duration: 0.03,
                innerHTML: () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
                repeat: 1,
                repeatRefresh: true,
                opacity: 1,
                repeatDelay: 0.03,
                delay: (position+1)*0.18,
                onComplete: () => gsap.set(char, {innerHTML: initialHTML, delay: 0.03}),
                scrollTrigger: {
                    trigger: title,
                    start: 'top bottom',
                    end: 'bottom center',
                    toggleActions: "play resume resume reset",
                    onEnter: () => gsap.set(char, {opacity: 0})
                }
            });

        });
        
    });

}
scrollText()

window.addEventListener("load",() => {
    scrollText();
});

let cardWrapper = document.querySelectorAll(".cards_item");
let cardsEl = document.querySelectorAll(".cards_el");

cardWrapper.forEach(function(e,i){//e:아이템, i:아이템의 index
    let card=cardsEl[i]
    let img=e.querySelector(".cards_img img");
    let scale =1;
    let rotate=0;

    if(i !== cardsEl.length - 1){
        scale=1 + 0.025 * 1;
        rotate= -15;
    }
    gsap.to(card,{
        scale:scale,
        rotateX:rotate,
        transformOrigin:"center top",
        ease:"none",
        scrollTrigger:{
            trigger: e,
            start:"top " + ( 100 + 70 * i),
            end:"bottom +=820px",
            pin:e,
            endTrigger:".end-anim",
            scrub:1,
            pinSpacing:false
        }
    })

})



