import {
  Timestamp,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import type { Firestore, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type {
  Collection as MigaCollection,
  Recipe,
  RecipeIngredient,
  RecipeStep,
} from './mockRecipes';

const INVITE_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

function requireDb(): Firestore {
  if (!db) throw new Error('Firebase todavía no está configurado.');
  return db;
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) return value;
  return new Date().toISOString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseIngredients(value: unknown): RecipeIngredient[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((item, index) => ({
    id: stringValue(item.id, `ingredient-${index + 1}`),
    name: stringValue(item.name),
    quantity: stringValue(item.quantity),
    unit: stringValue(item.unit),
    ...(typeof item.note === 'string' ? { note: item.note } : {}),
  }));
}

function parseSteps(value: unknown): RecipeStep[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((item, index) => ({
    id: stringValue(item.id, `step-${index + 1}`),
    ...(typeof item.title === 'string' ? { title: item.title } : {}),
    instruction: stringValue(item.instruction),
    ...(typeof item.tip === 'string' ? { tip: item.tip } : {}),
  }));
}

function recipeFromSnapshot(snapshot: QueryDocumentSnapshot): Recipe {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: stringValue(data.title, 'Receta sin nombre'),
    description: stringValue(data.description),
    prepMinutes: typeof data.prepMinutes === 'number' ? data.prepMinutes : 0,
    servings: typeof data.servings === 'number' ? data.servings : 1,
    difficulty:
      data.difficulty === 'Moderado' || data.difficulty === 'Difícil'
        ? data.difficulty
        : 'Fácil',
    category: stringValue(data.category, 'Sin categoría') as Recipe['category'],
    author: stringValue(data.author),
    featured: data.featured === true,
    ...(typeof data.migaTip === 'string' ? { migaTip: data.migaTip } : {}),
    ...(typeof data.imageUrl === 'string' ? { imageUrl: data.imageUrl } : {}),
    ingredients: parseIngredients(data.ingredients),
    steps: parseSteps(data.steps),
    origin: data.origin === 'received' ? 'received' : 'own',
    ...(typeof data.senderName === 'string' ? { senderName: data.senderName } : {}),
    isExample: false,
    ...(typeof data.collectionId === 'string' ? { collectionId: data.collectionId } : {}),
    ...(typeof data.invitationId === 'string' ? { invitationId: data.invitationId } : {}),
    createdAt: timestampToIso(data.createdAt),
  };
}

function collectionFromSnapshot(snapshot: QueryDocumentSnapshot): MigaCollection {
  const data = snapshot.data();
  const allowedColors: MigaCollection['pastelBg'][] = [
    '#FFD6C9',
    '#E8D4F8',
    '#D4F8E8',
    '#FFF8D6',
  ];
  const color = stringValue(data.pastelBg) as MigaCollection['pastelBg'];
  return {
    id: snapshot.id,
    name: stringValue(data.name, 'Colección'),
    description: stringValue(data.description),
    pastelBg: allowedColors.includes(color) ? color : '#FFD6C9',
    isExample: false,
  };
}

function imageUrlForStorage(imageUrl: string | undefined): string | undefined {
  if (!imageUrl || !imageUrl.startsWith('/') || imageUrl.startsWith('//')) return imageUrl;
  if (typeof window === 'undefined' || window.location.protocol !== 'https:') return imageUrl;
  return new URL(imageUrl, window.location.origin).toString();
}

function recipeFields(recipe: Recipe) {
  return {
    title: recipe.title,
    description: recipe.description,
    prepMinutes: recipe.prepMinutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    category: recipe.category,
    author: recipe.author ?? '',
    featured: recipe.featured === true,
    migaTip: recipe.migaTip,
    imageUrl: imageUrlForStorage(recipe.imageUrl),
    ingredients: recipe.ingredients.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      ...(ingredient.note !== undefined ? { note: ingredient.note } : {}),
    })),
    steps: recipe.steps.map((step) => ({
      id: step.id,
      ...(step.title !== undefined ? { title: step.title } : {}),
      instruction: step.instruction,
      ...(step.tip !== undefined ? { tip: step.tip } : {}),
    })),
    origin: recipe.origin,
    senderName: recipe.senderName,
    collectionId: recipe.collectionId,
    invitationId: recipe.invitationId,
  };
}

