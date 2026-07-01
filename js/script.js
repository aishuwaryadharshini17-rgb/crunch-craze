const savedTheme = localStorage.getItem("crinchTheme");
const savedDirection = localStorage.getItem("crinchDirection");
const isDashboardPage = document.body.classList.contains("dashboard-body");
const ccIcon = (name, extraClass = "") =>
  `<i class="cc-icon cc-icon-${name}${extraClass ? ` ${extraClass}` : ""}" aria-hidden="true"></i>`;

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

document.documentElement.dir = savedDirection === "rtl" ? "rtl" : "ltr";

const ensureBackToTop = () => {
  if (!document.querySelector("#top")) {
    document.body.id = "top";
  }

  if (!document.querySelector(".back-to-top")) {
    const backToTop = document.createElement("a");
    backToTop.className = "back-to-top";
    backToTop.href = "#top";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.textContent = "\u2191";
    document.body.appendChild(backToTop);
  }
};

const addAuthLinks = () => {
  const headerControls = document.querySelector("header .header-controls");
  const navActions = document.querySelector("header .nav-actions");

  if (headerControls && !headerControls.querySelector(".auth-link")) {
    const loginLink = document.createElement("a");
    loginLink.className = "auth-link login-link";
    loginLink.href = "login.html";
    loginLink.innerHTML = `${ccIcon("users")} <span>Login</span>`;

    const navToggleButton = headerControls.querySelector(".nav-toggle");
    headerControls.insertBefore(loginLink, navToggleButton);
  }

  if (navActions && !navActions.querySelector(".auth-link")) {
    navActions.insertAdjacentHTML(
      "beforeend",
      `<a class="auth-link login-link" href="login.html">${ccIcon("users")} <span>Login</span></a>`
    );
  }
};

addAuthLinks();
ensureBackToTop();

if (isDashboardPage) {
  const dashboardActions = document.querySelector(".dashboard-actions");
  const dashboardProfile = document.querySelector(".dashboard-topbar .profile-chip");
  const dashboardMenuForTools = document.querySelector(".dashboard-menu");
  const topbarTools = document.querySelector(".dashboard-topbar .page-tools");

  if (topbarTools) {
    if (!topbarTools.querySelector(".dark-toggle")) {
      topbarTools.insertAdjacentHTML(
        "beforeend",
        `<button class="dark-toggle" type="button" aria-label="Switch to dark mode">${ccIcon("moon")}</button>`
      );
    }
  } else if (dashboardActions) {
    const pageTools = document.createElement("div");
    pageTools.className = "page-tools dashboard-topbar-tools";
    pageTools.setAttribute("aria-label", "Page display controls");
    pageTools.innerHTML = `
      <button class="rtl-toggle" type="button" aria-label="Switch to RTL layout">RTL</button>
      <button class="dark-toggle" type="button" aria-label="Switch to dark mode">${ccIcon("moon")}</button>
    `;
    dashboardActions.insertBefore(pageTools, dashboardActions.querySelector(".notification-wrapper"));
  }

  if (!topbarTools && !dashboardActions && dashboardMenuForTools && !dashboardMenuForTools.querySelector(".dashboard-menu-tools")) {
    const menuTools = document.createElement("div");
    menuTools.className = "dashboard-menu-tools";
    menuTools.setAttribute("aria-label", "Dashboard display controls");
    menuTools.innerHTML = `
      <div class="page-tools" aria-label="Page display controls">
        <button class="rtl-toggle" type="button" aria-label="Switch to RTL layout">RTL</button>
        <button class="dark-toggle" type="button" aria-label="Switch to dark mode">${ccIcon("moon")}</button>
      </div>
      <a class="dashboard-logout" href="index.html">${ccIcon("logout")} Logout</a>
    `;
    dashboardMenuForTools.appendChild(menuTools);
  } else if (!document.querySelector(".dark-toggle, .rtl-toggle")) {
    const pageTools = document.createElement("div");
    pageTools.className = "page-tools dashboard-topbar-tools";
    pageTools.setAttribute("aria-label", "Page display controls");
    pageTools.innerHTML = `
      <button class="rtl-toggle" type="button" aria-label="Switch to RTL layout">RTL</button>
      <button class="dark-toggle" type="button" aria-label="Switch to dark mode">${ccIcon("moon")}</button>
    `;

    if (dashboardActions) {
      dashboardActions.insertBefore(pageTools, dashboardActions.querySelector(".profile-chip"));
    } else if (dashboardProfile) {
      const profileActions = document.createElement("div");
      profileActions.className = "dashboard-actions dashboard-profile-actions";
      dashboardProfile.insertAdjacentElement("beforebegin", profileActions);
      profileActions.append(pageTools, dashboardProfile);
    } else {
      document.body.appendChild(pageTools);
    }
  }
}

