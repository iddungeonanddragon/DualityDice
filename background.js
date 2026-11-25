import OBR from "https://esm.sh/@owlbear-rodeo/sdk@3.0.0";

const CHANNEL = "duality.dice/roll";

function escapeHtml(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getOutcomeStyle(type) {
  if (type === "crit") {
    return { color: "#34d399", variant: "SUCCESS" };
  }
  if (type === "fear") {
    return { color: "#c084fc", variant: "WARNING" };
  }
  return { color: "#fbbf24", variant: "INFO" };
}

OBR.onReady(() => {
  OBR.broadcast.onMessage(CHANNEL, (event) => {
    const r = event.data;
    if (!r || !r.id) return;

    const { color, variant } = getOutcomeStyle(r.type);
    const modPart = r.modText ? ` ${r.modText}` : "";
    const plainText = `${r.playerName}: ${r.total} [Hope ${r.hope} | Fear ${r.fear}${modPart}] (${r.label})`;

    const coloredMessage = `
      <span style="color:${color}; font-weight:700;">
        ${escapeHtml(r.playerName)}: ${escapeHtml(r.total)}
        [Hope ${escapeHtml(r.hope)} | Fear ${escapeHtml(r.fear)}${escapeHtml(modPart)}]
        (${escapeHtml(r.label)})
      </span>
    `.trim();

    const showPromise = OBR.notification.show(coloredMessage, variant, {
      placement: "BOTTOM-CENTER"
    });

    if (showPromise && typeof showPromise.catch === "function") {
      showPromise.catch(() => {
        OBR.notification.show(plainText, variant);
      });
    }
  });
});