function definedFields<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)
  ) as Partial<T>;
}

function recipeRuleIssues(data: Record<string, unknown>): string[] {
  const issues: string[] = [];
  const checkString = (key: string, label: string, max: number, min = 0) => {
    const value = data[key];
    if (typeof value !== 'string' || value.length < min || value.length > max) issues.push(label);
  };
  checkString('title', 'el nombre (1–120 caracteres)', 120, 1);
  checkString('description', 'la descripción (máximo 2000 caracteres)', 2000);
  checkString('category', 'la categoría (máximo 60 caracteres)', 60);
  checkString('author', 'el autor (máximo 80 caracteres)', 80);
  if (typeof data.prepMinutes !== 'number' || !Number.isInteger(data.prepMinutes) || data.prepMinutes < 0 || data.prepMinutes > 1440) {
    issues.push('el tiempo (entre 0 y 1440 minutos)');
  }
  if (typeof data.servings !== 'number' || !Number.isInteger(data.servings) || data.servings < 1 || data.servings > 100) {
    issues.push('las porciones (entre 1 y 100)');
  }
  if (!['Fácil', 'Moderado', 'Difícil'].includes(String(data.difficulty))) issues.push('la dificultad');
  if (typeof data.featured !== 'boolean') issues.push('el estado de destacada');
  if (data.migaTip !== undefined && (typeof data.migaTip !== 'string' || data.migaTip.length > 1000)) {
    issues.push('el consejo (máximo 1000 caracteres)');
  }
  if (data.imageUrl !== undefined && (typeof data.imageUrl !== 'string' || data.imageUrl.length > 280000 ||
      (!data.imageUrl.startsWith('https://') && !/^data:image\/jpeg;base64,[A-Za-z0-9+/]*={0,2}$/.test(data.imageUrl)))) {
    issues.push('la foto (JPEG comprimido o URL HTTPS de máximo 200 KiB)');
  }
  if (!Array.isArray(data.ingredients) || data.ingredients.length > 20) {
    issues.push('los ingredientes (máximo 20)');
  } else {
    data.ingredients.forEach((item, index) => {
      if (!isRecord(item) || typeof item.id !== 'string' || item.id.length < 1 || item.id.length > 100 ||
          typeof item.name !== 'string' || item.name.length < 1 || item.name.length > 160 ||
          typeof item.quantity !== 'string' || item.quantity.length > 80 ||
          typeof item.unit !== 'string' || item.unit.length > 80 ||
          (item.note !== undefined && (typeof item.note !== 'string' || item.note.length > 500))) {
        issues.push(`el ingrediente ${index + 1} (revisá nombre, cantidad, unidad o nota)`);
      }
    });
  }
  if (!Array.isArray(data.steps) || data.steps.length > 20) {
    issues.push('los pasos (máximo 20)');
  } else {
    data.steps.forEach((item, index) => {
      if (!isRecord(item) || typeof item.id !== 'string' || item.id.length < 1 || item.id.length > 100 ||
          typeof item.instruction !== 'string' || item.instruction.length > 2000 ||
          (item.title !== undefined && (typeof item.title !== 'string' || item.title.length > 120)) ||
          (item.tip !== undefined && (typeof item.tip !== 'string' || item.tip.length > 500))) {
        issues.push(`el paso ${index + 1} (revisá título, instrucción o tip)`);
      }
    });
  }
  if (!['own', 'received'].includes(String(data.origin))) issues.push('el origen de la receta');
  for (const [key, label, max] of [
    ['senderName', 'el remitente', 80], ['collectionId', 'la colección', 150], ['invitationId', 'la invitación', 150],
  ] as const) {
    if (data[key] !== undefined && (typeof data[key] !== 'string' || data[key].length > max)) issues.push(label);
  }
  return issues;
}

