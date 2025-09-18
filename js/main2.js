gsap.registerPlugin(ScrollTrigger,Flip); 











  let clutter = ""
  //textContent  --> 테스트만 추출
  let page2_h2 = document.querySelector("#about_introduce>h2").textContent.split("")
  
  page2_h2.forEach(function (dets) {
      clutter += `<span>${dets}</span>`;
      //clutter = clutter + `<span>T</span>`
      document.querySelector("#about_introduce>h2").innerHTML = clutter
  })
  
  gsap.to("#about_introduce>h2>span", {
      scrollTrigger: {
          trigger: "#about_introduce>h2>span",
          start: "top bottom",
          end: "+=400% top",
          scrub: 0.5,
      },
      color: "#000",
      stagger: 0.5
  })


  


function hover() {
    profile = gsap.to('.intro-bg', {
      width: '25vw',
      paused: true
    })
    $('#profileHover').hover(function () {
      profile.play();
    }, function () {
      profile.reverse();
    })
  }
  hover();
  let splitTypes=document.querySelectorAll(".title")

  splitTypes.forEach(function(char, i){
      let parent=char.parentNode.parentNode;
      const text=new SplitType(char, { types: 'chars' })
      console.log(text)
  
      gsap.from(text.chars,{
         opacity:0,
         yPercent:100,
         duration:0.4,
         stagger:0.04,
         scrollTrigger:{
          trigger:parent,
          start:"top 60%",
          end:"top 20%",
          ease:"power3.out"
         }
      })
  })
  function square (){
  let gsapSq = document.querySelectorAll(".square");
  
  gsapSq.forEach(function (gSq, i) {
    let rotate = gsap.from(gSq, {
      duration: 3,
      rotation: 720,
      scrollTrigger: {
        trigger: gSq,
        start: "top bottom",
        scrub: 1.9,
      },
    })
  });
  }
  square();
  
  function skillmove() {
    gsap.to(".skill", {
      scrollTrigger: {
        trigger: ".skill_wrap",
        start: "top bottom",
        scrub: 1.9,
      },
      // forEach((각각요소,인덱스)=>{})
      // y:(인덱스,각각요소)=>{}
      xPercent:100  
    });
  }
  skillmove();
  
  
  function xScroll() {
    let horSection = document.querySelectorAll(".about_personal")
  
    gsap.to(horSection, {
      xPercent: -100,
      scrollTrigger: {
        trigger: ".about_personal",
        start: "top",
        end: "+=2000px",
        scrub: 1,
        pin: true,
      }
    })
  }
  xScroll();

  function skill_sc(){
    let Max = 100;
    let circleProgressInstances = [];
    let skills=document.querySelectorAll(".skill")
    skills.forEach((progressEle, index) => {
      let initialvalue = document.querySelectorAll(".value-input")[index].value;
      let cp = new CircleProgress(progressEle, {
        max: Max,
        value: 0,
        animationDuration: 2500,
        textFormat: (val) => val + "%"
      });
    
      circleProgressInstances.push[cp]
    
      ScrollTrigger.create({
          trigger: ".skill",
          start: "top 70%",
          scrub: 1,
          onEnter: () => {
            cp.value = initialvalue
          },
          onLeaveBack: () => {
            cp.value = 0
          },
          opacity:0
        })
      }
    )}
    skill_sc()
    
    const textElements = gsap.utils.toArray('.about_ani .text');

    textElements.forEach(text => {
      gsap.to(text, {
        backgroundSize: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: text,
          start: 'center 80%',
          end: 'center 20%',
          scrub: true,
        },
      });
    });
    
    gsap.registerPlugin(MotionPathPlugin, ScrollTrigger)
    
    let path1 = document.querySelector('.theLine');
    let path1Length = path1.getTotalLength();
    //console.log(path1Length)
    
    path1.style.strokeDasharray = path1Length;
    path1.style.strokeDashoffset = path1Length;
    
    let pulses = gsap.timeline({
            defaluts: {
                duration: 0.05,
                autoAlpha: 1,
                scale: 2,
                transformOrigin: "center",
                ease: "elastic.out(1,0.3)",
            }
        })
        .to(".ball01,.text01", {}, 0.15)
        .to(".ball02,.text02", {}, 0.24)
        .to(".ball03,.text03", {}, 0.36)
        .to(".text04", {}, 1)
    
    let main = gsap.timeline({
            defaults: {
                duration: 1
            },
            scrollTrigger: {
                trigger: '#svg',
                start: "top 20%",
                end: "+=4000",
                scrub: 2
            },
            onUpdate: animationUpdate,
        })
        .to(".ball04", {
            duration: 0.01,
            autoAlpha: 1
        })
        .to(path1, {
            strokeDashoffset: 0
        }, "ball")
        .to(".ball04", {
            motionPath: {
                path: ".theLine", //path연결
                align: ".theLine",
                alignOrigin: [0.5, 0.5],
            }
        }, "ball")
        .add(pulses,0) // timeline을 연결하는 방법
    
        function animationUpdate(){
            console.log(this.progress())
        }


        gsap.timeline({
          scrollTrigger:{
              trigger:'.about_ani',
              start:'top top',
              end:'30% top',
              scrub:2,
          }
      })
      .fromTo(".aa_circle",{width:0,height:0,top:'12%'},{width:4000,height:4000})


 // use a script tag or an external JS file
 document.addEventListener("DOMContentLoaded", (event) => {
  
  //이미지 애니
  let items = document.querySelectorAll(".about_ani li");
  items.forEach(function (el) {
      gsap.set(".hover-img", {
          xPercent: -50,
          yPercent: -50
      })
      let image = el.querySelector(".hover-img")
      let innerImage = el.querySelector(".hover-img img");
      let pos = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
      }
      let mouse = {
          x: pos.x
      }
      let speed = 0.1;
      let xSet = gsap.quickSetter(image, "x", "px") //

      window.addEventListener("mousemove", function (e) {
          //console.log(e.x)
          mouse.x = e.x;
      })

      gsap.ticker.add(function () { //requestAnimationFrame()
          let dt = 1.0 - Math.pow((1.0 - speed), gsap.ticker.deltaRatio())
          pos.x += (mouse.x - pos.x) * dt;
          xSet(pos.x)
      })

      let direction = "",
          oldx = 0,
          lastCursorX = null,
          cursorThreshold = 150;

      let mousemovemethod = function (e) {
          if (e.pageX < oldx && e.clientX <= lastCursorX - cursorThreshold) {
              direction = "left"
              lastCursorX = e.clientX;
              innerImage.style.transform = "rotate(-15deg)"

          } else if (e.pageX > oldx && e.clientX >= lastCursorX + cursorThreshold) {
              direction = "right"
              lastCursorX = e.clientX;
              innerImage.style.transform = "rotate(15deg)"
          }
          oldx = e.pageX;
      }
      let mouseMoveTimer;

      document.addEventListener("mousemove", function () {
          // setTimeout(할일,시간) 시간뒤에 함수 발생
          //setTimeout을 멈추고 싶을때 =>변수에 할당
          //변수=setTimeout(할일(함수),시간)
          //clearTimeout(변수)=>멈추는 명령

          clearTimeout(mouseMoveTimer)
          mouseMoveTimer = setTimeout(function () {
              innerImage.style.transform = "translateX(0%) rotate(0deg)"
          }, 100)
      })
      document.addEventListener("mousemove", mousemovemethod)
  })

});


