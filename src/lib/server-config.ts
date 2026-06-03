// Edit these to customize your server.
export const SERVER_CONFIG = {
  serverName: "PokéCraft Realm",
  tagline: "Server Minecraft bertema Pokémon",
  ip: "play.pokecraft.example",
  adminWhatsApp: "6281234567890", // ganti dengan nomor WA admin (format internasional tanpa +)
  adminWhatsAppDisplay: "+62 812-3456-7890",
  whatsappTemplate: "Halo Admin, saya sudah mengisi formulir pendaftaran server Minecraft.",
  socials: {
    discord: "https://discord.gg/your-invite",
    instagram: "https://instagram.com/your-server",
    youtube: "https://youtube.com/@your-server",
  },
};

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
