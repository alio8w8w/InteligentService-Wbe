export interface Product {
  id: string
  name: string
  description: string
  price: number
  brand: Brand
  image: string
  category: string
  features: string[]
}

export type Brand = 'dahua-imou' | 'uniview' | 'hikvision' | 'china'

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export const brandInfo: Record<Brand, { name: string; description: string; logo: string }> = {
  'dahua-imou': {
    name: 'Dahua IMOU',
    description: 'IMOU este brandul consumer al Dahua Technology, oferind soluții smart pentru casă și afaceri mici. Calitate superioară și integrare perfectă cu aplicațiile mobile.',
    logo: '/brands/dahua-imou.svg'
  },
  'uniview': {
    name: 'Uniview',
    description: 'Uniview este un lider global în tehnologia video IP, oferind soluții inovatoare și fiabile pentru supraveghere. Recunoscut pentru claritatea imaginii și durabilitate.',
    logo: '/brands/uniview.svg'
  },
  'hikvision': {
    name: 'Hikvision',
    description: 'Hikvision este cel mai mare producător de echipamente de supraveghere din lume. Tehnologie de vârf, AI integrat și fiabilitate dovedită în milioane de instalații.',
    logo: '/brands/hikvision.svg'
  },
  'china': {
    name: 'Budget China',
    description: 'Soluții economice pentru supraveghere de bază. Raport calitate-preț excelent pentru proiecte cu buget limitat, fără a compromite funcționalitatea esențială.',
    logo: '/brands/china.svg'
  }
}

export const products: Product[] = [
  // Dahua IMOU
  {
    id: 'imou-bullet-2c',
    name: 'IMOU Bullet 2C 4MP',
    description: 'Cameră bullet exterior cu vedere nocturnă color, detecție AI și comunicare bidirecțională.',
    price: 450,
    brand: 'dahua-imou',
    image: '/products/imou-bullet.jpg',
    category: 'Exterior',
    features: ['4MP Full HD', 'Vedere nocturnă color', 'Detecție AI', 'IP67 rezistent la apă']
  },
  {
    id: 'imou-cruiser-se',
    name: 'IMOU Cruiser SE 4MP',
    description: 'Cameră PTZ cu rotire 360°, tracking automat și slot pentru card SD.',
    price: 680,
    brand: 'dahua-imou',
    image: '/products/imou-cruiser.jpg',
    category: 'PTZ',
    features: ['Rotire 360°', 'Tracking automat', 'Slot SD 256GB', 'Comunicare bidirecțională']
  },
  {
    id: 'imou-ranger-2',
    name: 'IMOU Ranger 2 4MP',
    description: 'Cameră interior cu privacy mode, detecție persoane și sunet anormal.',
    price: 380,
    brand: 'dahua-imou',
    image: '/products/imou-ranger.jpg',
    category: 'Interior',
    features: ['Privacy mode', 'Detecție persoane', 'Alertă sunet', 'Vedere nocturnă 10m']
  },
  // Uniview
  {
    id: 'uniview-ipc2124lr3',
    name: 'Uniview IPC2124LR3 4MP',
    description: 'Cameră dome profesională cu WDR 120dB și Smart IR până la 30m.',
    price: 520,
    brand: 'uniview',
    image: '/products/uniview-dome.jpg',
    category: 'Interior',
    features: ['4MP Ultra HD', 'WDR 120dB', 'Smart IR 30m', 'PoE integrat']
  },
  {
    id: 'uniview-ipc2322lb',
    name: 'Uniview IPC2322LB 2MP',
    description: 'Cameră bullet compactă cu detecție mișcare inteligentă și rezistență IP67.',
    price: 420,
    brand: 'uniview',
    image: '/products/uniview-bullet.jpg',
    category: 'Exterior',
    features: ['2MP Full HD', 'Detecție inteligentă', 'IP67', 'IR 30m']
  },
  {
    id: 'uniview-nvr301',
    name: 'Uniview NVR301 4CH',
    description: 'Network Video Recorder 4 canale cu suport 4K și HDD până la 6TB.',
    price: 890,
    brand: 'uniview',
    image: '/products/uniview-nvr.jpg',
    category: 'NVR',
    features: ['4 canale', 'Suport 4K', 'HDD 6TB max', 'HDMI + VGA']
  },
  // Hikvision
  {
    id: 'hikvision-ds2cd1043',
    name: 'Hikvision DS-2CD1043G0-I',
    description: 'Cameră bullet 4MP cu tehnologie ColorVu pentru imagini color 24/7.',
    price: 580,
    brand: 'hikvision',
    image: '/products/hikvision-bullet.jpg',
    category: 'Exterior',
    features: ['4MP ColorVu', 'Imagine color 24/7', 'H.265+', 'IP67']
  },
  {
    id: 'hikvision-ds2cd2143',
    name: 'Hikvision DS-2CD2143G2-I',
    description: 'Cameră dome AcuSense cu detecție persoane/vehicule și clasificare AI.',
    price: 750,
    brand: 'hikvision',
    image: '/products/hikvision-dome.jpg',
    category: 'Interior',
    features: ['4MP AcuSense', 'AI clasificare', 'WDR 120dB', 'Audio integrat']
  },
  {
    id: 'hikvision-nvr-7604',
    name: 'Hikvision DS-7604NI-K1',
    description: 'NVR profesional 4 canale cu decodare 4K și bandwidth 40Mbps.',
    price: 1100,
    brand: 'hikvision',
    image: '/products/hikvision-nvr.jpg',
    category: 'NVR',
    features: ['4 canale 4K', '40Mbps bandwidth', 'H.265+', 'HDMI 4K']
  },
  // China Budget
  {
    id: 'china-dome-basic',
    name: 'Dome Camera 2MP Basic',
    description: 'Cameră dome economică pentru supraveghere de bază interior.',
    price: 180,
    brand: 'china',
    image: '/products/china-dome.jpg',
    category: 'Interior',
    features: ['2MP HD', 'IR 20m', 'ONVIF', 'Preț accesibil']
  },
  {
    id: 'china-bullet-outdoor',
    name: 'Bullet Camera 2MP Outdoor',
    description: 'Cameră bullet rezistentă la intemperii pentru exterior.',
    price: 220,
    brand: 'china',
    image: '/products/china-bullet.jpg',
    category: 'Exterior',
    features: ['2MP HD', 'IP66', 'IR 25m', 'Metal housing']
  },
  {
    id: 'china-nvr-4ch',
    name: 'NVR 4CH Economic',
    description: 'Video recorder 4 canale pentru sisteme mici.',
    price: 450,
    brand: 'china',
    image: '/products/china-nvr.jpg',
    category: 'NVR',
    features: ['4 canale', '1080P max', 'ONVIF', 'HDD 4TB max']
  }
]
