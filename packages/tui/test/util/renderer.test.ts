import { expect, test } from "bun:test"
import { createTestRenderer } from "@opentui/core/testing"
import { destroyRenderer } from "../../src/util/renderer"

test("clears the terminal title before destroying the renderer", () => {
  const calls: string[] = []
  destroyRenderer({
    isDestroyed: false,
    setTerminalTitle(title) {
      calls.push(`title:${title}`)
    },
    destroy() {
      calls.push("destroy")
    },
  })
  expect(calls).toEqual(["title:", "destroy"])
})

test("destroys synchronously and is safe while and after the renderer closes", async () => {
  await using setup = await createTestRenderer({ width: 10, height: 2 })
  await setup.renderer.setupTerminal()
  destroyRenderer(setup.renderer)
  expect(setup.renderer.isDestroyed).toBe(true)
  expect(() => destroyRenderer(setup.renderer)).not.toThrow()
  await setup.renderer.closed
  expect(() => destroyRenderer(setup.renderer)).not.toThrow()
})
