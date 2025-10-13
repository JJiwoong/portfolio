$('.project .thumb-box').mouseover(function(){
    gsap.to('.cursor',{scale:2})
    gsap.to('.cursor span', { visibility: "visible", opacity: 1})
  })
  $('.project .thumb-box').mouseleave(function(){
    gsap.to('.cursor',{scale:1})
    gsap.to('.cursor span', { visibility: "hidden", opacity: 0,})
  })

  $('.project_box').mouseover(function(){
    gsap.to('.cursor',{scale:2})
    gsap.to('.cursor span', { visibility: "visible", opacity: 1})
  })
  $('.project_box').mouseleave(function(){
    gsap.to('.cursor',{scale:1})
    gsap.to('.cursor span', { visibility: "hidden", opacity: 0,})
  })

  $('.gt3 .NextP').mouseover(function(){
    gsap.to('.cursor',{scale:2})
    gsap.to('.cursor span', { visibility: "visible", opacity: 1})
  })
  $('.gt3 .NextP').mouseleave(function(){
    gsap.to('.cursor',{scale:1})
    gsap.to('.cursor span', { visibility: "hidden", opacity: 0,})
  })
    $('.blank_page').mouseover(function(){
        $('.img-box').addClass("hide");
    });
    $('.blank_page').mouseleave(function(){
        $('.img-box').removeClass("hide");
    });

  $('.work_wrap').each(function(i,el){
    child = $(this).find('.bg-shadow')
    gsap.to(child,{
        scrollTrigger:{
            trigger:el,
            start:"top top",
            end:"bottom top",
            scrub:1
        },
        opacity:1
    })
})

$('a').mouseover(function(){
  gsap.to('.cursor2',{scale:3})
  gsap.to('.cursor2 span', { visibility: "visible", opacity: 1,duration:0.1})
})
$('a').mouseleave(function(){
  gsap.to('.cursor2',{scale:1})
  gsap.to('.cursor2 span', { visibility: "hidden", opacity: 0,duration:0.1})
})

// 배경 클래스 교체를 항상 '배타적'으로
function setBodyBG(cls) {
  document.body.classList.remove('white-bg', 'black-bg');
  document.body.classList.add(cls);
}

$('[data-color]').each(function (i, el) {
  const colorValue = $(el).data('color');          // "#fff" or "#000"
  const colorClass = (colorValue === '#fff') ? 'white-bg' : 'black-bg';

  ScrollTrigger.create({
    trigger: el,                 // ← 이 el은 data-color 가진 section (여기선 #contact)
    start: "top 55%",            // 범위를 조금 안쪽으로 (너무 일찍 on 되는 것 방지)
    end:   "bottom 45%",
    scrub: false,                // 색 전환은 딱- 바뀌게, 원하면 1로
    anticipatePin: 1,            // 상단 pin 섹션 영향 보정
    // markers: true,            // 디버그용
    onEnter:     () => setBodyBG(colorClass),
    onEnterBack: () => setBodyBG(colorClass),
    onLeave:     () => document.body.classList.remove('white-bg','black-bg'),
    onLeaveBack: () => document.body.classList.remove('white-bg','black-bg'),
    invalidateOnRefresh: true,
  });
});

// 레이아웃/이미지 로딩 후 재계산
ScrollTrigger.refresh();

$(".sc-contact .sub-tit").mousemove(function(e){
  var x = ((-$(this).width() / 2) + e.offsetX) *0.3;      
  // -(sub-tit width / 2) + sub-tit offsetX값 * 0.3
  var y = ((-$(this).height() / 2) + e.offsetY) *0.3;     
  // -(sub-tit width / 2) + sub-tit offsetY값 * 0.3
  gsap.to(".sc-contact .link-mail", {
      transform: "translate(" + x + "px," + y + "px)"
      })
  })
$(".sc-contact .sub-tit").mouseout(function(e){
  gsap.to(".sc-contact .link-mail", {
      transform: "translate(0,0)"
   })
})

