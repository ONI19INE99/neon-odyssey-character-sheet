// 1. Registrar habilidades cyberpunk personalizadas al iniciar dnd5e
Hooks.once("init", () => {
  CONFIG.DND5E.skills["com"] = { label: "Computers", ability: "int" };
  CONFIG.DND5E.skills["tec"] = { label: "Tecnología", ability: "int" };
  console.log("Neon Odyssey | Habilidades cyberpunk añadidas e inicializado con éxito.");
});

// 2. Definir y registrar la hoja de personaje Neon Odyssey al estar listos
Hooks.once("ready", () => {
  // Obtener la clase de la hoja clásica de dnd5e para asegurar la compatibilidad con tus HTMLs
  const dnd5eSheetClass = dnd5e.applications.actor.ActorSheet5eCharacter;

  if (!dnd5eSheetClass) {
    console.error("Neon Odyssey | No se pudo encontrar la clase de hoja base de dnd5e.");
    return;
  }

  class NeonOdysseySheet extends dnd5eSheetClass {
    constructor(...args) {
      super(...args);
      this.currentNeonPage = 1; // Página inicial de la ficha
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["dnd5e", "sheet", "actor", "character", "neon-odyssey"],
        width: 800,
        height: 1130,
        resizable: false
      });
    }

    // Devolver dinámicamente tu plantilla HTML según la página activa
    get template() {
      return `modules/neon-odyssey-character-sheet/templates/sheet-page${this.currentNeonPage}.html`;
    }

    activateListeners(html) {
      super.activateListeners(html);

      // Encontrar de forma segura la cabecera en Foundry v14 (.window-app)
      const windowHeader = html.closest('.window-app').find('.window-header');
      if (!windowHeader.length) return;

      const windowTitle = windowHeader.find('.window-title');

      // 1. Inyectar botón para abrir tu PDF interactivo oficial (evitando duplicados)
      if (windowHeader.find(".open-pdf").length === 0) {
        const pdfButton = $('<button type="button" class="open-pdf" style="margin-left: 10px; line-height: 16px; padding: 2px 6px;"><i class="fas fa-file-pdf"></i> PDF</button>');
        pdfButton.click(ev => {
          ev.preventDefault();
          window.open("modules/neon-odyssey-character-sheet/Neon_Odyssey_Character_Sheet_v0.1_-_Form_Fillable.pdf");
        });
        windowTitle.after(pdfButton);
      }

      // 2. Inyectar selector de páginas cyberpunk (evitando duplicados)
      if (windowHeader.find(".page-selector").length === 0) {
        const pageSelector = $(`
          <div class="page-selector" style="margin-left: 10px; display: inline-flex; gap: 5px;">
            <button type="button" data-page="1" style="line-height: 16px; padding: 2px 6px;">Pág 1</button>
            <button type="button" data-page="2" style="line-height: 16px; padding: 2px 6px;">Pág 2</button>
            <button type="button" data-page="3" style="line-height: 16px; padding: 2px 6px;">Pág 3</button>
          </div>
        `);

        // Resaltar visualmente la pestaña en la que se encuentra el jugador
        pageSelector.find(`[data-page="${this.currentNeonPage}"]`).css({
          "background-color": "#00ffcc",
          "color": "#000",
          "box-shadow": "0 0 5px #00ffcc",
          "font-weight": "bold"
        });

        pageSelector.find("button").click(ev => {
          ev.preventDefault();
          this.currentNeonPage = parseInt($(ev.currentTarget).data("page"));
          this.render(true); // Volver a dibujar la ficha cargando la plantilla de la nueva página
        });

        windowHeader.append(pageSelector);
      }
    }
  }

  // Registrar la hoja en el sistema dnd5e de Foundry VTT
  Actors.registerSheet("dnd5e", NeonOdysseySheet, {
    types: ["character"],
    makeDefault: false,
    label: "Neon Odyssey Character Sheet"
  });

  console.log("Neon Odyssey | Hoja de personaje registrada en el núcleo correctamente.");
});
