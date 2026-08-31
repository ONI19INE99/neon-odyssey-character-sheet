// 1. Registrar habilidades cyberpunk al iniciar el sistema
Hooks.once("init", () => {
  CONFIG.DND5E.skills["com"] = { label: "Computers", ability: "int" };
  CONFIG.DND5E.skills["tec"] = { label: "Tecnología", ability: "int" };
  console.log("Neon Odyssey | Habilidades cyberpunk añadidas con éxito.");
});

// 2. Definir y registrar la hoja de personaje en el sistema
Hooks.once("ready", () => {
  const dndSheetClass = dnd5e.applications.actor.ActorSheet5eCharacter;
  if (!dndSheetClass) {
    console.error("Neon Odyssey | No se pudo localizar la clase base de dnd5e.");
    return;
  }

  class NeonOdysseySheet extends dndSheetClass {
    constructor(...args) {
      super(...args);
      this.currentNeonPage = 1; // Página por defecto al abrir
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["dnd5e", "sheet", "actor", "character", "neon-odyssey"],
        width: 800,
        height: 1130,
        resizable: false
      });
    }

    // Cargar la plantilla HTML correspondiente a la página activa
    get template() {
      return `modules/neon-odyssey-character-sheet/templates/sheet-page${this.currentNeonPage}.html`;
    }

    activateListeners(html) {
      super.activateListeners(html);

      // Buscar de forma segura la cabecera en Foundry v14 (.window-app)
      const windowHeader = html.closest('.window-app').find('.window-header');
      if (!windowHeader.length) return;

      const windowTitle = windowHeader.find('.window-title');

      // Inyectar botón de PDF (con comillas corregidas en el selector jQuery)
      if (windowHeader.find(".open-pdf").length === 0) {
        const pdfButton = $('<button type="button" class="open-pdf" style="margin-left: 10px; line-height: 16px; padding: 2px 6px;"><i class="fas fa-file-pdf"></i> PDF</button>');
        pdfButton.click(ev => {
          ev.preventDefault();
          window.open("modules/neon-odyssey-character-sheet/Neon_Odyssey_Character_Sheet_v0.1_-_Form_Fillable.pdf");
        });
        windowTitle.after(pdfButton);
      }

      // Inyectar selector de páginas de la hoja (con comillas corregidas en jQuery)
      if (windowHeader.find(".page-selector").length === 0) {
        const pageSelector = $(`
          <div class="page-selector" style="margin-left: 10px; display: inline-flex; gap: 5px;">
            <button type="button" data-page="1" style="line-height: 16px; padding: 2px 6px;">Pág 1</button>
            <button type="button" data-page="2" style="line-height: 16px; padding: 2px 6px;">Pág 2</button>
            <button type="button" data-page="3" style="line-height: 16px; padding: 2px 6px;">Pág 3</button>
          </div>
        `);

        // Resaltar la página activa
        pageSelector.find(`[data-page="${this.currentNeonPage}"]`).css({
          "background-color": "#00ffcc",
          "color": "#000",
          "box-shadow": "0 0 5px #00ffcc",
          "font-weight": "bold"
        });

        pageSelector.find("button").click(ev => {
          ev.preventDefault();
          this.currentNeonPage = parseInt($(ev.currentTarget).data("page"));
          this.render(true); // Redibujar la ficha con la plantilla elegida
        });

        windowHeader.append(pageSelector);
      }
    }
  }

  // REGISTRAR LA HOJA OFICIALMENTE EN EL SISTEMA DND5E
  Actors.registerSheet("dnd5e", NeonOdysseySheet, {
    types: ["character"],
    makeDefault: false,
    label: "Neon Odyssey Character Sheet"
  });

  console.log("Neon Odyssey | Hoja registrada con éxito.");
});
