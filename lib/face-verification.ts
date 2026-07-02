"use client"

import { FACE_MATCH_DISTANCE_THRESHOLD } from "./face-verification-constants"

export { FACE_MATCH_DISTANCE_THRESHOLD }

const MODELS_URL = "/models"

// face-api.js (TensorFlow.js) solo puede evaluarse en el navegador: importarlo
// a nivel de módulo rompe el SSR/build de Next.js con
// "this.util.TextEncoder is not a constructor", porque tfjs detecta el
// entorno al cargarse y Next evalúa este archivo también en Node antes de
// que exista window/document. Por eso se carga con import() perezoso, solo
// cuando realmente se necesita, ya en el cliente.
type FaceApiModule = typeof import("@vladmandic/face-api")

let faceapiModule: FaceApiModule | null = null
async function getFaceApi(): Promise<FaceApiModule> {
  if (!faceapiModule) {
    faceapiModule = await import("@vladmandic/face-api")
  }
  return faceapiModule
}

let modelsLoaded = false
let loadingPromise: Promise<void> | null = null

export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    const faceapi = await getFaceApi()
    await Promise.all([
      // SsdMobilenetv1 (en vez de TinyFaceDetector) — más lento pero mucho más
      // preciso con rostros pequeños o impresos (foto de DNI), y aquí se usa
      // sobre una sola captura, no un stream de video en vivo.
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
    ])
    modelsLoaded = true
  })()

  return loadingPromise
}

export interface FaceDescriptorResult {
  descriptor: Float32Array | null
  faceCount: number
}

/**
 * Detecta un único rostro en la imagen y devuelve su descriptor de 128
 * dimensiones. `faceCount` permite distinguir "no se detectó ningún rostro"
 * de "se detectó más de uno" (ambos casos bloquean el match).
 */
export async function getFaceDescriptor(
  input: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
): Promise<FaceDescriptorResult> {
  const faceapi = await getFaceApi()
  await loadFaceModels()

  const detections = await faceapi
    .detectAllFaces(input, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
    .withFaceLandmarks()
    .withFaceDescriptors()

  if (detections.length !== 1) {
    return { descriptor: null, faceCount: detections.length }
  }

  return { descriptor: detections[0].descriptor, faceCount: 1 }
}

/**
 * Convierte la distancia euclidiana entre dos descriptores en un porcentaje
 * de similitud amigable para mostrar en la UI (0-100). Es solo presentacional
 * — la decisión de aprobar/enviar a revisión se basa en la distancia cruda
 * contra FACE_MATCH_DISTANCE_THRESHOLD.
 */
export function distanceToSimilarityPercent(distance: number): number {
  return Math.max(0, Math.min(100, Math.round((1 - distance) * 100)))
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("No se pudo cargar la imagen para el análisis facial."))
    img.src = url
  })
}

function euclideanDistance(a: Float32Array, b: Float32Array): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i]
    sum += diff * diff
  }
  return Math.sqrt(sum)
}

export function computeFaceMatch(a: Float32Array, b: Float32Array): { distance: number; matchPercent: number; isMatch: boolean } {
  const distance = euclideanDistance(a, b)
  return {
    distance,
    matchPercent: distanceToSimilarityPercent(distance),
    isMatch: distance <= FACE_MATCH_DISTANCE_THRESHOLD,
  }
}