export function subscribeUserRecipes(
  uid: string,
  onData: (recipes: Recipe[]) => void,
  onError: (error: Error) => void
) {
  const recipesQuery = query(
    collection(requireDb(), 'users', uid, 'recipes'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    recipesQuery,
    (snapshot) => onData(snapshot.docs.map(recipeFromSnapshot)),
    onError
  );
}

export function subscribeUserCollections(
  uid: string,
  onData: (collections: MigaCollection[]) => void,
  onError: (error: Error) => void
) {
  const collectionsQuery = query(
    collection(requireDb(), 'users', uid, 'collections'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(
    collectionsQuery,
    (snapshot) => onData(snapshot.docs.map(collectionFromSnapshot)),
    onError
  );
}

export async function saveRecipe(uid: string, recipe: Recipe, isNew: boolean) {
  const recipeRef = doc(requireDb(), 'users', uid, 'recipes', recipe.id);
  const base = definedFields(recipeFields(recipe) as Record<string, unknown>);
  const issues = recipeRuleIssues(base as Record<string, unknown>);
  if (issues.length > 0) {
    throw Object.assign(new Error(`Firestore rechazará estos datos: ${issues.join('; ')}.`), {
      code: 'recipe-validation',
    });
  }

  if (isNew) {
    await setDoc(recipeRef, {
      ...base,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  let existingRecipe;
  try {
    existingRecipe = await getDoc(recipeRef);
  } catch (error) {
    const errorCode = typeof error === 'object' && error !== null && 'code' in error &&
      typeof error.code === 'string' ? error.code : 'unknown';
    throw Object.assign(new Error(`No se pudo verificar el acceso a la receta (${errorCode}).`), {
      code: `recipe-read-${errorCode}`,
    });
  }
  if (!existingRecipe.exists()) {
    throw Object.assign(new Error('La receta ya no existe en esta biblioteca. Recargá la página e intentá de nuevo.'), {
      code: 'recipe-not-found',
    });
  }
  const originalCreatedAt = existingRecipe.data().createdAt;

  const createdAtDate = new Date(recipe.createdAt);
  try {
    await setDoc(recipeRef, {
      ...base,
      // Preserve Firestore's original precision so the immutable timestamp rule
      // can compare it exactly. ISO strings only retain millisecond precision.
      createdAt: originalCreatedAt instanceof Timestamp
        ? originalCreatedAt
        : Number.isNaN(createdAtDate.getTime())
          ? serverTimestamp()
          : Timestamp.fromDate(createdAtDate),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'permission-denied') {
      throw Object.assign(new Error('Firebase permitió leer esta receta, pero rechazó la escritura (permission-denied).'), {
        code: 'recipe-write-permission-denied',
      });
    }
    throw error;
  }
}

export async function deleteRecipe(uid: string, recipeId: string) {
  await deleteDoc(doc(requireDb(), 'users', uid, 'recipes', recipeId));
}

export async function setRecipeCollection(
  uid: string,
  recipeId: string,
  collectionId: string
) {
  await updateDoc(doc(requireDb(), 'users', uid, 'recipes', recipeId), {
    collectionId: collectionId || deleteField(),
    updatedAt: serverTimestamp(),
  });
}

export async function saveCollection(uid: string, collectionData: MigaCollection, isNew: boolean) {
  const collectionRef = doc(requireDb(), 'users', uid, 'collections', collectionData.id);
  const fields = {
    name: collectionData.name,
    description: collectionData.description,
    pastelBg: collectionData.pastelBg,
  };
  if (isNew) {
    await setDoc(collectionRef, { ...fields, createdAt: serverTimestamp() });
    return;
  }
  await updateDoc(collectionRef, { ...fields, updatedAt: serverTimestamp() });
}

export async function deleteCollection(
  uid: string,
  collectionId: string,
  recipeIds: string[]
) {
  const database = requireDb();
  const batch = writeBatch(database);
  batch.delete(doc(database, 'users', uid, 'collections', collectionId));
  recipeIds.forEach((recipeId) => {
    batch.update(doc(database, 'users', uid, 'recipes', recipeId), {
      collectionId: deleteField(),
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}

export interface InviteInfo {
  ownerName: string;
  expiresAt: Date;
}

export async function createRecipeInvite(uid: string, ownerName: string) {
  const inviteRef = doc(collection(requireDb(), 'users', uid, 'invitations'));
  const expiresAt = new Date(Date.now() + INVITE_LIFETIME_MS);
  await setDoc(inviteRef, {
    ownerUid: uid,
    ownerName: ownerName.slice(0, 80) || 'Miga',
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt),
  });
  const origin = window.location.origin;
  return {
    id: inviteRef.id,
    link: `${origin}/invitacion/${uid}/${inviteRef.id}`,
  };
}

export async function getRecipeInvite(uid: string, inviteId: string): Promise<InviteInfo | null> {
  const inviteSnapshot = await getDoc(doc(requireDb(), 'users', uid, 'invitations', inviteId));
  if (!inviteSnapshot.exists()) return null;
  const data = inviteSnapshot.data();
  const expiresAt = data.expiresAt instanceof Timestamp
    ? data.expiresAt.toDate()
    : new Date(0);
  return {
    ownerName: stringValue(data.ownerName, 'Miga'),
    expiresAt,
  };
}

export async function submitInvitedRecipe(
  ownerUid: string,
  inviteId: string,
  recipe: Recipe
): Promise<Recipe> {
  const database = requireDb();
  const inviteRef = doc(database, 'users', ownerUid, 'invitations', inviteId);
  const recipeRef = doc(collection(database, 'users', ownerUid, 'recipes'));
  let inviteSnapshot;
  try {
    inviteSnapshot = await getDoc(inviteRef);
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
      ? error.code
      : 'unknown';
    throw Object.assign(new Error(`No se pudo validar el enlace de invitación (${code}).`), {
      code: `invitation-read-${code}`,
    });
  }
  if (!inviteSnapshot.exists()) throw new Error('Este enlace no es válido.');
  const invite = inviteSnapshot.data();
  if (invite.ownerUid !== ownerUid) throw new Error('Este enlace no corresponde a la cuenta que lo creó.');
  const expiresAt = invite.expiresAt instanceof Timestamp
    ? invite.expiresAt.toDate().getTime()
    : 0;
  if (expiresAt <= Date.now()) {
    throw new Error('Este enlace venció. Pedile a quien te invitó que genere otro.');
  }

  const savedRecipe: Recipe = {
    ...recipe,
    id: recipeRef.id,
    origin: 'received',
    isExample: false,
    invitationId: inviteId,
    createdAt: new Date().toISOString(),
  };
  const fields = definedFields(recipeFields(savedRecipe) as Record<string, unknown>);
  const issues = recipeRuleIssues(fields as Record<string, unknown>);
  if (issues.length > 0) {
    throw Object.assign(new Error(`Revisá ${issues.join('; ')} antes de enviar la receta.`), {
      code: 'recipe-validation',
    });
  }
  try {
    await setDoc(recipeRef, {
      ...fields,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
      ? error.code
      : 'unknown';
    throw Object.assign(new Error(`Firebase rechazó el envío de la receta (${code}).`), {
      code: `guest-recipe-write-${code}`,
    });
  }

  return {
    ...recipe,
    id: recipeRef.id,
    origin: 'received',
    isExample: false,
    invitationId: inviteId,
  };
}
