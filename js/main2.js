gsap.registerPlugin(ScrollTrigger,Flip,MotionPathPlugin); 

gsap.to("#page1", {
  opacity: 0.08,      // 최종 상태
  scrollTrigger: {
    trigger: "#page1",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
    pinSpacing: false,
        pinType: "fixed",
  }
});

const button = document.querySelector(".header__nav");
const logo = document.querySelector(".header__logo");

// opacity 애니 끝난 후 z-index 낮추기
[button, logo].forEach(el => {
  el.addEventListener("transitionend", () => {
    if (el.style.opacity === "0") {
      el.style.zIndex = "-1"; // 완전히 사라지고 나서만 z-index 낮춤
    }
  });
});

gsap.to(".about__visual", {
  scrollTrigger: {
    trigger: ".about__visual",
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

gsap.to(".about__mv", {
  opacity:1,
    duration: 1.2, // 1.2초 동안 서서히 나타남
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".about__visual",
    start: "top 20%",
    end: "bottom bottom",
    toggleActions: "play none none reverse",
  }
});

gsap.to(".about__title", {
  opacity:0,
  y:100,
  scrollTrigger: {
    trigger: ".about__title",
    start: "bottom 10%",
    end: "bottom bottom",
    toggleActions: "play none none reverse",
  }
});

gsap.to(".about__name", {
  opacity:0,
  y:100,
  scrollTrigger: {
    trigger: ".about__name",
    start: "20% top",
    end: "bottom bottom",
    toggleActions: "play none none reverse",
  }
});

gsap.fromTo(".about__intro-text p", 
  { 
    y: 100,   // 시작 위치 (위에서)
    opacity: 0 // 시작 시 투명
  }, 
  { 
    y: 0,      // 원래 위치
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about__intro",
      start: "top 40%",   // about 섹션의 top이 뷰포트 60% 지점에 닿을 때 시작
      end: "bottom 40%",  // 필요시 조정
      toggleActions: "play none none reverse",
    }
  }
);

document.querySelectorAll(".about__skills").forEach((group) => {
  const skills = group.querySelectorAll(".skill_box");

  gsap.timeline({
    scrollTrigger: {
      trigger: group,
      start: "top top",
      end: "+=200%",  // 한 화면 동안
      scrub: true,
      pin: true,      // 그룹 고정
    }
  })
  .to(skills[0], { y: "0%", opacity: 1, duration: 1 })
  .to(skills[1], { y: "0%", opacity: 1, duration: 1 })
  .to(skills[2], { y: "0%", opacity: 1, duration: 1 })
});

gsap.fromTo(".project__title", 
  { 
    opacity: 0 // 시작 시 투명
  }, 
  { 
    opacity: 1,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#project",
      start: "top 50%",   // about 섹션의 top이 뷰포트 60% 지점에 닿을 때 시작
      end: "bottom 40%",  // 필요시 조정
      toggleActions: "play none none reverse",
      invalidateOnRefresh: true,
    }
  }
);
gsap.fromTo(".work_project, .personal_project", 
  { 
    opacity: 0 // 시작 시 투명
  }, 
  { 
    opacity: 1,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".project__section",
      start: "top 40%",   // about 섹션의 top이 뷰포트 60% 지점에 닿을 때 시작
      end: "bottom 60%",  // 필요시 조정
      toggleActions: "play none none reverse",
    }
  }
);


gsap.fromTo(".about__skills .skills__title", 
  { 
    y: -100,
    opacity: 0
  }, 
  { 
    y: 0,
    opacity: 1,
    duration: 0.4,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about__skills",
      start: "40% bottom",   // skills_wrap의 top이 뷰포트 80% 지점에 닿을 때 (즉, 20% 보였을 때)
      end: "bottom 40%",  // 필요하면 조정 가능
      toggleActions: "play none none reverse",
    }
  }
);

gsap.to(".about__img", {
  opacity:1,
  duration: 1.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".about__visual",
    start: "top 35%",
    end: "top 10%", 
  }
});

gsap.to("#contact", {
  backgroundColor: "#fff",
  scrollTrigger: {
    trigger: "#contact",
    start: "top 80%",
    end: "bottom top",
    toggleActions: "play reverse play reverse",
  }
});

gsap.to(".progress-bar", {
  backgroundColor: "#000",
  scrollTrigger: {
    trigger: "#contact",
    start: "top 40%",
    end: "bottom top",
    toggleActions: "play reverse play reverse",
  }
});
document.getElementById("year").innerHTML = new Date().getFullYear();