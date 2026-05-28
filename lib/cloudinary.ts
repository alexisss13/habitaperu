import { v2 as cloudinary } from "cloudinary"

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export { cloudinary, isConfigured }

export async function uploadStream(fileBuffer: Buffer, folder: string): Promise<string> {
  if (!isConfigured) {
    throw new Error("Cloudinary no está configurado en las variables de entorno.")
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error)
        }
        if (result && result.secure_url) {
          resolve(result.secure_url)
        } else {
          reject(new Error("Error al subir archivo a Cloudinary."))
        }
      }
    )

    stream.end(fileBuffer)
  })
}
