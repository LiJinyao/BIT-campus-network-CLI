#!/usr/bin/env node

const {login, logout, usageStatus} = require('./account.js')

function printHelp() {
    console.log(`
    用法
    登陆：
    node BIT.js login your-account [password]
    注销：
    node BIT.js logout your-account
    `)
}
/////
async function getPassword(prompt) {
    process.stdout.write(prompt)
    return new Promise((resolve, reject) => {
        const stdin = process.stdin
        stdin.setRawMode(true)
        stdin.setEncoding('utf8')
    
        var password = ''
        stdin.on('data', function (ch) {
            ch = ch.toString('utf8')
            switch (ch) {
            case "\n":
            case "\r":
            case "\u0004":
                // They've finished typing their password
                process.stdout.write('\n')
                stdin.setRawMode(false)
                stdin.pause()
                resolve(password)
                break
            case "\u0003":
                // Ctrl-C
                process.stdout.write('\n')
                stdin.setRawMode(false)
                stdin.pause()
                process.exit(0)
                break
            default:
                // More passsword characters
                process.stdout.write('*')
                password += ch
                break
            }
        })
    })
    
}

async function exec(args) {
    if(args.length < 4) {
        printHelp()
    }
    switch (args[2]) {
        case 'login':
            let password;
            if(args.length > 4) {
                password = args[4]
            } else {
                password = await getPassword('Password: ')
            }
            const loginResponse = await login(args[3], password)
            if(loginResponse.suc_msg === 'login_ok') {
                console.log(`login successfully`)
                let usage = await usageStatus(loginResponse)
                for (key in usage) {
                    console.log('\x1b[36m%s\x1b[0m', `${key.padEnd(9)}: ${usage[key]}`)
                }
            } else {
                if(loginResponse.error_msg.length > 0) {
                    console.log(`login failed，${loginResponse.error_msg}`)
                } else {
                    console.log(`login failed，${loginResponse.suc_msg}`)
                }
            }
            break
        case 'logout':
            const logoutResponse = await logout(args[3])
            if(logoutResponse.res === 'ok') {
                console.log('logout successfully')
            } else {
                console.log(`logout failed, ${logoutResponse.res}`)
            }
            break
        default:
            break
    }
}

exec(process.argv)