import {
    CreateMascotaSchema,
    UpdateMascotaSchema,
    DeleteMascotaSchema,
} from './mascotas-schemas'

describe('CreateMascotaSchema', () => {
    it('acepta una mascota válida', () => {
        const result = CreateMascotaSchema.safeParse({
            nombre: 'Firulais',
            sexo: 'macho',
            tamano: 'mediano',
            disponible_adopcion: true,
            edad: '24',
            personalidad: 'jugueton',
            imagen_url: 'https://example.com/foto.jpg',
            esterilizado: true,
            peso_kg: 12,
            altura_cm: 45,
            colores: ['negro', 'blanco'],
            descripcion_fisica: 'Perro mediano, activo y sano',
            fecha_ingreso: '2024-01-01',
            lugar_rescate: 'Morelia',
            condicion_ingreso: 'Rescatado',
            observaciones_medicas: 'Ninguna',
            raza_id: 'raza123',
            qr_code: null,
            estado: 'disponible',
        })

        expect(result.success).toBe(true)
    })

    it('rechaza una mascota con nombre demasiado corto', () => {
        const result = CreateMascotaSchema.safeParse({
            nombre: 'F',
            sexo: 'macho',
            tamano: 'mediano',
            edad: '10',
            personalidad: 'jugueton',
            raza_id: 'raza123',
        })

        expect(result.success).toBe(false)
    })

    it('asigna estado "disponible" por defecto', () => {
        const result = CreateMascotaSchema.safeParse({
            nombre: 'Luna',
            sexo: 'hembra',
            tamano: 'grande',
            edad: '36',
            personalidad: 'carinoso',
            raza_id: 'raza123',
            peso_kg: null,
            altura_cm: null,
        })

        expect(result.success).toBe(true)

        if (result.success) {
            expect(result.data.estado).toBe('disponible')
        }
    })
})

describe('UpdateMascotaSchema', () => {
    it('rechaza actualización con ID inválido', () => {
        const result = UpdateMascotaSchema.safeParse({
            id: 'no-es-uuid',
            nombre: 'Firulais',
            sexo: 'macho',
            tamano: 'mediano',
            edad: '12',
            personalidad: 'jugueton',
            raza_id: 'raza123',
        })

        expect(result.success).toBe(false)
    })
})

describe('DeleteMascotaSchema', () => {
    it('acepta eliminación con UUID válido', () => {
        const result = DeleteMascotaSchema.safeParse({
            id: crypto.randomUUID(),
        })

        expect(result.success).toBe(true)
    })
})
