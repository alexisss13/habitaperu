/// Distancia euclidiana máxima entre descriptores faciales para considerar
/// que el rostro de la selfie corresponde al del DNI. face-api.js recomienda
/// <0.6 para "misma persona"; usamos un valor algo más estricto.
/// Sin directiva "use client" a propósito: la importan tanto el helper de
/// cliente (face-verification.ts) como la server action (kyc-actions.ts),
/// para que ambos apliquen exactamente el mismo umbral.
export const FACE_MATCH_DISTANCE_THRESHOLD = 0.55

export const FACE_MATCH_PERCENT_THRESHOLD = Math.round((1 - FACE_MATCH_DISTANCE_THRESHOLD) * 100)
