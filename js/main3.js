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
        markers: true
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

let cursorImgBox = document.querySelector('.cursor2 .img-box');
let workLinks = document.querySelectorAll('.work_wrap a');
let lefts = document.querySelectorAll('.thumb_box');

workLinks.forEach(i => {
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
lefts.forEach(i => {
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
        scale: 0.75,
        rotation: -15,
        ease: "power3.out"
    })
    tl.to(
        ".page2 .thumb_box", {
            clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`,
            ease: "expo.out",
            duration:2,
            scrollTrigger: {
                trigger: sticky,
                start: "top 10%",
                end: "+=20%",
                scrub:1,
                markers: true
            }
        },
    );

})
//두번째 영역
let conScales = document.querySelectorAll(".con-scale")

conScales.forEach(function (conScale) {
    gsap.fromTo(conScale, {
        y: 100,
        scale: 0.7,
        rotation: 15
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