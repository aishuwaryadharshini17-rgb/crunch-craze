const savedTheme = localStorage.getItem("crinchTheme");
const savedDirection = localStorage.getItem("crinchDirection");
const isDashboardPage = document.body.classList.contains("dashboard-body");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

if (savedDirection === "rtl") {
  document.documentElement.dir = "rtl";
}

const needsPageControls = !document.querySelector(".dark-toggle, .rtl-toggle")
  && (isDashboardPage || document.querySelector(".login-only-page"));

if (needsPageControls) {
  const pageTools = document.createElement("div");
  pageTools.className = "page-tools";
  pageTools.setAttribute("aria-label", "Page display controls");
  pageTools.innerHTML = `
    <button class="dark-toggle" type="button" aria-label="Switch to dark mode">&#9790;</button>
    <button class="rtl-toggle" type="button" aria-label="Switch to RTL layout">RTL</button>
  `;

  const dashboardActions = document.querySelector(".dashboard-actions");
  const dashboardProfile = document.querySelector(".dashboard-topbar .profile-chip");
  const dashboardMenuForTools = document.querySelector(".dashboard-menu");
  const loginCard = document.querySelector(".login-card");
  const loginBrand = document.querySelector(".login-brand");

  if (dashboardMenuForTools) {
    pageTools.classList.add("dashboard-menu-tools");
    dashboardMenuForTools.appendChild(pageTools);
  } else if (dashboardActions) {
    pageTools.classList.add("dashboard-topbar-tools");
    dashboardActions.insertBefore(pageTools, dashboardActions.querySelector(".profile-chip"));
  } else if (dashboardProfile) {
    const profileActions = document.createElement("div");
    profileActions.className = "dashboard-actions dashboard-profile-actions";
    pageTools.classList.add("dashboard-topbar-tools");
    dashboardProfile.insertAdjacentElement("beforebegin", profileActions);
    profileActions.append(pageTools, dashboardProfile);
  } else if (loginCard) {
    loginCard.prepend(pageTools);
  } else if (loginBrand) {
    loginBrand.insertAdjacentElement("afterend", pageTools);
  } else {
    document.body.appendChild(pageTools);
  }
}

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector("#main-nav");
const dashboardMenuToggle = document.querySelector(".dashboard-menu-toggle");
const dashboardMenu = document.querySelector(".dashboard-menu");
const rtlToggles = document.querySelectorAll(".rtl-toggle");
const darkToggles = document.querySelectorAll(".dark-toggle");
const revealItems = document.querySelectorAll(".reveal-on-scroll");
const planCards = document.querySelector(".plan-cards");
const planPrev = document.querySelector(".plan-slide-prev");
const planNext = document.querySelector(".plan-slide-next");
const builderSizeCards = document.querySelectorAll(".builder-size-card");
const builderCategoryButtons = document.querySelectorAll(".builder-category-grid button");
const deliveryButtons = document.querySelectorAll(".delivery-grid button");
const quantityControls = document.querySelectorAll(".qty-control");
const extraCards = document.querySelectorAll(".extra-card");
const quizOptions = document.querySelectorAll(".quiz-option");
const planResultTitle = document.querySelector("#plan-result-title");
const planResultText = document.querySelector("#plan-result-text");
const planResultImage = document.querySelector("#plan-result-image");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
  });
}

if (dashboardMenuToggle && dashboardMenu) {
  document.body.classList.add("dashboard-menu-ready");

  const closeDashboardMenu = () => {
    dashboardMenu.classList.remove("is-open");
    dashboardMenuToggle.classList.remove("is-open");
    dashboardMenuToggle.setAttribute("aria-expanded", "false");
    dashboardMenuToggle.setAttribute("aria-label", "Open dashboard menu");
  };

  dashboardMenuToggle.addEventListener("click", () => {
    const isOpen = dashboardMenu.classList.toggle("is-open");
    dashboardMenuToggle.classList.toggle("is-open", isOpen);
    dashboardMenuToggle.setAttribute("aria-expanded", isOpen);
    dashboardMenuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close dashboard menu" : "Open dashboard menu"
    );
  });

  dashboardMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDashboardMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDashboardMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      closeDashboardMenu();
    }
  });
}

