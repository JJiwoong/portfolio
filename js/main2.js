gsap.registerPlugin(ScrollTrigger,Flip,MotionPathPlugin); 

gsap.to("#page1", {
  opacity: 0.08,      // 최종 상태
  scrollTrigger: {
    trigger: "#page1",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
    pinSpacing: false
  }
});

const button = document.querySelector(".button");
const logo = document.querySelector(".logo");

// opacity 애니 끝난 후 z-index 낮추기
[button, logo].forEach(el => {
  el.addEventListener("transitionend", () => {
    if (el.style.opacity === "0") {
      el.style.zIndex = "-1"; // 완전히 사라지고 나서만 z-index 낮춤
    }
  });
});

gsap.to(".about_visual", {
  scrollTrigger: {
    trigger: ".about_visual",
    start: "top top",
    end: "bottom bottom",
    toggleActions: "play none none reverse",
    onEnter: () => {
      // 내려갈 때 : opacity 0 → transition으로 자연스럽게 사라짐
      button.style.opacity = "0";
      logo.style.opacity = "0";
    },
    onLeaveBack: () => {
      // 다시 올라올 때 : 먼저 zIndex 올려두고
      button.style.zIndex = "1";
      logo.style.zIndex = "1";
      // opacity는 천천히 1로 (transition 적용됨)
      requestAnimationFrame(() => { 
        button.style.opacity = "1";
        logo.style.opacity = "1";
      });
    }
  }
});

gsap.to(".about_title", {
  opacity:0,
  y:100,
  scrollTrigger: {
    trigger: ".about_title",
    start: "bottom 10%",
    end: "bottom bottom",
    toggleActions: "play none none reverse",
  }
});

gsap.to(".about_name", {
  opacity:0,
  y:100,
  scrollTrigger: {
    trigger: ".about_name",
    start: "bottom 10%",
    end: "bottom bottom",
    markers:true,
    toggleActions: "play none none reverse",
  }
});


const snb = document.querySelector(".snb-wrap");

snb.addEventListener("transitionend", () => {
  if (snb.style.opacity === "0") {
    snb.style.zIndex = "-1"; // 완전히 사라지고 나서 z-index 변경
  }
});

gsap.to(".snb-wrap", {
  scrollTrigger: {
    trigger: ".about_visual",
    start: "bottom 20%",
    end: "bottom top",
    toggleActions: "play none none reverse",
    onEnter: () => {
      snb.style.zIndex = "1";
      snb.style.opacity = "1";
    },
    onLeaveBack: () => {
      snb.style.opacity = "0"; // 먼저 페이드아웃
    }
  }
});

gsap.to(".about_visual .title", {
  opacity:1,
  duration: 1.2,
  ease: "power2.out",  // 스무스 easing
  scrollTrigger: {
    trigger: ".about_visual",
    start: "top 35%",
    end: "top 10%", 
  }
});

gsap.fromTo(".about_IdPhoto img", 
  { 
    y: -100,   // 시작 위치 (위에서)
    opacity: 0 // 시작 시 투명
  }, 
  { 
    y: 0,      // 원래 위치
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about_personal",
      start: "40% bottom",   // about 섹션의 top이 뷰포트 60% 지점에 닿을 때 시작
      end: "bottom 40%",  // 필요시 조정
      toggleActions: "play none none reverse",
      onEnter: () => {
        snb.style.zIndex = "1"; 
      },
      onLeaveBack: () => {
        snb.style.opacity = "0";
      }
    }
  }
);


// const list = document.querySelector(".skills_list");
// const totalWidth = list.scrollWidth;

// gsap.to(list, {
//   x: () => -(totalWidth - window.innerWidth),
//   ease: "none",
//   scrollTrigger: {
//     trigger: ".skills_wrap",
//     start: "top top",
//     pin: true,
//     scrub: 1,
//     end: () => "+=" + (totalWidth), // 👈 여기 totalWidth로 (더 넉넉하게)
//     markers: true
//   }
// });

gsap.fromTo(".introduction_txt p", 
  { 
    y: -100,   // 시작 위치 (위에서)
    opacity: 0 // 시작 시 투명
  }, 
  { 
    y: 0,      // 원래 위치
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about_personal",
      start: "60% bottom",   // about 섹션의 top이 뷰포트 60% 지점에 닿을 때 시작
      end: "bottom 40%",  // 필요시 조정
      toggleActions: "play none none reverse",
    }
  }
);

gsap.fromTo(".skills_wrap", 
  { 
    y: -100,
    opacity: 0
  }, 
  { 
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".skills_wrap",
      start: "top 80%",   // skills_wrap의 top이 뷰포트 80% 지점에 닿을 때 (즉, 20% 보였을 때)
      end: "bottom 60%",  // 필요하면 조정 가능
      toggleActions: "play none none reverse"
    }
  }
);

