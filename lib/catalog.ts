export type Product = {
  id: string
  name: string
  brand: string
  price: number
  oldPrice?: number
  shortDescription: string
  description: string
  specs: string[]
  images: string[]
  recommended?: boolean
  discount?: boolean
}

export const catalogProducts: Product[] = [
  {
    id: "hikvision-colorvu-kit",
    name: "Kit Hikvision ColorVu 4MP",
    brand: "Hikvision",
    price: 559,
    oldPrice: 629,
    shortDescription: "4 camere full-color, NVR 1TB, vedere nocturna color.",
    description:
      "Kit complet pentru locuinte si birouri mici. Include configurare mobila si detectie inteligenta miscarii.",
    specs: [
      "Rezolutie 4MP",
      "Stocare NVR 1TB",
      "Compresie H.265+",
      "Aplicatie iOS/Android",
    ],
    images: [
      "/images/hero-cctv.jpg",
      "/images/about-cctv.jpg",
      "/images/hero-cctv.jpg",
    ],
    recommended: true,
    discount: true,
  },
  {
    id: "dahua-ai-dome",
    name: "Dahua AI Dome 5MP",
    brand: "Dahua",
    price: 189,
    shortDescription: "Camera dome cu AI pentru recunoastere persoane/vehicule.",
    description:
      "Camera profesionala pentru spatii comerciale. Filtrare alarme false si analiza inteligenta in timp real.",
    specs: [
      "Rezolutie 5MP",
      "Analiza AI pe device",
      "IP67 + IK10",
      "Audio bidirectional",
    ],
    images: [
      "/images/about-cctv.jpg",
      "/images/hero-cctv.jpg",
      "/images/about-cctv.jpg",
    ],
    recommended: true,
  },
  {
    id: "uniview-ptz-zoom",
    name: "Uniview PTZ 25x",
    brand: "Uniview",
    price: 749,
    shortDescription: "Camera PTZ cu zoom optic pentru curti mari si hale.",
    description:
      "Model premium pentru monitorizare la distanta mare, cu preseturi si urmarire automata.",
    specs: [
      "Zoom optic 25x",
      "Auto-tracking",
      "WDR 120dB",
      "PoE+",
    ],
    images: [
      "/images/hero-cctv.jpg",
      "/images/about-cctv.jpg",
      "/images/hero-cctv.jpg",
    ],
    discount: true,
  },
  {
    id: "ezviz-wireless-home",
    name: "EZVIZ Wireless Home 2K",
    brand: "EZVIZ",
    price: 109,
    shortDescription: "Camera wireless compacta pentru interior.",
    description:
      "Optiune accesibila pentru apartamente, cu notificari instant si stocare cloud optionala.",
    specs: [
      "Rezolutie 2K",
      "Wi-Fi dual-band",
      "Microfon + difuzor",
      "Night vision IR",
    ],
    images: [
      "/images/about-cctv.jpg",
      "/images/hero-cctv.jpg",
      "/images/about-cctv.jpg",
    ],
    recommended: true,
  },
]

export const recommendedProducts = catalogProducts.filter((product) => product.recommended)
