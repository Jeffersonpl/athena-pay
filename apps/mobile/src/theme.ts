export type Theme = {
  name: string
  bg: string
  surface: string
  text: string
  muted: string
  primary: string
  accent: string
  cardRadius: number
}

export const themes: Record<string, Theme> = {
  neoGold: { name: 'NeoGold', bg:'#FFF7EC', surface:'#FFFFFF', text:'#0D1B2A', muted:'#516078', primary:'#C7A008', accent:'#00E5D8', cardRadius:16 },
  gamer:   { name: 'Gamer',   bg:'#050810', surface:'#0B1220', text:'#EAF2FF', muted:'#9BB1D0', primary:'#7C3AED', accent:'#22D3EE', cardRadius:18 },
  nerd:    { name: 'Nerd',    bg:'#07150A', surface:'#0D2412', text:'#E7FFE8', muted:'#A0D6A4', primary:'#2DD36F', accent:'#34D399', cardRadius:14 },
  teen:    { name: 'Teen',    bg:'#FDF1FF', surface:'#FFFFFF', text:'#231942', muted:'#8D5DA7', primary:'#FF5CAA', accent:'#7CFFEA', cardRadius:16 },
  pj:      { name: 'PJ',      bg:'#F2F7FF', surface:'#FFFFFF', text:'#0C1120', muted:'#5C6B86', primary:'#0EA5E9', accent:'#22D3EE', cardRadius:14 }
}
