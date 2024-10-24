class Runline {
  constructor(container, strings, divider = " | ", classNameText = "") {
    this.container = container;
    this.strings = strings;

    this.stringElement = document.createElement("span");
    this.stringElement.textContent = strings
      .join(divider)
      .concat(divider)
      .concat(strings.join(divider));
    this.stringElement.classList.add("runline-text");
    classNameText && this.stringElement.classList.add(classNameText);
  }
  run() {
    this.container.innerHTML = "";

    this.container.appendChild(this.stringElement);
  }
}

class Slider {
  constructor({
    container,
    counterContainers,
    slides,
    leftControl,
    rightControl,
    gap,
    panelView = "counter",
    autoslide = true,
  }) {
    // ------------------- SETUP -------------------

    this.panelView = panelView;
    this.container = container;
    this.counterContainers = counterContainers;
    this.leftControl = leftControl;
    this.rightControl = rightControl;
    this.slides = slides;

    this.slidesCount = slides.length;

    this.currentSlide = 1;

    this.gap = gap;

    this.autoslide = autoslide;
  }

  init() {
    // ------------------- INIT/SLIDES -------------------

    this.wrapper = document.createElement("div");
    this.wrapper.style.display = "flex";
    this.wrapper.style.gap = `${this.gap}px`;
    this.wrapper.style.transition = "all 0.3s ease";

    this.slides.forEach((slide) => {
      this.wrapper.appendChild(slide);
    });

    this.container.appendChild(this.wrapper);

    this.slideWidth = this.slides[0].offsetWidth;
    this.wrapper.style.width =
      this.slideWidth * this.slidesCount +
      (this.slidesCount - 1) * this.gap +
      "px";

    this.slidesInView = Math.floor(
      this.container.offsetWidth / this.slides[0].offsetWidth
    );

    // ------------------- INIT/COUNTER -------------------

    if (this.panelView === "counter") {
      const { slideNumberElements, slidesCountElement, updateSlidesCount } =
        appendNumberCounter({
          containers: this.counterContainers,
          slidesCount: this.slidesCount - this.slidesInView + 1,
        });

      this.slideNumberElements = slideNumberElements;
      this.slidesCountElement = slidesCountElement;
      this.updateSlidesCount = updateSlidesCount;
    } else if (this.panelView === "dots") {
      const { dots, activateDot, deactivateDot } = appendDotsCounter({
        container: this.counterContainers,
        slidesCount: this.slidesCount,
      });

      this.dots = dots;
      this.activateDot = activateDot;
      this.deactivateDot = deactivateDot;
    }

    // ------------------- LISTENERS -------------------

    // ------------------- LISTENERS/ARROWS -------------------

    if (Array.isArray(this.leftControl)) {
      this.leftControl.forEach((control) => {
        control.addEventListener("click", () => this.prevSlide());
      });
    } else {
      this.leftControl.addEventListener("click", () => this.prevSlide());
    }

    if (Array.isArray(this.rightControl)) {
      this.rightControl.forEach((control) => {
        control.addEventListener("click", () => {
          this.nextSlide();
        });
      });
    } else {
      this.rightControl.addEventListener("click", () => {
        this.nextSlide();
      });
    }

    // ------------------- LISTENERS/TOUCHES -------------------

    this.container.addEventListener("touchstart", (event) => {
      this.touchStartX = event.touches[0].clientX;
    });

    this.container.addEventListener("touchend", (event) => {
      if (this.touchStartX - event.changedTouches[0].clientX > 50) {
        this.nextSlide();
      } else if (this.touchStartX - event.changedTouches[0].clientX < -50) {
        this.prevSlide();
      }
    });

    window.addEventListener("resize", () => {
      this.slideWidth = this.slides[0].offsetWidth;
      this.wrapper.style.width =
        this.slideWidth * this.slidesCount +
        (this.slidesCount - 1) * this.gap +
        "px";

      this.slidesInView = Math.floor(
        this.container.offsetWidth / this.slides[0].offsetWidth
      );

      if (this.panelView === "counter") {
        this.updateSlidesCount(this.slidesCount - this.slidesInView + 1);
      }
    });

    // ------------------- AUTOSLIDING -------------------

    if (this.autoslide) {
      this.container.addEventListener("mouseenter", () => {
        clearInterval(this.interval);
      });

      this.container.addEventListener("mouseleave", () => {
        this.interval = setInterval(() => {
          this.nextSlide();
        }, 3000);
      });

      if (this.slidesCount > this.slidesInView) {
        this.interval = setInterval(() => {
          this.nextSlide();
        }, 3000);
      }
    }
  }

  nextSlide() {
    this.currentSlide = this.currentSlide + 1;
    if (this.currentSlide > this.slidesCount - this.slidesInView + 1) {
      this.currentSlide = 1;
    }
    this.update();
  }

  prevSlide() {
    this.currentSlide = this.currentSlide - 1;
    if (this.currentSlide < 1) {
      this.currentSlide = this.slidesCount - this.slidesInView + 1;
    }
    this.update();
  }

