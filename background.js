import OBR from "https://esm.sh/@owlbear-rodeo/sdk@3.0.0";

const CHANNEL = "duality.dice/roll";

OBR.onReady(() => {
  OBR.broadcast.onMessage(CHANNEL, (event) => {
    const r = event.data;
    if (!r || !r.id) return;

    const modText = r.modText ? ` ${r.modText}` : "";
    OBR.notification.show(
      `${r.playerName}: ${r.total} (${r.label}) [Hope ${r.hope} | Fear ${r.fear}${modText}]`
    );
  });
});
