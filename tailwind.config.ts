import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  safelist: [
    {
      pattern: /bg-(emerald|red|blue|yellow|green|fuchsia|gray|cyan|indigo|pink)-[2|3|4|5|6|7|8|9]00(?:\/[1-9][0-9]?)?/,
      variants: ['hover', 'group-hover', '!border'],
    }
  ],
}
