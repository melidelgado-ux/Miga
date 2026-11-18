export const RECIPE_CATEGORIES = [
  'Desayunos',
  'Meriendas',
  'Entradas',
  'Picadas',
  'Ensaladas',
  'Sopas y cremas',
  'Pastas',
  'Carnes',
  'Pollo',
  'Pescados y mariscos',
  'Tartas y empanadas',
  'Pizzas',
  'Arroces y risottos',
  'Guisos y cazuelas',
  'Guarniciones',
  'Sándwiches y hamburguesas',
  'Panes y masas',
  'Tortas y budines',
  'Galletitas y cookies',
  'Postres',
  'Dulces y mermeladas',
  'Salsas y aderezos',
  'Bebidas',
  'Conservas',
  'Otros',
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export type RecipeDifficulty = 'Fácil' | 'Moderado' | 'Difícil';

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  note?: string;
}

export interface RecipeStep {
  id: string;
  title?: string;
  instruction: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepMinutes: number;
  servings: number;
  difficulty: RecipeDifficulty;
  category: RecipeCategory | 'Sin categoría';
  author?: string;
  featured?: boolean;
  migaTip?: string;
  imageUrl?: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  origin: 'own' | 'received';
  senderName?: string;
  invitationId?: string;
  isExample: boolean;
  collectionId?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  pastelBg: '#FFD6C9' | '#E8D4F8' | '#D4F8E8' | '#FFF8D6';
  isExample: boolean;
}

function daysAgoIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-dulces',
    name: 'Meriendas y dulces',
    description: 'Tortas húmedas, galletitas y cosas ricas para el mate o café.',
    pastelBg: '#FFD6C9',
    isExample: true,
  },
  {
    id: 'col-familia',
    name: 'Recetas de la familia',
    description: 'Platos caseros que nos pasamos entre sobremesas y mensajes.',
    pastelBg: '#E8D4F8',
    isExample: true,
  },
  {
    id: 'col-rapidas',
    name: 'Resuelve cenas',
    description: 'Preparaciones simples de todos los días en menos de 35 minutos.',
    pastelBg: '#D4F8E8',
    isExample: true,
  },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'ex-added-1',
    title: 'Tarta húmeda de manzana y canela',
    description:
      'Masa tierna con láminas finas de manzana verde y azúcar mascabo. Ideal para compartir en la merienda.',
    prepMinutes: 45,
    servings: 6,
    difficulty: 'Fácil',
    category: 'Tortas y budines',
    author: 'Vos (Sofía M.)',
    featured: true,
    migaTip:
      'Si pincelás la base con un poquito de mermelada de damasco antes de hornear, queda más húmeda y brillante.',
    imageUrl: '/src/assets/images/recipe_tarta_manzana_1795016795583.jpg',
    ingredients: [
      { id: 'i1', name: 'Manzanas verdes en láminas', quantity: '3', unit: 'unid', note: 'Peladas' },
      { id: 'i2', name: 'Harina leudante', quantity: '180', unit: 'g' },
      { id: 'i3', name: 'Azúcar mascabo', quantity: '120', unit: 'g' },
      { id: 'i4', name: 'Huevos', quantity: '2', unit: 'unid', note: 'A temperatura ambiente' },
      { id: 'i5', name: 'Canela molida', quantity: '1', unit: 'cdita' },
    ],
    steps: [
      {
        id: 's1',
        title: 'Batir la base',
        instruction:
          'Batir los huevos con el azúcar mascabo y ralladura de limón hasta lograr una mezcla espumosa y pareja.',
      },
      {
        id: 's2',
        title: 'Integrar los secos',
        instruction:
          'Sumar la harina leudante tamizada junto con la canela con movimientos envolventes suaves.',
      },
      {
        id: 's3',
        title: 'Armar y hornear',
        instruction:
          'Volcar en molde enmantecado, cubrir con las láminas de manzana en abanico y hornear 35 min a 180 °C.',
        tip: 'Comprobá con un palillo en el centro antes de retirar del horno.',
      },
    ],
    origin: 'own',
    isExample: true,
    collectionId: 'col-dulces',
    createdAt: daysAgoIso(2),
  },
  {
    id: 'ex-added-2',
    title: 'Ñoquis de calabaza con salvia',
    description:
      'Dorados apenas en manteca tostada con hojas de salvia fresca crujiente y queso estacionado.',
    prepMinutes: 35,
    servings: 4,
    difficulty: 'Moderado',
    category: 'Pastas',
    author: 'Vos (Sofía M.)',
    featured: false,
    migaTip:
      'Asar la calabaza en lugar de hervirla evita exceso de agua y te permite usar mucha menos harina.',
    imageUrl: '/src/assets/images/recipe_noquis_calabaza_1795016795152.jpg',
    ingredients: [
      { id: 'i6', name: 'Puré de calabaza asada', quantity: '600', unit: 'g', note: 'Bien seco' },
      { id: 'i7', name: 'Harina 0000', quantity: '220', unit: 'g' },
      { id: 'i8', name: 'Yema de huevo', quantity: '1', unit: 'unid' },
      { id: 'i9', name: 'Manteca', quantity: '40', unit: 'g' },
      { id: 'i10', name: 'Hojas de salvia fresca', quantity: '8', unit: 'unid' },
    ],
    steps: [
      {
        id: 's4',
        title: 'Unir la masa',
        instruction:
          'Mezclar el puré tibio con la yema, sal y nuez moscada. Agregar la harina de a poco sin amasar de más.',
      },
      {
        id: 's5',
        title: 'Formar y hervir',
        instruction:
          'Hacer rollitos sobre la mesada enharinada, cortar los ñoquis y hervir en agua con sal hasta que floten.',
      },
      {
        id: 's6',
        title: 'Manteca tostada',
        instruction:
          'Dorar la manteca en sartén con las hojas de salvia y saltear allí los ñoquis 2 minutos antes de servir.',
      },
    ],
    origin: 'own',
    isExample: true,
    collectionId: 'col-familia',
    createdAt: daysAgoIso(14),
  },
  {
    id: 'ex-added-3',
    title: 'Galletitas de avena y cacao',
    description:
      'Bordes crocantes, centro tierno y trozos generosos de chocolate amargo recién salido del horno.',
    prepMinutes: 20,
    servings: 12,
    difficulty: 'Fácil',
    category: 'Galletitas y cookies',
    author: 'Vos (Sofía M.)',
    featured: false,
    imageUrl: '/src/assets/images/recipe_galletas_avena_1795016796010.jpg',
    ingredients: [
      { id: 'i11', name: 'Avena arrollada', quantity: '150', unit: 'g' },
      { id: 'i12', name: 'Harina integral', quantity: '100', unit: 'g' },
      { id: 'i13', name: 'Manteca pomada', quantity: '90', unit: 'g' },
      { id: 'i14', name: 'Chocolate amargo picado', quantity: '100', unit: 'g' },
    ],
    steps: [
      {
        id: 's7',
        title: 'Mezclar húmedos',
        instruction: 'Integrar la manteca pomada con azúcar y un huevo hasta obtener una crema.',
      },
      {
        id: 's8',
        title: 'Sumar avena y chocolate',
        instruction: 'Incorporar la avena, harina integral y los trozos de chocolate amargo.',
      },
      {
        id: 's9',
        title: 'Horneado rápido',
        instruction:
          'Formar bolitas sobre placa con papel manteca y hornear 12 min a 180 °C. Dejar enfriar 5 min en rejilla.',
      },
    ],
    origin: 'own',
    isExample: true,
    collectionId: 'col-dulces',
    createdAt: daysAgoIso(95),
  },
  {
    id: 'ex-received-1',
    title: 'Focaccia de romero y sal marina',
    description:
      'Miga aireada con aceite de oliva suave y romero fresco de la huerta, perfecta para acompañar.',
    prepMinutes: 60,
    servings: 8,
    difficulty: 'Moderado',
    category: 'Panes y masas',
    author: 'Marta',
    featured: true,
    migaTip:
      'No tengas miedo de hacer los hoyuelos bien profundos con aceite de oliva en los dedos antes de llevar al horno.',
    imageUrl: '/src/assets/images/recipe_focaccia_romero_1795016796054.jpg',
    ingredients: [
      { id: 'i15', name: 'Harina 000', quantity: '500', unit: 'g' },
      { id: 'i16', name: 'Agua tibia', quantity: '380', unit: 'ml' },
      { id: 'i17', name: 'Levadura seca', quantity: '7', unit: 'g' },
      { id: 'i18', name: 'Aceite de oliva extra virgen', quantity: '4', unit: 'cda' },
      { id: 'i19', name: 'Romero fresco y sal marina', quantity: '2', unit: 'cda' },
    ],
    steps: [
      {
        id: 's10',
        title: 'Hidratar y reposar',
        instruction:
          'Unir harina, agua, levadura y sal sin amasar en exceso; dejar reposar tapada 40 minutos.',
      },
      {
        id: 's11',
        title: 'Estirar y perfumar',
        instruction:
          'Estirar en fuente aceitada, presionar con las yemas para formar hoyuelos y sumar romero y oliva.',
      },
      {
        id: 's12',
        title: 'Hornear hasta dorar',
        instruction: 'Hornear 25 minutos a 210 °C hasta que los bordes queden bien dorados y crocantes.',
      },
    ],
    origin: 'received',
    senderName: 'Marta',
    isExample: true,
    collectionId: 'col-familia',
    createdAt: daysAgoIso(5),
  },
  {
    id: 'ex-received-2',
    title: 'Sopa crema de zapallo asado',
    description:
      'Textura sedosa con toque de jengibre y semillas tostadas por encima para noches frescas.',
    prepMinutes: 30,
    servings: 4,
    difficulty: 'Fácil',
    category: 'Sopas y cremas',
    author: 'Lucas',
    featured: false,
    imageUrl: '/src/assets/images/recipe_sopa_zapallo_1795016796645.jpg',
    ingredients: [
      { id: 'i20', name: 'Zapallo cabutia en cubos', quantity: '700', unit: 'g' },
      { id: 'i21', name: 'Cebolla dulce', quantity: '1', unit: 'unid' },
      { id: 'i22', name: 'Caldo de verduras casero', quantity: '500', unit: 'ml' },
      { id: 'i23', name: 'Semillas de zapallo tostadas', quantity: '2', unit: 'cda' },
    ],
    steps: [
      {
        id: 's13',
        title: 'Dorar los vegetales',
        instruction:
          'Rehogar o asar el zapallo con la cebolla y un diente de ajo hasta que estén bien tiernos.',
      },
      {
        id: 's14',
        title: 'Procesar con caldo',
        instruction: 'Sumar el caldo caliente y procesar hasta lograr una crema lisa y sedosa.',
      },
      {
        id: 's15',
        title: 'Emplatar',
        instruction: 'Servir bien caliente con un hilo de crema y las semillas tostadas encima.',
      },
    ],
    origin: 'received',
    senderName: 'Lucas',
    isExample: true,
    collectionId: 'col-rapidas',
    createdAt: daysAgoIso(25),
  },
];
