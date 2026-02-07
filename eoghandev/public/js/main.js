document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("scheme-toggle");
  var container = document.documentElement;

  if (toggle) {
    var scheme = "light";
    var savedScheme = localStorage.getItem("scheme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDark) {
      scheme = "dark";
    }

    if (savedScheme) {
      scheme = savedScheme;
    }

    if (scheme === "dark") {
      darkscheme(toggle, container);
    } else {
      lightscheme(toggle, container);
    }

    toggle.addEventListener("click", function () {
      if (toggle.className === "light") {
        darkscheme(toggle, container);
      } else if (toggle.className === "dark") {
        lightscheme(toggle, container);
      }
    });
  }

  var copyButton = document.getElementById("copy-email-btn");
  var copyStatus = document.getElementById("copy-email-status");
  if (!copyButton) {
    return;
  }

  copyButton.addEventListener("click", function () {
    var email = copyButton.getAttribute("data-email");
    if (!email) {
      return;
    }

    copyText(email)
      .then(function () {
        setCopyStatus(copyStatus, "Copied: " + email);
      })
      .catch(function () {
        setCopyStatus(copyStatus, "Could not copy automatically. Use eoghan@eoghan.dev.");
      });
  });
});

function darkscheme(toggle, container) {
  localStorage.setItem("scheme", "dark");
  toggle.innerHTML = feather.icons.sun.toSvg();
  toggle.className = "dark";
  container.className = "dark";
}

function lightscheme(toggle, container) {
  localStorage.setItem("scheme", "light");
  toggle.innerHTML = feather.icons.moon.toSvg();
  toggle.className = "light";
  container.className = "";
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise(function (resolve, reject) {
    try {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      var success = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (success) {
        resolve();
      } else {
        reject(new Error("copy failed"));
      }
    } catch (err) {
      reject(err);
    }
  });
}

function setCopyStatus(el, message) {
  if (!el) {
    return;
  }
  el.textContent = message;
}
