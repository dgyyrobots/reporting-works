/* eslint-disable */
import { MockMethod } from 'vite-plugin-mock'

const responseLogin = {

    code: 0,
    msg: "操作成功",
    data: {
        "userId": "492745",
        "stored_iworker": "%7B%22access_token%22%3A%22d48c83cc-21ca-4243-bdc9-ce6122fcd9f9%22%2C%22refresh_token%22%3A%22ef963710-6441-4433-9611-5c1bb985646e%22%2C%22expires_date%22%3A1748332002%2C%22rememberme%22%3A0%7D",
        "access_token": "N4gbJAdpdlKewA8MGH8s",
        "stored_company": "102869",
        "iworkerid": "hugbp3koljt1jen4ofs5i3rf5m"
    }
}


const responseUser = {
    "ret": 0,
    "msg": null,
    "data": {
        "account_email_disable": "0",
        "account_mobile_disable": "0",
        "system_product_name": "云MES",
        "personal_change_account_disable": "0",
        "private_cloud_enable": true,
        "system_invite_disable": "0",
        "personal_create_company_disable": "1",
        "company_name": "东莞智源彩印有限公司",
        "fullname": "李中鑫",
        "gender": "",
        "gender_name": "",
        "position": "",
        "email": "",
        "mobile": "15382894342",
        "work_email": "",
        "work_mobile": "15382894342",
        "phone": "",
        "about_me": "",
        "user_avatar_url": "http://192.168.127.17/i/avatars/thumbs2/_noavatar_user.gif",
        "user_signature_url": false
    },
    "time": "Fri May 23 03:28:18 +0000 2025"
}

export default [
    {
        url: '/mes/login/login',
        method: 'post',
        response() {
            console.log('Mock接口被调用')
            return responseLogin
        },
    },
    {
        url: '/apps/personal/ajax/personal_api/action:get_user_info',
        method: 'post',
        response() {
            return responseUser
        },
    },
] as MockMethod[]
