// export default {
//     a(){
//
//     },
//     b() {
//
//     }
// }
import ajax from "./ajax";
import jsonp from 'jsonp'
import {message} from "antd";

const BASE = ''
const KEY = '541eb38215d43127e3f28d191a1d176b'
const CITY = '310000'
// 登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')
// add user
export const reqAddUser = user => ajax(BASE + '/manage/user/add', user, 'POST')
//天气
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=${KEY}&city=${CITY}`;
        jsonp(url, {}, (err, data) => {
            if (!err && data.status !== "0") {
                console.log('wth', data)
                const {weather, city, temperature} = data.lives[0]
                resolve({weather, city, temperature})
            } else {
                message.error('error')
            }
        })
    })
}
// reqWeather(1)
export const reqCategory = (parentId) => ajax(BASE + '/manage/category/list', {parentId})
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {
    categoryName,
    parentId
}, 'POST')
export const reqUpdateCategory = ({categoryName, categoryId}) => ajax(BASE + '/manage/category/update', {
    categoryId,
    categoryName
}, 'POST')

export const reqProducts = (pageNum, pageSize) => ajax(BASE + 'manage/product/list', {pageNum, pageSize})
export const reqSearchProducts = ({
                                      pageNum,
                                      pageSize,
                                      searchContent,
                                      searchType
                                  }) => ajax(BASE + 'manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchContent,
})
export const reqProductCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
export const reqUpdateProductStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {
    productId,
    status
}, 'POST')
export const reqDeleteImage = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')
export const reqProductAddOrUpdate = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')

export const reqRoles = () => ajax(BASE + '/manage/role/list')
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add',{roleName},'POST')
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update',role,'POST')
