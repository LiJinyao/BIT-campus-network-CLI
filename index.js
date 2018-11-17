const {login, logout, usageStatus} = require('./account.js')

function printHelp() {
    console.log(`
    用法
    登陆：
    node index.js login your-account your-password
    注销：
    node index.js logout your-account
    `)
}
async function exec(args) {
    if(args.length < 4) {
        printHelp()
    }
    switch (args[2]) {
        case 'login':
            if(args.length != 5) {
                printHelp()
            }
            const loginResponse = await login(args[3], args[4])
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