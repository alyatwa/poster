
import axios from 'axios'

const url = "http://localhost:3000/" //process.env.NODE_ENV === 'production' ? "/api/" : "http://localhost:5000/api/"

export function getUser(_id) {
    return axios.get(`${url}/user/${_id}`).then((res) => {
        return res.data
    }).catch(err => console.log(err))
}

export function signupUser(user_data) {
    return axios.post(`${url}/signup`, user_data).then((res) => {
        return res.data
    }).catch(err => console.log(err))
}
export function loginUser(user_data) {
    return axios.post(`${url}/login`, user_data).then((res) => {
        return res.data
    }).catch(err => console.log(err))
}
