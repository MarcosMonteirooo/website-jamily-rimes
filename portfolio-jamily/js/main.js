// Portfólio Jamily Rimes — navegação por abas
(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var tabsBar = document.getElementById("tabs");

  function showTab(id, updateHash) {
    var found = false;

    tabs.forEach(function (tab) {
      var active = tab.getAttribute("data-target") === id;
      if (active) found = true;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.setAttribute("tabindex", active ? "0" : "-1");
      if (active && tabsBar.scrollWidth > tabsBar.clientWidth) {
        // mantém a aba ativa visível na barra rolável do celular
        tab.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      }
    });

    if (!found) return;

    panels.forEach(function (panel) {
      var active = panel.id === id;
      panel.classList.toggle("is-active", active);
      if (active) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });

    if (updateHash) {
      try { history.replaceState(null, "", "#" + id); } catch (e) { /* ignora */ }
    }

    // No celular, volta para o início do conteúdo ao trocar de aba
    if (window.matchMedia("(max-width: 900px)").matches) {
      var content = document.querySelector(".content");
      if (content) {
        var top = content.getBoundingClientRect().top + window.pageYOffset - tabsBar.offsetHeight;
        window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
      }
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      showTab(tab.getAttribute("data-target"), true);
    });

    // Navegação por teclado (setas)
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(index + 1) % tabs.length];
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (next) {
        e.preventDefault();
        next.focus();
        showTab(next.getAttribute("data-target"), true);
      }
    });
  });

  // Botões internos (ex.: "Ver experiência")
  Array.prototype.forEach.call(document.querySelectorAll("[data-goto]"), function (btn) {
    btn.addEventListener("click", function () {
      showTab(btn.getAttribute("data-goto"), true);
    });
  });

  // Abre a aba indicada no endereço (#experiencia, #contato...)
  var initial = (location.hash || "").replace("#", "");
  showTab(initial || "sobre", false);

  window.addEventListener("hashchange", function () {
    var id = (location.hash || "").replace("#", "");
    if (id) showTab(id, false);
  });

  // Ano do rodapé
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
