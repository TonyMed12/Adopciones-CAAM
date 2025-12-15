import { RazaSchema } from './razas-schemas'

describe('RazaSchema', () => {
    it('acepta una raza válida con todos los campos', () => {
        const result = RazaSchema.safeParse({
            nombre: 'Labrador',
            especie: 'Perro',
            tamano: 'grande',
            activa: true,
        })

        expect(result.success).toBe(true)
    })

    it('acepta una raza válida solo con campos obligatorios', () => {
        const result = RazaSchema.safeParse({
            nombre: 'Siames',
            especie: 'Gato',
        })

        expect(result.success).toBe(true)
    })

    it('rechaza una raza sin nombre', () => {
        const result = RazaSchema.safeParse({
            nombre: '',
            especie: 'Perro',
        })

        expect(result.success).toBe(false)
    })

    it('rechaza una raza con especie inválida', () => {
        const result = RazaSchema.safeParse({
            nombre: 'Desconocido',
            especie: 'Ave',
        })

        expect(result.success).toBe(false)
    })

    it('rechaza una raza con tamaño inválido', () => {
        const result = RazaSchema.safeParse({
            nombre: 'Chihuahua',
            especie: 'Perro',
            tamano: 'gigante',
        })

        expect(result.success).toBe(false)
    })
})
