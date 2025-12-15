import {
    DireccionSchema,
    PerfilSchema,
    PerfilConDireccionSchema,
    DeleteUsuarioSchema,
} from './usuarios-schemas'

describe('DireccionSchema', () => {
    it('acepta una dirección válida', () => {
        const result = DireccionSchema.safeParse({
            id: crypto.randomUUID(),
            usuario_id: crypto.randomUUID(),
            calle: 'Av. Siempre Viva',
            numero_exterior: '742',
            numero_interior: null,
            colonia: 'Centro',
            codigo_postal: '58000',
            municipio: 'Morelia',
            estado: 'Michoacán',
            pais: 'México',
            tipo_vivienda: 'Casa',
            es_propia: true,
            direccion_principal: true,
        })

        expect(result.success).toBe(true)
    })

    it('rechaza dirección sin campos obligatorios', () => {
        const result = DireccionSchema.safeParse({
            id: crypto.randomUUID(),
            usuario_id: crypto.randomUUID(),
            calle: '',
        })

        expect(result.success).toBe(false)
    })
})

describe('PerfilSchema', () => {
    it('acepta un perfil válido', () => {
        const result = PerfilSchema.safeParse({
            id: crypto.randomUUID(),
            nombres: 'Juan',
            apellido_paterno: 'Pérez',
            apellido_materno: 'López',
            email: 'juan@test.com',
            activo: true,
            rol_id: 2,
        })

        expect(result.success).toBe(true)
    })

    it('rechaza perfil con email inválido', () => {
        const result = PerfilSchema.safeParse({
            id: crypto.randomUUID(),
            nombres: 'Juan',
            apellido_paterno: 'Pérez',
            email: 'correo-no-valido',
            activo: true,
            rol_id: 2,
        })

        expect(result.success).toBe(false)
    })

    it('convierte fecha_nacimiento a Date automáticamente', () => {
        const result = PerfilSchema.safeParse({
            id: crypto.randomUUID(),
            nombres: 'Ana',
            apellido_paterno: 'Gómez',
            email: 'ana@test.com',
            activo: true,
            rol_id: 1,
            fecha_nacimiento: '1998-05-10',
        })

        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.fecha_nacimiento).toBeInstanceOf(Date)
        }
    })
})

describe('PerfilConDireccionSchema', () => {
    it('acepta perfil con dirección asociada', () => {
        const result = PerfilConDireccionSchema.safeParse({
            id: crypto.randomUUID(),
            nombres: 'Luis',
            apellido_paterno: 'Ramírez',
            email: 'luis@test.com',
            activo: true,
            rol_id: 3,
            direccion: {
                id: crypto.randomUUID(),
                usuario_id: crypto.randomUUID(),
                calle: 'Calle Falsa',
                colonia: 'Centro',
                codigo_postal: '58000',
                municipio: 'Morelia',
                estado: 'Michoacán',
            },
        })

        expect(result.success).toBe(true)
    })

    it('acepta perfil sin dirección', () => {
        const result = PerfilConDireccionSchema.safeParse({
            id: crypto.randomUUID(),
            nombres: 'María',
            apellido_paterno: 'Hernández',
            email: 'maria@test.com',
            activo: true,
            rol_id: 2,
            direccion: null,
        })

        expect(result.success).toBe(true)
    })
})

describe('DeleteUsuarioSchema', () => {
    it('acepta eliminación con UUID válido', () => {
        const result = DeleteUsuarioSchema.safeParse({
            id: crypto.randomUUID(),
        })

        expect(result.success).toBe(true)
    })

    it('rechaza eliminación con ID inválido', () => {
        const result = DeleteUsuarioSchema.safeParse({
            id: '123',
        })

        expect(result.success).toBe(false)
    })
})