if (rtlToggles.length) {
  const syncDirectionToggles = () => {
    const isRtl = document.documentElement.dir === "rtl";
    rtlToggles.forEach((toggle) => {
      toggle.textContent = toggle.classList.contains("icon-toggle") ? "\u21C4" : (isRtl ? "LTR" : "RTL");
      toggle.setAttribute(
        "aria-label",
        isRtl ? "Switch to LTR layout" : "Switch to RTL layout"
      );
    });
  };

  syncDirectionToggles();

  rtlToggles.forEach((rtlToggle) => rtlToggle.addEventListener("click", () => {
    const nextDirection = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    document.documentElement.dir = nextDirection;
    localStorage.setItem("crinchDirection", nextDirection);
    syncDirectionToggles();
  }));
}

if (darkToggles.length) {
  const syncDarkToggles = () => {
    const isDark = document.body.classList.contains("dark-mode");
    darkToggles.forEach((toggle) => {
      toggle.textContent = isDark ? "\u2600" : "\u263E";
      toggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    });
  };

  syncDarkToggles();

  darkToggles.forEach((darkToggle) => darkToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("crinchTheme", isDark ? "dark" : "light");
    syncDarkToggles();
  }));
}

if (planCards && planPrev && planNext) {
  const slidePlans = (direction) => {
    const firstCard = planCards.querySelector(".plan-card");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 320;
    planCards.scrollBy({
      left: direction * (cardWidth + 22),
      behavior: "smooth"
    });
  };

  planPrev.addEventListener("click", (event) => {
    event.preventDefault();
    slidePlans(-1);
  });

  planNext.addEventListener("click", (event) => {
    event.preventDefault();
    slidePlans(1);
  });
}

if (builderSizeCards.length) {
  const selectSizeCard = (selectedCard) => {
    builderSizeCards.forEach((card) => {
      card.classList.toggle("is-selected", card === selectedCard);
    });
  };

  builderSizeCards.forEach((card) => {
    card.addEventListener("click", () => selectSizeCard(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectSizeCard(card);
      }
    });
  });
}

builderCategoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-selected");
  });
});

deliveryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    deliveryButtons.forEach((deliveryButton) => {
      deliveryButton.classList.toggle("is-selected", deliveryButton === button);
    });
  });
});

quantityControls.forEach((control) => {
  const buttons = control.querySelectorAll("button");
  const value = control.querySelector("strong");

  if (buttons.length === 2 && value) {
    buttons[0].addEventListener("click", () => {
      value.textContent = Math.max(0, Number(value.textContent) - 1);
    });

    buttons[1].addEventListener("click", () => {
      value.textContent = Number(value.textContent) + 1;
    });
  }
});

extraCards.forEach((card) => {
  const checkbox = card.querySelector("input");

  if (checkbox) {
    card.classList.toggle("is-selected", checkbox.checked);
    checkbox.addEventListener("change", () => {
      card.classList.toggle("is-selected", checkbox.checked);
    });
  }
});

quizOptions.forEach((option) => {
  option.addEventListener("click", () => {
    quizOptions.forEach((quizOption) => {
      quizOption.classList.toggle("is-selected", quizOption === option);
    });

    if (planResultTitle) {
      planResultTitle.textContent = option.dataset.plan;
    }

    if (planResultText) {
      planResultText.textContent = option.dataset.text;
    }

    if (planResultImage && option.dataset.image) {
      planResultImage.src = option.dataset.image;
      planResultImage.alt = `${option.dataset.plan} recommended snack subscription box`;
    }
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
