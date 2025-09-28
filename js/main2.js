gsap.registerPlugin(ScrollTrigger,Flip,MotionPathPlugin); 
let totalWidth = document.querySelector(".skills_list").scrollWidth;

gsap.to(".skills_list", {
  x: () => -(totalWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".skills_wrap",
    start: "top top",
    pin: true,
    scrub: 1,
    end: () => "+=" + (totalWidth - window.innerWidth),
    markers: true
  }
});