let triggerFlipOnScroll=(galleryEl, option)=>{
  let settings={
      flip:{
          absolute:false,
          absoluteOnLeave:false,
          scale:true,
          simple:true
      },
      scrollTrigger:{
          start:"center center",
          end:"+=200%"
      }
  }

  settings=Object.assign({},settings,option)//1)
  //console.log(settings)

  let galleryCaption=galleryEl.querySelector(".caption");
  let galleryItems=galleryEl.querySelectorAll(".gallery__item");
  let galleryItemInner=[...galleryItems].map((item)=>{
      return item.children.length>0?[...item.children]:[]
  })


  //L:최종상태를 캡처
  galleryEl.classList.add("gallery--switch");

  //F:초기상태를 캡처

  //수업  getState 오타/////
  let flipstate=Flip.getState([galleryItems,galleryCaption],{props:'filter,opacity'})

  //초기 상태로 되돌리려면 최종 클래스를 제거합니다, 최종상태를 파악하게만하고 클래스명은 바로 제거한다
  galleryEl.classList.remove("gallery--switch");


  //뒤집기 애니메이션 , 타임라인 만들기
  let tl=Flip.to(flipstate,{
      ease:"none",
      absolute:settings.flip.absolute,
      absoluteOnLeave:settings.flip.absoluteOnLeave,
      scale:settings.flip.scale,
      simple:settings.flip.simple,
      stagger:settings.stagger,
      scrollTrigger:{
          trigger:galleryEl,
          start:settings.scrollTrigger.start,
          end:settings.scrollTrigger.end,
          pin:galleryEl.parentNode,
          scrub:1
      }

  })

}

let scroll=()=>{
  let galleries=[
      {id:"#gallery-1",options:{flip:{absoluteOnLeave:true,scale:false}}},
      {id:"#gallery-3",options:{flip:{absolute:true,scale:false},scrollTrigger:{
        end:"+=400%",
    },stagger:0.05}},
  ]
  galleries.forEach((gallery)=>{
      let galleryElement=document.querySelector(gallery.id);
      triggerFlipOnScroll(galleryElement,gallery.options)
  })

}
scroll()

  let tl=gsap.timeline()

  tl.from(".aa_tit .text,.bird",{
    opacity:0,
    duration:0.5,
    scrollTrigger:{
      trigger:".about_ani",
      start:"10% top",
      end:"bottom bottom",
      scrub:1,
    }
  })

  tl.from(".hover-img",{
    opacity:0,
    duration:1,
    scrollTrigger:{
      trigger:".about_ani",
      start:"10% top",
      end:"bottom bottom",
      scrub:1,
    }
  })









  var path = anime.path('.orbit-context path');
  var motionPath = anime({
      targets: '.square_circle',
      easing: 'easeInQuad',
      translateX: path('x'),
      translateY: path('y'),
      rotate: path('angle'),
      duration: 8000,
      loop: true,
  });
