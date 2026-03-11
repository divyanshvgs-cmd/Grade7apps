(function () {
  function speak(text) {
    if (!text) {
      return;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(text);
    }
  }

  function showScreen(app, screenName) {
    var panels = app.querySelectorAll(".screen-panel");
    var activePanel = null;
    panels.forEach(function (panel) {
      var matches = panel.getAttribute("data-screen") === screenName;
      panel.hidden = !matches;
      panel.style.display = matches ? "flex" : "none";
      if (matches) {
        activePanel = panel;
      }
    });
    if (activePanel) {
      activePanel.scrollTop = 0;
    }
  }

  function initApp(app) {
    var initial = app.getAttribute("data-initial-screen");
    var params = new URLSearchParams(window.location.search);
    var requested = params.get("screen");
    var hash = window.location.hash ? window.location.hash.slice(1) : "";
    var target = requested || hash || initial;
    if (target) {
      showScreen(app, target);
    }

    app.querySelectorAll("button").forEach(function (button) {
      button.type = "button";
    });

    app.addEventListener("click", function (event) {
      var targetButton = event.target.closest("[data-speak],[data-go]");
      if (!targetButton || !app.contains(targetButton)) {
        return;
      }
      if (targetButton.hasAttribute("data-speak")) {
        speak(targetButton.getAttribute("data-speak"));
      }
      if (targetButton.hasAttribute("data-go")) {
        showScreen(app, targetButton.getAttribute("data-go"));
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-app]").forEach(initApp);
  });

  window.AppSim = {
    speak: speak,
    showScreen: showScreen
  };
})();
