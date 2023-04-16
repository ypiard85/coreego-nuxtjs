//ICONS / IMAGES
export const LOGO_PATH = require('../assets/logo_coreego.png')
export const IMAGE_EMPTY = require('../assets/image_empty.png')
export const IMG_HOME_PAGE_HEADER = require('../assets/wavecoreego.png')
export const ICON_DIAPO_NEXT_BTN = `<i class="bi bi-arrow-right-circle-fill"></i>`
export const ICON_DIAPO_PREV_BTN = `<i class="bi bi-arrow-left-circle-fill"></i>`

//KAKAO MAP
export const KAKAO_REST_API_KEY = '97965bbc84ec42f9935a273c8cfecfcb'
export const TYPE_ROADMAP = 0
export const TYPE_HYBRID = 1
export const MODE_MAP_VIEW = 2
export const MODE_STREET_VIEW = 3

export const MORE_RECENT = 0
export const MORE_OLDER = 1

export const PERIOD_OPTIONS = [
  {
    value: MORE_RECENT,
    text: 'Du plus récent',
  },
  {
    value: MORE_OLDER,
    text: 'Du plus ancien',
  },
]

export const STEP_STATUS_SUCCESS = 'success'

export const STEP_TITLE = 1
export const STEP_LOCALISATION = 2
export const STEP_CATEGORY = 3
export const STEP_PICTURE = 4
export const STEP_DESCRIPTION = 5

export const STEP_OPTIONS = [
  {
    id: STEP_TITLE,
    status: STEP_STATUS_SUCCESS,
    title: 'Titre',
    icon: 'el-icon-edit',
  },
  {
    id: STEP_LOCALISATION,
    status: STEP_STATUS_SUCCESS,
    title: 'Localisation',
    icon: 'el-icon-location-outline',
  },
  {
    id: STEP_CATEGORY,
    status: STEP_STATUS_SUCCESS,
    title: 'Catégorie',
    icon: 'el-icon-suitcase',
  },
  {
    id: STEP_PICTURE,
    status: STEP_STATUS_SUCCESS,
    title: 'Photos',
    icon: 'el-icon-picture-outline',
  },
  {
    id: STEP_DESCRIPTION,
    status: STEP_STATUS_SUCCESS,
    title: 'Description',
    icon: 'el-icon-chat-line-square',
  },
]
