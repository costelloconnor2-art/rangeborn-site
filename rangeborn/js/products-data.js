/* ============================================================
   RANGEBORN — Product Catalog
   Single source of truth for shop.html, product.html, index.html
   ============================================================ */

const COLLECTIONS = [
  {
    slug: "western-heritage",
    name: "Western Heritage",
    line: "01",
    blurb: "Where the brand began. Heavy suede, raw cotton, hand‑finished hardware — built from the materials that built the West.",
    theme: "heritage"
  },
  {
    slug: "long-ride-club",
    name: "Long Ride Club",
    line: "02",
    blurb: "Minimal western, made for distance. Quiet logos, soft jersey, road‑trip proof construction.",
    theme: "longride"
  },
  {
    slug: "outlaw-country",
    name: "Outlaw Country",
    line: "03",
    blurb: "Vintage typography, distressed prints, oversized fits. For the ones who ride a little outside the lines.",
    theme: "outlaw"
  },
  {
    slug: "midnight-range",
    name: "Midnight Range",
    line: "04",
    blurb: "Western after dark. Black‑on‑black hardware, premium streetwear silhouettes, moonlit detailing.",
    theme: "midnight"
  }
];

const PRODUCTS = [
  // ---------- WESTERN HERITAGE ----------
  {
    id: "wh-001",
    name: "Heritage Flannel Shirt",
    gender: "mens",
    category: "Flannel Shirts",
    categorySlug: "mens-flannel",
    collection: "western-heritage",
    price: 95,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Rust Plaid", "Sage Plaid"],
    badge: "Bestseller",
    description: "Brushed heavyweight cotton flannel with horn buttons and a hand‑finished yoke. Cut generous through the shoulder for layering.",
    theme: "heritage"
  },
  {
    id: "wh-002",
    name: "Heritage Crop Tee",
    gender: "womens",
    category: "Crop Tees",
    categorySlug: "womens-crop-tees",
    collection: "western-heritage",
    price: 42,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Sand", "Cream"],
    badge: null,
    description: "Heavyweight cropped tee in brushed cotton with a faded heritage crest print across the chest.",
    theme: "heritage"
  },
  {
    id: "wh-003",
    name: "Heritage Suede Jacket",
    gender: "mens",
    category: "Jackets",
    categorySlug: "mens-jackets",
    collection: "western-heritage",
    price: 245,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Leather Brown"],
    badge: "New",
    description: "Full‑grain suede western jacket with point yoke detailing and brushed gold hardware. Lined for three‑season wear.",
    theme: "heritage"
  },
  {
    id: "wh-004",
    name: "Heritage Western Hat",
    gender: "womens",
    category: "Hats",
    categorySlug: "womens-hats",
    collection: "western-heritage",
    price: 165,
    sizes: ["S/M", "M/L"],
    colors: ["Sand Felt"],
    badge: null,
    description: "Wool felt wide‑brim with a hand‑stitched leather band and gold pin detail. Shape‑retaining buckram core.",
    theme: "heritage"
  },
  {
    id: "wh-005",
    name: "Heritage Embroidered Cap",
    gender: "mens",
    category: "Caps",
    categorySlug: "mens-caps",
    collection: "western-heritage",
    price: 48,
    sizes: ["One Size"],
    colors: ["Leather Brown", "Black"],
    badge: null,
    description: "Structured six‑panel cap with a raised gold‑thread crest and a leather strap‑back closure.",
    theme: "heritage"
  },
  {
    id: "wh-006",
    name: "Heritage Concho Belt",
    gender: "womens",
    category: "Country Fashion Accessories",
    categorySlug: "womens-accessories",
    collection: "western-heritage",
    price: 85,
    sizes: ["S", "M", "L"],
    colors: ["Brown / Gold"],
    badge: null,
    description: "Full‑grain leather belt finished with hand‑set gold conchos and a brushed buckle.",
    theme: "heritage"
  },

  // ---------- LONG RIDE CLUB ----------
  {
    id: "lrc-001",
    name: "Long Ride Club Tee",
    gender: "mens",
    category: "Graphic T-Shirts",
    categorySlug: "mens-tees",
    collection: "long-ride-club",
    price: 45,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Sand"],
    badge: "Bestseller",
    description: "Luxury minimalist western graphic in a fine gold line print. Heavyweight 240gsm combed cotton.",
    theme: "longride"
  },
  {
    id: "lrc-002",
    name: "Long Ride Club Tee — Women's",
    gender: "womens",
    category: "Graphic T-Shirts",
    categorySlug: "womens-tees",
    collection: "long-ride-club",
    price: 45,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Cream"],
    badge: null,
    description: "Fitted version of the Long Ride Club graphic tee, finished with the same fine gold line print.",
    theme: "longride"
  },
  {
    id: "lrc-003",
    name: "Long Ride Club Hoodie",
    gender: "mens",
    category: "Hoodies",
    categorySlug: "mens-hoodies",
    collection: "long-ride-club",
    price: 110,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Leather Brown"],
    badge: null,
    description: "Heavyweight fleece hoodie with a tonal chest embroidery and reinforced kangaroo pocket.",
    theme: "longride"
  },
  {
    id: "lrc-004",
    name: "Long Ride Club Oversized Hoodie",
    gender: "womens",
    category: "Oversized Hoodies",
    categorySlug: "womens-hoodies",
    collection: "long-ride-club",
    price: 115,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Cream", "Black"],
    badge: "New",
    description: "Drop‑shoulder oversized hoodie in brushed fleece with minimal gold embroidery at the cuff.",
    theme: "longride"
  },
  {
    id: "lrc-005",
    name: "Long Ride Club Trucker Cap",
    gender: "mens",
    category: "Caps",
    categorySlug: "mens-caps",
    collection: "long-ride-club",
    price: 42,
    sizes: ["One Size"],
    colors: ["Sand / Leather"],
    badge: null,
    description: "Premium five‑panel trucker with a structured front, mesh back, and debossed leather patch.",
    theme: "longride"
  },
  {
    id: "lrc-006",
    name: "Long Ride Club Patch Cap",
    gender: "womens",
    category: "Hats",
    categorySlug: "womens-hats",
    collection: "long-ride-club",
    price: 55,
    sizes: ["One Size"],
    colors: ["Black / Gold"],
    badge: null,
    description: "Low‑profile dad cap finished with a minimal gold line logo patch.",
    theme: "longride"
  },

  // ---------- OUTLAW COUNTRY ----------
  {
    id: "oc-001",
    name: "Outlaw Country Tee",
    gender: "mens",
    category: "Graphic T-Shirts",
    categorySlug: "mens-tees",
    collection: "outlaw-country",
    price: 52,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Washed Black"],
    badge: "Bestseller",
    description: "Oversized fit tee with a distressed vintage western back print, garment‑washed for a worn‑in feel.",
    theme: "outlaw"
  },
  {
    id: "oc-002",
    name: "Outlaw Country Tee — Women's",
    gender: "womens",
    category: "Graphic T-Shirts",
    categorySlug: "womens-tees",
    collection: "outlaw-country",
    price: 48,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Washed Black", "Washed Sand"],
    badge: null,
    description: "Relaxed fit tee carrying the distressed Outlaw Country typography across an oversized back print.",
    theme: "outlaw"
  },
  {
    id: "oc-003",
    name: "Outlaw Country Denim Jacket",
    gender: "mens",
    category: "Jackets",
    categorySlug: "mens-jackets",
    collection: "outlaw-country",
    price: 225,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Raw Indigo"],
    badge: null,
    description: "Rigid selvedge denim trucker jacket with antique brass hardware and an embroidered back yoke.",
    theme: "outlaw"
  },
  {
    id: "oc-004",
    name: "Outlaw Country Cowboy Hat",
    gender: "mens",
    category: "Cowboy Hats",
    categorySlug: "mens-cowboy-hats",
    collection: "outlaw-country",
    price: 185,
    sizes: ["S/M", "M/L", "L/XL"],
    colors: ["Black Felt"],
    badge: "New",
    description: "Wool felt cowboy hat with a wide brim, leather binding, and a hand‑tooled gold concho band.",
    theme: "outlaw"
  },
  {
    id: "oc-005",
    name: "Outlaw Country Fringe Jacket",
    gender: "womens",
    category: "Jackets",
    categorySlug: "womens-jackets",
    collection: "outlaw-country",
    price: 235,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Leather Brown"],
    badge: null,
    description: "Suede jacket with hand‑cut fringe detailing along the yoke and sleeve, fully lined.",
    theme: "outlaw"
  },
  {
    id: "oc-006",
    name: "Outlaw Country Bandana Scarf",
    gender: "womens",
    category: "Country Fashion Accessories",
    categorySlug: "womens-accessories",
    collection: "outlaw-country",
    price: 38,
    sizes: ["One Size"],
    colors: ["Rust Paisley"],
    badge: null,
    description: "Silk‑cotton blend bandana with a hand‑drawn paisley print, finished raw at the edge.",
    theme: "outlaw"
  },

  // ---------- MIDNIGHT RANGE ----------
  {
    id: "mr-001",
    name: "Midnight Range Tee",
    gender: "mens",
    category: "Graphic T-Shirts",
    categorySlug: "mens-tees",
    collection: "midnight-range",
    price: 48,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    badge: null,
    description: "Premium streetwear tee in black‑on‑black with a tonal puff‑print western emblem.",
    theme: "midnight"
  },
  {
    id: "mr-002",
    name: "Midnight Range Hoodie",
    gender: "mens",
    category: "Hoodies",
    categorySlug: "mens-hoodies",
    collection: "midnight-range",
    price: 120,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    badge: "Bestseller",
    description: "Heavyweight fleece hoodie with matte black hardware and a moonlit range graphic across the back.",
    theme: "midnight"
  },
  {
    id: "mr-003",
    name: "Midnight Range Oversized Hoodie",
    gender: "womens",
    category: "Oversized Hoodies",
    categorySlug: "womens-hoodies",
    collection: "midnight-range",
    price: 125,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    badge: null,
    description: "Oversized drop‑shoulder hoodie in brushed black fleece with a subtle tonal back graphic.",
    theme: "midnight"
  },
  {
    id: "mr-004",
    name: "Midnight Range Cowboy Hat",
    gender: "womens",
    category: "Hats",
    categorySlug: "womens-hats",
    collection: "midnight-range",
    price: 175,
    sizes: ["S/M", "M/L"],
    colors: ["Black Felt"],
    badge: "New",
    description: "Black wool felt cowboy hat with a low crown and a matte gunmetal band.",
    theme: "midnight"
  },
  {
    id: "mr-005",
    name: "Western Nights Crop Tee",
    gender: "womens",
    category: "Crop Tees",
    categorySlug: "womens-crop-tees",
    collection: "midnight-range",
    price: 45,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    badge: null,
    description: "Cropped tee with a desert‑moonlight graphic rendered in fine metallic gold ink.",
    theme: "midnight"
  },
  {
    id: "mr-006",
    name: "Western Nights Cap",
    gender: "mens",
    category: "Caps",
    categorySlug: "mens-caps",
    collection: "midnight-range",
    price: 45,
    sizes: ["One Size"],
    colors: ["Black / Gold"],
    badge: null,
    description: "Structured cap in washed black twill with a fine gold‑thread moon‑and‑range emblem.",
    theme: "midnight"
  },
  {
    id: "mr-007",
    name: "Midnight Range Moto Jacket",
    gender: "womens",
    category: "Jackets",
    categorySlug: "womens-jackets",
    collection: "midnight-range",
    price: 195,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    badge: null,
    description: "Western‑cut moto jacket in waxed cotton with matte black snaps and a fitted silhouette.",
    theme: "midnight"
  }
];

// Helper: collection lookup
function getCollection(slug) {
  return COLLECTIONS.find(c => c.slug === slug);
}

// Helper: get related products (same collection, different id)
function getRelated(product, count = 4) {
  return PRODUCTS.filter(p => p.collection === product.collection && p.id !== product.id).slice(0, count);
}