  update() {
    const slideOffset = this.slideWidth * (this.currentSlide - 1);
    const slideGap = this.gap * (this.currentSlide - 1);

    this.wrapper.style.transform = `translateX(${-slideOffset - slideGap}px)`;

    if (this.panelView === "counter") {
      if (Array.isArray(this.slideNumberElements)) {
        this.slideNumberElements.forEach((element) => {
          element.textContent = this.currentSlide;
        });
      } else {
        this.counterElement.textContent = this.currentSlide;
      }
    } else if (this.panelView === "dots") {
      this.slides.forEach((_, index) => {
        this.deactivateDot(index);
      });

      this.activateDot(this.currentSlide - 1);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // ------------------- HEADER RUNLINE -------------------

  const headerStrings = [
    "Дело помощи утопающим — дело рук самих утопающих!",
    "Шахматы двигают вперед не только культуру, но и экономику!",
    "Лед тронулся, господа присяжные заседатели!",
  ];

  const headerRunline = document.getElementById("headerRunline");

  new Runline(
    headerRunline,
    headerStrings,
    " • ",
    "header__runline-text"
  ).run();

  // ------------------- MAIN RUNLINE -------------------

  const mainStrings = [
    "Дело помощи утопающим — дело рук самих утопающих!",
    "Шахматы двигают вперед не только культуру, но и экономику!",
    "Лед тронулся, господа присяжные заседатели!",
  ];

  const mainRunline = document.getElementById("mainRunline");

  new Runline(mainRunline, mainStrings, " • ", "main__runline-text").run();

  // ------------------- PARTICIPANTS SLIDER -------------------

  const participantsSliderContainer =
    document.getElementById("sliderContainer");
  const participantsSlides = document.querySelectorAll(
    ".tournament-participants__slide"
  );

  const participantsSliderLeftControl =
    document.getElementById("sliderLeftControl");
  const participantsSliderRightControl =
    document.getElementById("sliderRightControl");
  const participantsSliderLeftControlMobile = document.getElementById(
    "sliderLeftControlMobile"
  );
  const participantsSliderRightControlMobile = document.getElementById(
    "sliderRightControlMobile"
  );

  const participantsCounter = document.getElementById(
    "tournamentParticipantsSliderCounter"
  );

  const participantsCounterMobile = document.getElementById(
    "tournamentParticipantsSliderCounterMobile"
  );

  new Slider({
    container: participantsSliderContainer,
    slides: participantsSlides,
    leftControl: [
      participantsSliderLeftControl,
      participantsSliderLeftControlMobile,
    ],
    rightControl: [
      participantsSliderRightControl,
      participantsSliderRightControlMobile,
    ],
    counterContainers: [participantsCounterMobile, participantsCounter],
    panelView: "counter",
    appendStrategy: "append",
    gap: 20,
  }).init();

  // ------------------- STAGES SLIDER -------------------

  const stagesSliderContainer = document.getElementById(
    "transformationStagesSliderMobile"
  );

  const stagesSlides = document.querySelectorAll(
    ".transformation-stages__item_mobile"
  );

  const stagesSliderLeftControl = document.getElementById(
    "transformationStagesSliderLeftControl"
  );
  const stagesSliderRightControl = document.getElementById(
    "transformationStagesSliderRightControl"
  );

  const stagesControlPanelContainer = document.querySelector(
    ".transformation-stages__slider-counter"
  );

  new Slider({
    container: stagesSliderContainer,
    leftControl: stagesSliderLeftControl,
    rightControl: stagesSliderRightControl,
    counterContainers: stagesControlPanelContainer,
    slides: stagesSlides,
    gap: 20,
    panelView: "dots",
    appendStrategy: "prepend",
    autoslide: false,
  }).init();
});

function appendNumberCounter({ containers, slidesCount }) {
  const counterElement = document.createElement("div");
  const slideNumber = document.createElement("span");
  const divider = document.createElement("span");
  const slidesCountElement = document.createElement("span");

  slideNumber.textContent = "1";
  divider.textContent = " / ";
  slidesCountElement.textContent = slidesCount;

  counterElement.classList.add("slider-counter");
  slideNumber.classList.add("slider-slide-counter-current");

  counterElement.appendChild(slideNumber);
  counterElement.appendChild(divider);
  counterElement.appendChild(slidesCountElement);

  const slideNumberElements = [];

  if (Array.isArray(containers)) {
    containers.forEach((element) => {
      const elemClone = counterElement.cloneNode({ deep: true });
      element.appendChild(elemClone);

      slideNumberElements.push(elemClone.childNodes[0]);
    });
  } else {
    containers.appendChild(counterElement);
    slideNumberElements.push(counterElement);
  }

  const updateSlidesCount = (newSlidesCount) => {
    if (Array.isArray(containers)) {
      containers.forEach((element) => {
        element.firstChild.childNodes[2].textContent = newSlidesCount;
      });
    } else {
      containers.firstChild.childNodes[2].textContent = newSlidesCount;
    }
  };

  return {
    slideNumberElements,
    slidesCountElement,
    containers,
    updateSlidesCount,
  };
}

function appendDotsCounter({ container, slidesCount }) {
  const dots = document.createElement("div");
  const dotElement = document.createElement("div");

  dotElement.classList.add("slider-dot-counter");

  for (let i = 0; i < slidesCount; i++) {
    const dot = dotElement.cloneNode();
    if (i === 0) {
      dot.classList.add("slider-dot-counter_active");
    }
    dots.appendChild(dot);
  }

  container.appendChild(dots);

  return {
    dots: dots.children,
    activateDot: (index) => {
      dots.children[index].classList.add("slider-dot-counter_active");
    },
    deactivateDot: (index) => {
      dots.children[index].classList.remove("slider-dot-counter_active");
    },
  };
}
