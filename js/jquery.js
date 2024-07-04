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