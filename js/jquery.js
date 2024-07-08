$('.project .thumb-box').mouseover(function(){
    gsap.to('.cursor',{scale:2})
    gsap.to('.cursor span', { visibility: "visible", opacity: 1})
  })
  $('.project .thumb-box').mouseleave(function(){
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
//   $(document).ready(function(){
//     $('.infobox').mouseover(function(){
//         $('.img-box').addClass("hide");
//     });
//     $('.infobox').mouseleave(function(){
//         $('.img-box').removeClass("hide");
//     });
// });

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

$('[data-color]').each(function(i,el){ 
  color = ($(this).data('color') == '#fff') ? 'white' : 'black' // 만약 data-color = "#fff" 면 "white" 아니면 "black" -> 클래스명 변수
  gsap.to('.background',{
      scrollTrigger:{
          trigger:el,
          start:"top 10%",
          end:"bottom 10%",
          scrub:1,
          toggleClass: {targets: ".background", className: color}
      }
  })
})

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

