import { z } from "zod"

import { charts } from "./registry-charts"
import { examples } from "./registry-examples"
import { hooks } from "./registry-hooks"
import { internal } from "./registry-internal"
import { lib } from "./registry-lib"
import { templates } from "./registry-templates"
import { themes } from "./registry-themes"
import { ui } from "./registry-ui"

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: [
    ...ui,
    ...templates,
    ...charts,
    ...lib,
    ...hooks,
    ...themes,

    // Internal use only.
    ...internal,
    ...examples,
  ],
}
