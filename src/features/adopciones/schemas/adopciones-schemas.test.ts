import {
    NuevaAdopcionSchema,
    RevisionAdopcionSchema,
} from './adopciones-schemas'

describe('NuevaAdopcionSchema', () => {
    it('acepta una solicitud de adopción válida', () => {
        const result = NuevaAdopcionSchema.safeParse({
            solicitud_id: crypto.randomUUID(),
            tipo_vivienda: 'Casa',
            espacio_disponible: 'Amplio',
            otras_mascotas: false,
            detalle_otras_mascotas: null,
            evidencia_hogar_urls: ['https://example.com/foto.jpg'],
            compromiso_seguimiento: true,
            compromiso_cuidado: true,
            observaciones_usuario: null,
        })

        expect(result.success).toBe(true)
    })

    it('rechaza la solicitud si no acepta el compromiso de seguimiento', () => {
        const result = NuevaAdopcionSchema.safeParse({
            solicitud_id: crypto.randomUUID(),
            tipo_vivienda: 'Casa',
            espacio_disponible: 'Amplio',
            otras_mascotas: false,
            detalle_otras_mascotas: null,
            evidencia_hogar_urls: ['https://example.com/foto.jpg'],
            compromiso_seguimiento: false,
            compromiso_cuidado: true,
            observaciones_usuario: null,
        })

        expect(result.success).toBe(false)
    })

    it('rechaza la solicitud si no acepta el compromiso de cuidado', () => {
        const result = NuevaAdopcionSchema.safeParse({
            solicitud_id: crypto.randomUUID(),
            tipo_vivienda: 'Casa',
            espacio_disponible: 'Amplio',
            otras_mascotas: false,
            detalle_otras_mascotas: null,
            evidencia_hogar_urls: ['https://example.com/foto.jpg'],
            compromiso_seguimiento: true,
            compromiso_cuidado: false,
            observaciones_usuario: null,
        })

        expect(result.success).toBe(false)
    })
})

describe('RevisionAdopcionSchema', () => {
    it('acepta una revisión aprobada sin observaciones', () => {
        const result = RevisionAdopcionSchema.safeParse({
            id: crypto.randomUUID(),
            admin_responsable: crypto.randomUUID(),
            estado: 'aprobada',
            observaciones_admin: null,
            contrato_url: null,
            seguimiento_programado: null,
        })

        expect(result.success).toBe(true)
    })

    it('rechaza una revisión rechazada sin observaciones del admin', () => {
        const result = RevisionAdopcionSchema.safeParse({
            id: crypto.randomUUID(),
            admin_responsable: crypto.randomUUID(),
            estado: 'rechazada',
            observaciones_admin: null,
            contrato_url: null,
            seguimiento_programado: null,
        })

        expect(result.success).toBe(false)
    })

    it('acepta una revisión rechazada con observaciones del admin', () => {
        const result = RevisionAdopcionSchema.safeParse({
            id: crypto.randomUUID(),
            admin_responsable: crypto.randomUUID(),
            estado: 'rechazada',
            observaciones_admin: 'No cumple con los requisitos mínimos',
            contrato_url: null,
            seguimiento_programado: null,
        })

        expect(result.success).toBe(true)
    })
})
