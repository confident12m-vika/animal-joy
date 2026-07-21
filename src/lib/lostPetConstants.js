export const POST_TYPES = [
  { value: 'lost', i18nKey: 'postTypeLost', emoji: '\uD83D\uDEA8', color: '#B4432D' },
  { value: 'possibly-lost', i18nKey: 'postTypePossiblyLost', emoji: '\u2753', color: '#B39159' },
  { value: 'urgent-help', i18nKey: 'postTypeUrgentHelp', emoji: '\uD83C\uDD98', color: '#8B3FA0' },
]

export const ANIMAL_TYPES = [
  { value: 'cat', i18nKey: 'animalCat', emoji: '\uD83D\uDC31' },
  { value: 'dog', i18nKey: 'animalDog', emoji: '\uD83D\uDC36' },
  { value: 'other', i18nKey: 'animalOther', emoji: '\uD83D\uDC3E' },
]

export function postTypeInfo(value) {
  return POST_TYPES.find((p) => p.value === value) || POST_TYPES[0]
}

export function animalTypeInfo(value) {
  return ANIMAL_TYPES.find((a) => a.value === value) || ANIMAL_TYPES[2]
}
