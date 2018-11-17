/**
 * function to login to campus network
 */
const Hashes = require('./jshashes.js')
const encode = require('./encode.js')
const querystring = require('querystring')
const http = require('http')

const LOGIN_HOST = 'http://10.0.0.55'

const base64 = new Hashes.Base64()
const hex_hmac = new Hashes.MD5().hex_hmac
const hex = new Hashes.SHA1().hex

/**
 * simple http.get warp
 * @param {string} url request url
 */
function get(url, param) {
    const requestUrl = `${url}?${querystring.stringify(param)}`
    return new Promise((resolve, reject) => {
        http
        .get(requestUrl, (res) => {
            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', (chunk) => { rawData += chunk; })
            res.on('end', () => {
                resolve(rawData)
            })
        })
        .on('error', reject)
    })
}


/**
 * simulate a jsonp request.
 * @param {string} url request url
 * @param {object} param get param object
 */
async function getJsonp(url, param) {
    const date = new Date()
    param.callback = `jsonp${date.getTime()}`
    return get(url, param)
}

async function getChallenge(username) {
    const response = await getJsonp(LOGIN_HOST + '/cgi-bin/get_challenge', {username})
    const jsondata = JSON.parse(response.substring(19, response.length - 1))
    return jsondata
}

async function login(username, password) {
    // get chalange
    const challengeInfo = await getChallenge(username)
    if(challengeInfo.res !== 'ok') {
        throw new Error('Get challenge error')
    }
    // cpoy from login page's script
    data = {}
    token = challengeInfo.challenge
    const acid = '1'
    const type = 1
    const ip = challengeInfo.client_ip
    const n = 200
    data.username = username
    data.info = '{SRBX1}'+base64.encode(encode(JSON.stringify({'username':username, 'password':password, 'ip':ip, 'acid':acid, 'enc_ver':'srun_bx1'}), token))
    const hmd5 = hex_hmac(token, data.password);
    data.password = '{MD5}'+hmd5;
    data.chksum = hex(token+username+token+hmd5+token+acid+token+ip+token+n+token+type+token+data.info)
    data.n = n
    data.type = type
    data.action = 'login'
    data.ac_id = acid
    data.ip = ip
    const response = await getJsonp(LOGIN_HOST + '/cgi-bin/srun_portal', data)
    const jsonData = JSON.parse(response.substring(19, response.length - 1))
    return jsonData
}

async function logout(username) {
    const challengeInfo = await getChallenge(username)
    if(challengeInfo.res !== 'ok') {
        reject(challengeInfo.error)
    }
    // cpoy from login page's script
    data = {}
    token = challengeInfo.challenge
    const acid = '1'
    const type = 1
    const ip = challengeInfo.client_ip
    const n = 200
    data.info = '{SRBX1}'+base64.encode(encode(JSON.stringify({'username':username, 'ip':challengeInfo.client_ip, 'acid':acid,'enc_ver':'srun_bx1'}), token))
    const str = token+username+token+acid+token+ip+token+n+token+type+token+data.info
    data.chksum = hex(str)
    data.n = n
    data.type = type
    data.action = 'logout'
    const response = await getJsonp(LOGIN_HOST + '/cgi-bin/srun_portal', data)
    const jsonData = JSON.parse(response.substring(19, response.length - 1))
    return jsonData
}


function parseUsageStatus(statusHTML) {
    const spanRegx = /<span .*?>(.*?)<\/span>/gm
    const keyList = ['account', 'ip', 'bandwidth', 'time', 'balance']
    let match
    let keyindex = 0
    let result = {}
    while ((match = spanRegx.exec(statusHTML)) !== null) {
        if (match.index === spanRegx.lastIndex) {
            spanRegx.lastIndex++
        }
        result[keyList[keyindex++]] = match[1]
    }
    return result
}

/**
 * Call after login, pass login response to get usage info.
 * @param {json} loginResponse login response result
 */
async function usageStatus(loginResponse) {
    const data = {
        ac_id: '1',
        username: loginResponse.username,
        ip: loginResponse.client_ip,
        access_token: loginResponse.token,
    }
    return parseUsageStatus(await get(`${LOGIN_HOST}/srun_portal_pc_succeed.php`, data))
}

module.exports = {login, usageStatus, logout}