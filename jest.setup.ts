// jest.setup.ts

/**
 * Setup global Jest — chargé avant chaque suite de tests frontend.
 * Importe les matchers jest-dom qui permettent d'écrire des assertions comme :
 * expect(element).toBeInTheDocument()
 * expect(element).toHaveTextContent("...")
 */
import "@testing-library/jest-dom"