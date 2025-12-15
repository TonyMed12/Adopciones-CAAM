import { validateEmail } from './validateEmail'

describe('validateEmail', () => {
    it('true con correo válido', () => {
        expect(validateEmail('test@correitocaam.com')).toBe(true)
    })

    it('false con correo inválido', () => {
        expect(validateEmail('estonoesuncorreo')).toBe(false)
    })
})
