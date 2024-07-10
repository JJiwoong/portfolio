let smoothScrolling = function () {
    const lenis = new Lenis({
      //옵션
    })
  
    lenis.on('scroll', (e) => {
      console.log(e)
    })
  
    lenis.on('scroll', ScrollTrigger.update)
  
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
  
    gsap.ticker.lagSmoothing(0)
  }
  smoothScrolling()
  
  function scroll_() {
    document.addEventListener("DOMContentLoaded", function () {
      // 프로그래스 바 엘리먼트
      const progressBar = document.getElementById("myBar");
  
      /**
       * window 객체가 스크롤될 경우
       */
      // window 스크롤 이벤트 감지 및 콜백 셋팅
      window.addEventListener("scroll", function () {
        // window의 스크롤 진행도 계산
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
  
        // 계산된 스크롤 진행도를 CSS로 표현
        progressBar.style.height = scrolled + "%";
      });
    });
  }
  scroll_();

  function cursor() {
    gsap.set(".cursor", {
      xPercent: -50,
      yPercent: -50,
    });
    let ball = document.querySelector(".cursor");
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
  cursor();
  
  function yymmdd() {
    window.onload = function () {
  
      showClock = () => {
        let date = new Date();
        let dayOfMonth = date.getDate();

  
        // Days of week
        let days = date.getDay();
        const weekdays = new Array(7);
        weekdays[0] = "SUN";
        weekdays[1] = "MON";
        weekdays[2] = "TUE";
        weekdays[3] = "WED";
        weekdays[4] = "THR";
        weekdays[5] = "FRI";
        weekdays[6] = "SAT";
  
        let showDays = weekdays[days];
  
        // Month of year
        let month = date.getMonth();
        const yearMonth = new Array(12);
        yearMonth[0] = "JAN";
        yearMonth[1] = "FEB";
        yearMonth[2] = "MAR";
        yearMonth[3] = "APR";
        yearMonth[4] = "MAY";
        yearMonth[5] = "JUN";
        yearMonth[6] = "JUL";
        yearMonth[7] = "AUG";
        yearMonth[8] = "SEP";
        yearMonth[9] = "OCT";
        yearMonth[10] = "NOV";
        yearMonth[11] = "DEC";
  
        let showMonth = yearMonth[month];
  
        let hr = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
  
        let ampm = hr < 12 ? 'AM' : 'PM';
  
        hr = (hr < 10) ? "0" + hr : hr;
        min = (min < 10) ? "0" + min : min;
        sec = (sec < 10) ? "0" + sec : sec;
  
        let time = hr + ':' + min + ':' + sec;
  
        document.querySelector('.date').innerHTML = showDays + ',' + ' ' + showMonth + ' ' + dayOfMonth;
        document.querySelector('.time').innerHTML = time + ' ' + ampm;
  
        setTimeout(showClock, 1000);
      }
  
  
      showClock();
    }
  }
  yymmdd()
  