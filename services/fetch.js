// services/fetch.js
import axios from 'axios'

export async function fetchJson(url, options = {}) {
  try {
    const res = await axios({
      url,
      method: options.method || 'GET',
      headers: options.headers || {},
      params: options.params || {},
      data: options.data || {},
      timeout: options.timeout || 30000
    })
    return res.data
  } catch (err) {
    return {
      status: false,
      error: err.message
    }
  }
}

export async function fetchText(url, options = {}) {
  try {
    const res = await axios({
      url,
      method: options.method || 'GET',
      responseType: 'text',
      timeout: options.timeout || 30000
    })
    return res.data
  } catch (err) {
    return null
  }
}