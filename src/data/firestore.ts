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
  runTransaction,
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
    imageUrl: recipe.imageUrl,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
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

  if (isNew) {
    await setDoc(recipeRef, {
      ...base,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  const update = {
    ...base,
    imageUrl: recipe.imageUrl ?? deleteField(),
    migaTip: recipe.migaTip ?? deleteField(),
    collectionId: recipe.collectionId ?? deleteField(),
    senderName: recipe.senderName ?? deleteField(),
    invitationId: recipe.invitationId ?? deleteField(),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(recipeRef, update);
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
  used: boolean;
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
    used: false,
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
    used: data.used === true,
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

  await runTransaction(database, async (transaction) => {
    const inviteSnapshot = await transaction.get(inviteRef);
    if (!inviteSnapshot.exists()) throw new Error('Este enlace no es válido.');
    const invite = inviteSnapshot.data();
    const expiresAt = invite.expiresAt instanceof Timestamp
      ? invite.expiresAt.toDate().getTime()
      : 0;
    if (invite.used === true) throw new Error('Este enlace ya recibió una receta.');
    if (expiresAt <= Date.now()) throw new Error('Este enlace venció. Pedile a quien te invitó que genere otro.');

    const savedRecipe: Recipe = {
      ...recipe,
      id: recipeRef.id,
      origin: 'received',
      isExample: false,
      invitationId: inviteId,
      createdAt: new Date().toISOString(),
    };
    transaction.set(recipeRef, {
      ...definedFields(recipeFields(savedRecipe) as Record<string, unknown>),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    transaction.update(inviteRef, {
      used: true,
      usedAt: serverTimestamp(),
      recipeId: recipeRef.id,
    });
  });

  return {
    ...recipe,
    id: recipeRef.id,
    origin: 'received',
    isExample: false,
    invitationId: inviteId,
  };
}
