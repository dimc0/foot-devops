// app/api/favorites/[matchId]/__tests__/route.test.ts
/**
 * @jest-environment node
 */
import { POST, DELETE } from "../route"

jest.mock("@/lib/db/favorites", () => ({
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
}))

import { addFavorite, removeFavorite } from "@/lib/db/favorites"

const mockAdd = addFavorite as jest.Mock
const mockRemove = removeFavorite as jest.Mock

const makeParams = (matchId: string) => ({
  params: Promise.resolve({ matchId }),
})

afterEach(() => jest.resetAllMocks())

describe("POST /api/favorites/[matchId]", () => {
  it("retourne 201 si le favori est créé", async () => {
    mockAdd.mockResolvedValueOnce({
      id: 1,
      user_id: "user-demo",
      match_id: 1,
      added_at: "2024-01-01T00:00:00Z",
    })

    const response = await POST(new Request("http://localhost"), makeParams("1"))

    expect(response.status).toBe(201)
  })

  it("retourne 409 si le favori existe déjà", async () => {
    mockAdd.mockResolvedValueOnce(null)

    const response = await POST(new Request("http://localhost"), makeParams("1"))

    expect(response.status).toBe(409)
  })

  it("retourne 400 si matchId n'est pas un nombre valide", async () => {
    const response = await POST(new Request("http://localhost"), makeParams("abc"))

    expect(response.status).toBe(400)
  })

  it("retourne 500 si addFavorite lève une erreur", async () => {
    mockAdd.mockRejectedValueOnce(new Error("DB error"))
    jest.spyOn(console, "error").mockImplementation(() => {})

    const response = await POST(new Request("http://localhost"), makeParams("1"))

    expect(response.status).toBe(500)
  })
})

describe("DELETE /api/favorites/[matchId]", () => {
  it("retourne 204 si le favori est supprimé", async () => {
    mockRemove.mockResolvedValueOnce(true)

    const response = await DELETE(new Request("http://localhost"), makeParams("1"))

    expect(response.status).toBe(204)
  })

  it("retourne 404 si le favori n'existe pas", async () => {
    mockRemove.mockResolvedValueOnce(false)

    const response = await DELETE(new Request("http://localhost"), makeParams("1"))

    expect(response.status).toBe(404)
  })

  it("retourne 400 si matchId n'est pas un nombre valide", async () => {
    const response = await DELETE(new Request("http://localhost"), makeParams("abc"))

    expect(response.status).toBe(400)
  })

  it("retourne 500 si removeFavorite lève une erreur", async () => {
    mockRemove.mockRejectedValueOnce(new Error("DB error"))
    jest.spyOn(console, "error").mockImplementation(() => {})

    const response = await DELETE(new Request("http://localhost"), makeParams("1"))

    expect(response.status).toBe(500)
  })
})