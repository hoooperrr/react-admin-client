import axios from 'axios'
import {message} from "antd";

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise(((resolve, reject) => {
        let promise;
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            });
        } else {
            promise = axios.post(url, data);
        }
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{ //统一管理错误
            message.error(error.message)
        })
    }));

}

// ajax('/login', {username:'a'}, 'POST')
// ajax('/manage/user/add', {username:'a',password:'11',phone:'11'}, 'POST')