gsap.fromTo(".career", 
  { 
    y: -100,   // 시작 위치 (위에서)
    opacity: 0 // 시작 시 투명
  }, 
  { 
    y: 0,      // 원래 위치
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about_personal",
      start: "70% bottom",   // about 섹션의 top이 뷰포트 60% 지점에 닿을 때 시작
      end: "bottom 40%",  // 필요시 조정
      toggleActions: "play none none reverse",
      onEnter: () => {
        snb.style.zIndex = "1"; 
      },
      onLeaveBack: () => {
        snb.style.opacity = "0";
      }
    }
  }
);


gsap.to(".img-wrap", {
  opacity:1,
  duration: 1.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".about_visual",
    start: "top 35%",
    end: "top 10%", 
  }
});


gsap.to(".square_circle", {
  duration: 8,
  repeat: -1,
  ease: "none",
  motionPath: {
    path: ".orbit-context path",
    align: ".orbit-context path",
    alignOrigin: [0.5, 0.5], // 점의 중심 정렬
    autoRotate: true
  }
});


// let tl2 = gsap.timeline();







  


// function hover() {
//     profile = gsap.to('.intro-bg', {
//       width: '25vw',
//       paused: true
//     })
//     $('#profileHover').hover(function () {
//       profile.play();
//     }, function () {
//       profile.reverse();
//     })
//   }
//   hover();

//   function square (){
//   let gsapSq = document.querySelectorAll(".square");
  
//   gsapSq.forEach(function (gSq, i) {
//     let rotate = gsap.from(gSq, {
//       duration: 3,
//       rotation: 720,
//       scrollTrigger: {
//         trigger: gSq,
//         start: "top bottom",
//         scrub: 1.9,
//       },
//     })
//   });
//   }
//   square();
  
//   function skillmove() {
//     gsap.to(".skill", {
//       scrollTrigger: {
//         trigger: ".skill_wrap",
//         start: "top bottom",
//         scrub: 1.9,
//       },
//       // forEach((각각요소,인덱스)=>{})
//       // y:(인덱스,각각요소)=>{}
//       xPercent:100  
//     });
//   }
//   skillmove();


//   function skill_sc(){
//     let Max = 100;
//     let circleProgressInstances = [];
//     let skills=document.querySelectorAll(".skill")
//     skills.forEach((progressEle, index) => {
//       let initialvalue = document.querySelectorAll(".value-input")[index].value;
//       let cp = new CircleProgress(progressEle, {
//         max: Max,
//         value: 0,
//         animationDuration: 2500,
//         textFormat: (val) => val + "%"
//       });
    
//       circleProgressInstances.push[cp]
    
//       ScrollTrigger.create({
//           trigger: ".skill",
//           start: "top 70%",
//           scrub: 1,
//           onEnter: () => {
//             cp.value = initialvalue
//           },
//           onLeaveBack: () => {
//             cp.value = 0
//           },
//           opacity:0
//         })
//       }
//     )}
//     skill_sc()
    
//     const textElements = gsap.utils.toArray('.about_ani .text');

//     textElements.forEach(text => {
//       gsap.to(text, {
//         backgroundSize: '100%',
//         ease: 'none',
//         scrollTrigger: {
//           trigger: text,
//           start: 'center 80%',
//           end: 'center 20%',
//           scrub: true,
//         },
//       });
//     });

//  // use a script tag or an external JS file
//  document.addEventListener("DOMContentLoaded", (event) => {
  
//   //이미지 애니
//   let items = document.querySelectorAll(".about_ani li");
//   items.forEach(function (el) {
//       gsap.set(".hover-img", {
//           xPercent: -50,
//           yPercent: -50
//       })
//       let image = el.querySelector(".hover-img")
//       let innerImage = el.querySelector(".hover-img img");
//       let pos = {
//           x: window.innerWidth / 2,
//           y: window.innerHeight / 2
//       }
//       let mouse = {
//           x: pos.x
//       }
//       let speed = 0.1;
//       let xSet = gsap.quickSetter(image, "x", "px") //

//       window.addEventListener("mousemove", function (e) {
//           //console.log(e.x)
//           mouse.x = e.x;
//       })

//       gsap.ticker.add(function () { //requestAnimationFrame()
//           let dt = 1.0 - Math.pow((1.0 - speed), gsap.ticker.deltaRatio())
//           pos.x += (mouse.x - pos.x) * dt;
//           xSet(pos.x)
//       })

