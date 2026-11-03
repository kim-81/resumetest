/* ============================================================
   EDIT HERE FIRST: 실제 지원자 정보로 교체하세요.
   경력과 기여 가치 문구는 index.html에서 바로 수정할 수 있습니다.
   숫자로 표현한 성과는 검증 가능한 사실만 추가하세요.
   ============================================================ */
const profile = {
  name: "김재환",
  role: "AX 패키지 세일즈 다채널 전문가",
  location: "",
  email: "polo1216@naver.com"
};

(() => {
  "use strict";

  // 프로필은 한 곳에서 변경하면 사이드바·연락처·푸터에 반영됩니다.
  const setText = (key, value) => {
    document.querySelectorAll(`[data-profile="${key}"]`).forEach((element) => {
      element.textContent = value;
    });
  };
  setText("name", profile.name);
  setText("role", profile.role);
  setText("location", profile.location);
  setText("emailLabel", profile.email || "이메일 주소 입력");
  document.title = `${profile.name} | ${profile.role}`;
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // 데스크톱·모바일 모두에서 사용할 수 있는 경력 카드 슬라이더
  const windowEl = document.querySelector(".experience-window");
  const slides = Array.from(document.querySelectorAll(".experience-card"));
  const dots = Array.from(document.querySelectorAll("[data-slide]"));
  const currentEl = document.querySelector("[data-current]");
  document.querySelector("[data-total]").textContent = String(slides.length).padStart(2, "0");
  let activeIndex = 0;
  let scrollSyncFrame = 0;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  const markActive = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === activeIndex);
      slide.setAttribute("aria-label", `경력 사례 ${i + 1}${i === activeIndex ? ", 현재 선택" : ""}`);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === activeIndex);
      if (i === activeIndex) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    currentEl.textContent = String(activeIndex + 1).padStart(2, "0");
  };
  const goToSlide = (index, behavior) => {
    markActive(index);
    const slide = slides[activeIndex];
    const left = slide.offsetLeft - windowEl.offsetLeft - (windowEl.clientWidth - slide.offsetWidth) / 2;
    windowEl.scrollTo({left, behavior: behavior || (motionPreference.matches ? "instant" : "smooth")});
  };
  document.querySelector("[data-prev]").addEventListener("click", () => goToSlide(activeIndex - 1));
  document.querySelector("[data-next]").addEventListener("click", () => goToSlide(activeIndex + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => goToSlide(i)));
  windowEl.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  windowEl.addEventListener("scroll", () => {
    cancelAnimationFrame(scrollSyncFrame);
    scrollSyncFrame = requestAnimationFrame(() => {
      const viewportCenter = windowEl.scrollLeft + windowEl.clientWidth / 2;
      let closest = 0;
      let closestDistance = Infinity;
      slides.forEach((slide, index) => {
        const center = slide.offsetLeft - windowEl.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(center - viewportCenter);
        if (distance < closestDistance) { closest = index; closestDistance = distance; }
      });
      markActive(closest);
    });
  }, {passive:true});
  window.addEventListener("resize", () => goToSlide(activeIndex, "instant"));
  goToSlide(0, "instant");

  // 연락처 유효성 확인 + 복사/메일 보내기
  const toast = document.querySelector(".toast");
  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
  };
  const isValidEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email);
  document.querySelector("[data-email-action]").addEventListener("click", () => {
    if (!isValidEmail()) return showToast("script.js의 profile.email에 실제 이메일을 먼저 입력하세요.");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("채용 관련 문의")}`;
  });
  document.querySelector("[data-copy-email]").addEventListener("click", async () => {
    if (!isValidEmail()) return showToast("script.js의 profile.email에 실제 이메일을 먼저 입력하세요.");
    try {
      await navigator.clipboard.writeText(profile.email);
      showToast("이메일 주소를 복사했습니다.");
    } catch {
      showToast(`이메일: ${profile.email}`);
    }
  });
})();
