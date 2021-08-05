import axios from 'axios'
import fs from 'fs'

const ss = {
  valid: false,
  min: 0,
  max: 100
}

const GAME_NAME = 'SAUSAGE'
const EVENT_NAME = 'COMPILE'

const ms = {
  game: GAME_NAME,
  event: EVENT_NAME,
  data: {
    value: 1
  }
}

function discoverUrl () {
  let filename = null
  if (process.platform === 'darwin') {
    filename = '/Library/Application Support/SteelSeries Engine 3/coreProps.json'
  } else if (process.platform === 'linux') { // wsl. As long as programdata is on C drive :(
    filename = '/mnt/c/programdata/SteelSeries/SteelSeries Engine 3/coreProps.json'
  } else {
    filename = `${process.env.ALLUSERSPROFILE}/SteelSeries/SteelSeries Engine 3/coreProps.json`
  }
  if (!filename) {
    throw new Error('Unable to determine location of SteelSeries app data')
  }
  const corePropsJson = fs.readFileSync(filename, { encoding: 'utf-8' })
  if (corePropsJson) {
    const coreProps = JSON.parse(corePropsJson)
    if (coreProps.address) {
      return coreProps.address
    } else {
      throw new Error('Discover url failed: The core props does not contain address property.')
    }
  }
}

function setup (ip) {
  try {
    let ggServer = discoverUrl()
    if (!ggServer) {
      ss.valid = false
      return false
    }
    if (ip && ggServer) {
      const bits = ggServer.split(':')
      ggServer = ip + ':' + bits[1]
    }
    if (ggServer) {
      ss.valid = true
      ss.gameEventUrl = `http://${ggServer}/game_event`
      ss.gameMetadataUrl = `http://${ggServer}/game_metadata`
      ss.bindEventUrl = `http://${ggServer}/bind_game_event`
      return true
    }
  } catch (err) {
    console.log(err)
    ss.valid = false
  }
  return false
}

/**
 * Update the progress percentage
 * @param {number} val integer between 0 and 100
 * @returns false if ss is not valid or the call fails
 */
async function setProgress (val) {
  if (!ss.valid) {
    return false
  }
  const pc = val - ss.min
  const factor = (ss.max - ss.min) / 100
  const mval = pc * factor
  ms.data.value = mval
  try {
    await axios.post(ss.gameEventUrl, ms)
  } catch (err) {
    console.log(err)
    return false
  }
  return true
}

async function init (options = {}) {
  try {
    setup(options.ip)
    ss.min = options.min || 0
    ss.max = options.max || 100
    await axios.post(ss.gameMetadataUrl, {
      game: GAME_NAME,
      game_display_name: 'Sausage',
      developer: 'old sos'
    })
    await axios.post(ss.bindEventUrl, {
      game: GAME_NAME,
      event: EVENT_NAME,
      min_value: 0,
      max_value: 100,
      handlers: [
        {
          'device-type': 'screened',
          zone: 'one',
          mode: 'screen',
          datas: [
            {
              'icon-id': 15,
              lines: [
                {
                  'has-text': true,
                  prefix: 'progress ',
                  suffix: '%'
                },
                {
                  'has-progress-bar': true
                }
              ]
            }
          ]
        }
      ]
    })
  } catch (err) {
    console.log(err)
    ss.valid = false
    return false
  }
  return true
}

export {
  init, setProgress
}
