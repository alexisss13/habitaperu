"use server"

import { auth } from "@/lib/auth"
import { uploadStream, isConfigured } from "@/lib/cloudinary"

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  isMocked?: boolean
}

export async function uploadImageAction(
  formData: FormData,
  folderName: string = "habita-peru"
): Promise<UploadResult> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "No autorizado. Inicie sesión." }
    }

    const file = formData.get("file") as File | null
    if (!file) {
      return { success: false, error: "No se proporcionó ningún archivo." }
    }

    // Si Cloudinary no está configurado, avisar amigablemente al cliente
    if (!isConfigured) {
      return { 
        success: false, 
        error: "Cloudinary no está configurado. Configure las credenciales en el archivo .env.",
        isMocked: true
      }
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "El archivo proporcionado no es una imagen válida." }
    }

    // Validar tamaño de archivo (máx 5MB)
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: "La imagen excede el límite de tamaño permitido de 5MB." }
    }

    // Convertir archivo a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a Cloudinary
    const secureUrl = await uploadStream(buffer, folderName)

    return { success: true, url: secureUrl }
  } catch (error: any) {
    console.error("Error uploading image:", error)
    return { success: false, error: error.message || "Ocurrió un error inesperado al subir la imagen." }
  }
}
