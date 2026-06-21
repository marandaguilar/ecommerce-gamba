import { MessageCircle } from "lucide-react";

import { buildGeneralWhatsappUrl } from "@/lib/whatsapp";

/**
 * Botón flotante de WhatsApp, siempre visible, para reforzar el canal de
 * conversión oficial (Spec §4.4, RF-16).
 */
const WhatsappFab = () => {
  return (
    <a
      href={buildGeneralWhatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle className="size-7" />
    </a>
  );
};

export default WhatsappFab;