const setupLogoutConfirm = () => {
  const logoutLinks = document.querySelectorAll(".dashboard-logout");

  if (!logoutLinks.length) {
    return;
  }

  const modal = document.createElement("div");
  modal.className = "logout-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "logout-modal-title");
  modal.setAttribute("aria-describedby", "logout-modal-message");
  modal.setAttribute("hidden", "");
  modal.innerHTML = `
    <div class="logout-modal__panel" role="document">
      <div class="logout-modal__icon">${ccIcon("logout")}</div>
      <h2 id="logout-modal-title">Confirm Logout</h2>
      <p id="logout-modal-message">Are you sure you want to logout?</p>
      <div class="logout-modal__actions">
        <button class="logout-modal__confirm" type="button">Yes</button>
        <button class="logout-modal__cancel" type="button">No</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const confirmButton = modal.querySelector(".logout-modal__confirm");
  const cancelButton = modal.querySelector(".logout-modal__cancel");
  let logoutTarget = "index.html";

  const closeModal = () => {
    modal.setAttribute("hidden", "");
    document.body.classList.remove("logout-modal-open");
  };

  const openModal = (target) => {
    logoutTarget = target || "index.html";
    modal.removeAttribute("hidden");
    document.body.classList.add("logout-modal-open");
    confirmButton.focus();
  };

  logoutLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(link.getAttribute("href"));
    });
  });

  confirmButton.addEventListener("click", () => {
    window.location.href = logoutTarget;
  });

  cancelButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hasAttribute("hidden")) {
      closeModal();
    }
  });
};

if (!isDashboardPage && !document.querySelector(".login-only-page") && !document.querySelector("footer")) {
  const footer = document.createElement("footer");

  // Try to mirror the site's header brand (logo, name, tag) so footer matches header
  const brandElem = document.querySelector('.brand') || document.querySelector('.dashboard-logo');
  const logoSrc = brandElem && brandElem.querySelector('img') ? brandElem.querySelector('img').getAttribute('src') : 'image/logo.png';
  const brandName = brandElem && brandElem.querySelector('.brand-name') ? brandElem.querySelector('.brand-name').textContent.trim() : 'Crunch Craze';
  const brandTag = brandElem && brandElem.querySelector('.brand-tag') ? brandElem.querySelector('.brand-tag').textContent.trim() : 'Specialty popcorn & snack boxes';

  footer.innerHTML = `
    <div class="footer-main">
      <section>
        <a class="footer-brand-lockup" href="index.html" aria-label="${brandName} home">
          <img class="logo" src="${logoSrc}" alt="${brandName} logo">
          <div class="brand-text">
            <div class="brand-name">${brandName}</div>
            <div class="brand-tag">${brandTag}</div>
          </div>
        </a>
        <p class="footer-tagline">Customize. Subscribe. Snack Happier.</p>
        <p>
          Discover delicious popcorn, gourmet snacks, and personalized snack boxes delivered right to your doorstep.
          Enjoy fresh flavors, flexible subscriptions, and a premium snacking experience.
        </p>
      </section>

      <section>
        <h2>Quick Links</h2>
        <ul class="footer-list">
          <li><a href="index.html">${ccIcon("home")} Home</a></li>
          <li><a href="about.html">${ccIcon("users")} About</a></li>
          <li><a href="build-your-box.html">${ccIcon("package")} Build Your Box</a></li>
          <li><a href="subscription-plans.html">${ccIcon("gift")} Subscription Plans</a></li>
          <li><a href="dashboard.html">${ccIcon("target")} Dashboard</a></li>
          <li><a href="contact.html">${ccIcon("message")} Contact Us</a></li>
        </ul>
      </section>

      <section>
        <h2>Categories</h2>
        <ul class="footer-list">
          <li><a href="#">${ccIcon("popcorn")} Popcorn</a></li>
          <li><a href="#">${ccIcon("cookie")} Cookies</a></li>
          <li><a href="#">${ccIcon("bar")} Chocolates</a></li>
          <li><a href="#">${ccIcon("nut")} Nuts</a></li>
          <li><a href="#">${ccIcon("chip")} Chips</a></li>
          <li><a href="#">${ccIcon("leaf")} Healthy Snacks</a></li>
        </ul>
      </section>

      <section>
        <h2>Customer Support</h2>
        <ul class="footer-list">
          <li><a href="#">${ccIcon("truck")} Shipping & Delivery</a></li>
          <li><a href="#">${ccIcon("package")} Returns & Refunds</a></li>
          <li><a href="#">${ccIcon("shield")} Privacy Policy</a></li>
          <li><a href="#">${ccIcon("credit-card")} Terms & Conditions</a></li>
          <li><a href="#">${ccIcon("message")} Help Center</a></li>
          <li><a href="contact.html">${ccIcon("phone")} Contact Us</a></li>
        </ul>
      </section>

      <section>
        <h2>Contact Us</h2>
        <span class="support-line">${ccIcon("map-pin")} Madurai, Tamil Nadu, India</span>
        <span class="support-line">${ccIcon("mail")} support@crunchcraze.com</span>
        <span class="support-line">${ccIcon("phone")} +91 98765 43210</span>
        <span class="support-line">${ccIcon("clock")} Mon - Sat : 9:00 AM - 7:00 PM</span>

        <h2>Newsletter</h2>
        <p>Stay updated with exclusive offers, snack launches, and subscription discounts.</p>
        <form class="newsletter-form">
          <input type="email" placeholder="Email Address" aria-label="Email Address">
          <button type="submit">Subscribe</button>
        </form>

        <h2>Follow Us</h2>
        <ul class="social-list">
          <li><a href="#" aria-label="Facebook"><span class="social-icon">f</span></a></li>
          <li><a href="#" aria-label="Instagram"><span class="social-icon camera-icon"></span></a></li>
          <li><a href="#" aria-label="X Twitter"><span class="social-icon">X</span></a></li>
          <li><a href="#" aria-label="Pinterest"><span class="social-icon">P</span></a></li>
          <li><a href="#" aria-label="YouTube"><span class="social-icon play-icon"></span></a></li>
        </ul>
      </section>
    </div>

    <div class="footer-bottom">
      <span>&copy; 2026 Crunch Craze. All Rights Reserved.</span>
      <span>Designed for Snack Lovers.</span>
    </div>
  `;

  const page = document.querySelector(".page");
  if (page) {
    page.appendChild(footer);
  } else {
    document.body.appendChild(footer);
  }
}

const getButtonIconName = (element) => {
  const text = element.textContent.trim().toLowerCase();
  const href = element.getAttribute("href") || "";

  if (text.includes("track") || text.includes("delivery") || href.includes("track")) return "truck";
  if (text.includes("address") || href.includes("address")) return "map-pin";
  if (text.includes("payment") || text.includes("coupon") || href.includes("payment")) return "credit-card";
  if (text.includes("reward")) return "gift";
  if (text.includes("favorite")) return "heart";
  if (text.includes("subscribe") || text.includes("plan") || text.includes("upgrade")) return "gift";
  if (text.includes("build") || text.includes("box") || text.includes("customize")) return "package";
  if (text.includes("shop") || text.includes("order") || text.includes("snack")) return "cart";
  if (text.includes("view") || text.includes("manage") || text.includes("preview")) return "target";
  if (text.includes("save") || text.includes("copy")) return "check";
  if (text.includes("login") || text.includes("register")) return "users";
  if (text.includes("pause")) return "calendar";
  if (text.includes("cancel")) return "shield";

  return "";
};

const enhanceSiteIcons = () => {
  const dashboardIconMap = {
    "dashboard.html": "target",
    "subscription.html": "gift",
    "orders.html": "package",
    "snack-box.html": "popcorn",
    "rewards.html": "star",
    "favorites.html": "heart",
    "track-delivery.html": "truck",
    "payments.html": "credit-card",
    "address-book.html": "map-pin",
    "notifications.html": "message",
    "settings.html": "settings"
  };

  document.querySelectorAll(".dashboard-menu a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const iconName = dashboardIconMap[href];
    const firstSpan = link.querySelector(":scope > span:first-child");

    if (iconName && firstSpan && !firstSpan.classList.contains("cc-icon")) {
      firstSpan.outerHTML = ccIcon(iconName, "dashboard-menu-icon");
    }
  });

  document.querySelectorAll(".button, .dashboard-actions button, .coupon-list button").forEach((button) => {
    if (button.querySelector(".cc-icon") || button.classList.contains("dark-toggle") || button.classList.contains("rtl-toggle")) {
      return;
    }

    const iconName = getButtonIconName(button);
    if (iconName) {
      button.insertAdjacentHTML("afterbegin", ccIcon(iconName, "button-icon"));
    }
  });

  document.querySelectorAll(".quick-action-grid a").forEach((action) => {
    const label = action.querySelector("strong");
    const marker = action.querySelector(":scope > span:first-child");
    const iconName = getButtonIconName(action);

    if (label && marker && iconName && !marker.classList.contains("cc-icon")) {
      marker.outerHTML = ccIcon(iconName, "quick-action-icon");
    }
  });

  document.querySelectorAll(".account-mini-card").forEach((card) => {
    if (!card.querySelector(":scope > .cc-icon")) {
      const iconName = getButtonIconName(card) || "star";
      card.insertAdjacentHTML("afterbegin", ccIcon(iconName, "account-card-icon"));
    }
  });

  document.querySelectorAll(".profile-chip").forEach((chip) => {
    const lastSpan = chip.querySelector(":scope > span:last-child");
    if (lastSpan && !lastSpan.classList.contains("cc-icon")) {
      lastSpan.outerHTML = ccIcon("chevron-down", "profile-chevron");
    }
  });
};

enhanceSiteIcons();
setupLogoutConfirm();

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector("#main-nav");
const dashboardMenuToggle = document.querySelector(".dashboard-menu-toggle");
const dashboardMenu = document.querySelector(".dashboard-menu");
const rtlToggles = document.querySelectorAll(".rtl-toggle");
const darkToggles = document.querySelectorAll(".dark-toggle");
const addSiteRevealAnimations = () => { };

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
const dashboardTopbarActions = document.querySelector(".dashboard-topbar .dashboard-actions");

if (dashboardMenu && dashboardTopbarActions) {
  const dashboardActionsPlaceholder = document.createComment("dashboard actions");
  const dashboardActionsSlot = document.createElement("div");
  const dashboardActionsMedia = window.matchMedia("(max-width: 1080px)");

  dashboardActionsSlot.className = "dashboard-menu-actions";
  dashboardTopbarActions.parentNode.insertBefore(dashboardActionsPlaceholder, dashboardTopbarActions);

  const syncDashboardActionsPlacement = () => {
    if (dashboardActionsMedia.matches) {
      if (!dashboardActionsSlot.contains(dashboardTopbarActions)) {
        dashboardActionsSlot.appendChild(dashboardTopbarActions);
      }

      if (!dashboardMenu.contains(dashboardActionsSlot)) {
        dashboardMenu.appendChild(dashboardActionsSlot);
      }
    } else if (dashboardActionsPlaceholder.parentNode && dashboardTopbarActions.parentNode !== dashboardActionsPlaceholder.parentNode) {
      dashboardActionsPlaceholder.parentNode.insertBefore(dashboardTopbarActions, dashboardActionsPlaceholder);
      dashboardActionsSlot.remove();
    }
  };

  syncDashboardActionsPlacement();
  if (dashboardActionsMedia.addEventListener) {
    dashboardActionsMedia.addEventListener("change", syncDashboardActionsPlacement);
  } else {
    dashboardActionsMedia.addListener(syncDashboardActionsPlacement);
  }
}

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
      toggle.textContent = "RTL";
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
      toggle.innerHTML = ccIcon("moon");
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
    const cards = Array.from(planCards.querySelectorAll(".plan-card"));
    const visibleCount = window.matchMedia("(min-width: 1101px)").matches ? 3 : 1;
    const currentIndex = cards.reduce((closestIndex, card, index) => {
      const currentDistance = Math.abs(card.offsetLeft - planCards.scrollLeft);
      const closestDistance = Math.abs(cards[closestIndex].offsetLeft - planCards.scrollLeft);
      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);
    const maxStartIndex = Math.max(0, cards.length - visibleCount);
    const nextIndex = Math.min(
      maxStartIndex,
      Math.max(0, currentIndex + direction * visibleCount)
    );

    planCards.scrollTo({
      left: cards[nextIndex] ? cards[nextIndex].offsetLeft : 0,
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

/*====================================
    NOTIFICATION POPUP
====================================*/

const notificationBtn = document.getElementById("notificationBtn");
const notificationPopup = document.getElementById("notificationPopup");
const markReadBtn = document.querySelector(".mark-read-btn");
const badge = document.querySelector(".notification-badge");

if (notificationBtn && notificationPopup) {

  // Open / Close popup
  notificationBtn.addEventListener("click", function (e) {

    e.stopPropagation();

    notificationPopup.classList.toggle("active");

  });

  // Close when clicking outside
  document.addEventListener("click", function () {

    notificationPopup.classList.remove("active");

  });

  // Prevent popup from closing when clicked inside
  notificationPopup.addEventListener("click", function (e) {

    e.stopPropagation();

  });

}

/* Mark all as read */

if (markReadBtn) {

  markReadBtn.addEventListener("click", function () {

    document.querySelectorAll(".notification-item.unread").forEach(item => {

      item.classList.remove("unread");

    });

    if (badge) {

      badge.textContent = "0";
      badge.style.display = "none";

    }

  });

}

/* Click notification */

document.querySelectorAll(".notification-item").forEach(item => {

  item.addEventListener("click", function () {

    this.classList.remove("unread");

    const unread = document.querySelectorAll(".notification-item.unread").length;

    if (badge) {

      if (unread > 0) {

        badge.textContent = unread;

      } else {

        badge.style.display = "none";

      }

    }

  });

});

function openLogoutModal() {

  document.getElementById("logoutModal").classList.add("active");

}

function closeLogoutModal() {

  document.getElementById("logoutModal").classList.remove("active");

}

function logoutNow() {

  window.location.href = "login.html";

}