//       let direction = "",
//           oldx = 0,
//           lastCursorX = null,
//           cursorThreshold = 150;

//       let mousemovemethod = function (e) {
//           if (e.pageX < oldx && e.clientX <= lastCursorX - cursorThreshold) {
//               direction = "left"
//               lastCursorX = e.clientX;
//               innerImage.style.transform = "rotate(-15deg)"

//           } else if (e.pageX > oldx && e.clientX >= lastCursorX + cursorThreshold) {
//               direction = "right"
//               lastCursorX = e.clientX;
//               innerImage.style.transform = "rotate(15deg)"
//           }
//           oldx = e.pageX;
//       }
//       let mouseMoveTimer;

//       document.addEventListener("mousemove", function () {
//           // setTimeout(할일,시간) 시간뒤에 함수 발생
//           //setTimeout을 멈추고 싶을때 =>변수에 할당
//           //변수=setTimeout(할일(함수),시간)
//           //clearTimeout(변수)=>멈추는 명령

//           clearTimeout(mouseMoveTimer)
//           mouseMoveTimer = setTimeout(function () {
//               innerImage.style.transform = "translateX(0%) rotate(0deg)"
//           }, 100)
//       })
//       document.addEventListener("mousemove", mousemovemethod)
//   })

// });


// let triggerFlipOnScroll=(galleryEl, option)=>{
//   let settings={
//       flip:{
//           absolute:false,
//           absoluteOnLeave:false,
//           scale:true,
//           simple:true
//       },
//       scrollTrigger:{
//           start:"center center",
//           end:"+=200%"
//       }
//   }

//   settings=Object.assign({},settings,option)//1)
//   //console.log(settings)

//   let galleryCaption=galleryEl.querySelector(".caption");
//   let galleryItems=galleryEl.querySelectorAll(".gallery__item");
//   let galleryItemInner=[...galleryItems].map((item)=>{
//       return item.children.length>0?[...item.children]:[]
//   })


//   //L:최종상태를 캡처
//   galleryEl.classList.add("gallery--switch");

//   //F:초기상태를 캡처

//   //수업  getState 오타/////
//   let flipstate=Flip.getState([galleryItems,galleryCaption],{props:'filter,opacity'})

//   //초기 상태로 되돌리려면 최종 클래스를 제거합니다, 최종상태를 파악하게만하고 클래스명은 바로 제거한다
//   galleryEl.classList.remove("gallery--switch");


//   //뒤집기 애니메이션 , 타임라인 만들기
//   let tl=Flip.to(flipstate,{
//       ease:"none",
//       absolute:settings.flip.absolute,
//       absoluteOnLeave:settings.flip.absoluteOnLeave,
//       scale:settings.flip.scale,
//       simple:settings.flip.simple,
//       stagger:settings.stagger,
//       scrollTrigger:{
//           trigger:galleryEl,
//           start:settings.scrollTrigger.start,
//           end:settings.scrollTrigger.end,
//           pin:galleryEl.parentNode,
//           scrub:1
//       }

//   })

// }

// let scroll=()=>{
//   let galleries=[
//       {id:"#gallery-1",options:{flip:{absoluteOnLeave:true,scale:false}}},
//       {id:"#gallery-3",options:{flip:{absolute:true,scale:false},scrollTrigger:{
//         end:"+=400%",
//     },stagger:0.05}},
//   ]
//   galleries.forEach((gallery)=>{
//       let galleryElement=document.querySelector(gallery.id);
//       triggerFlipOnScroll(galleryElement,gallery.options)
//   })

// }
// scroll()

//   let tl=gsap.timeline()

//   tl.from(".aa_tit .text,.bird",{
//     opacity:0,
//     duration:0.5,
//     scrollTrigger:{
//       trigger:".about_ani",
//       start:"10% top",
//       end:"bottom bottom",
//       scrub:1,
//     }
//   })

//   tl.from(".hover-img",{
//     opacity:0,
//     duration:1,
//     scrollTrigger:{
//       trigger:".about_ani",
//       start:"10% top",
//       end:"bottom bottom",
//       scrub:1,
//     }
//   })




// const options = {
//   threshold: 0 // 요소가 1px이라도 보이면 isIntersecting = true
// };

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     // 요소가 뷰포트 밖으로 나갔고(top이 0보다 작거나 같음) → scrolled 추가
//     if (!entry.isIntersecting && entry.boundingClientRect.top <= 0) {
//       entry.target.classList.add("scrolled");
//     } else {
//       entry.target.classList.remove("scrolled");
//     }
//   });
// }, options);

// // 감시할 대상 등록
// observer.observe(document.querySelector(".about_title"));
// observer.observe(document.querySelector(".about_name"));