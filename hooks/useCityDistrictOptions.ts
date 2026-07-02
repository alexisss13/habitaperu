'use client'

import { useEffect, useState } from "react"
import { getActiveCitiesAction, getActiveDistrictsAction } from "@/app/actions/location-actions"

/**
 * Opciones de ciudad/distrito para los comboboxes de publicación de propiedades.
 * Las ciudades y distritos vienen del panel admin (/admin/locations); los
 * distritos se recargan cada vez que cambia la ciudad seleccionada.
 */
export function useCityDistrictOptions(city: string) {
  const [cities, setCities] = useState<string[]>([])
  const [citiesLoading, setCitiesLoading] = useState(true)
  const [districts, setDistricts] = useState<string[]>([])
  const [districtsLoading, setDistrictsLoading] = useState(false)

  useEffect(() => {
    getActiveCitiesAction()
      .then(setCities)
      .catch(() => setCities([]))
      .finally(() => setCitiesLoading(false))
  }, [])

  useEffect(() => {
    if (!city.trim()) { setDistricts([]); return }
    setDistrictsLoading(true)
    getActiveDistrictsAction(city)
      .then(setDistricts)
      .catch(() => setDistricts([]))
      .finally(() => setDistrictsLoading(false))
  }, [city])

  return { cities, citiesLoading, districts, districtsLoading }
}
