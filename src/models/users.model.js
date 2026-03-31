export const userData = []
let idCounter = 1;

export function getUserByid(id){
    return userData.find(user => user.id === id)
}

export function getAllUsers(){
    return userData
}

export function createUser(data){
    const newUser = {
        id : idCounter ++,
        name : data.name,
        email: data.email,
        password: data.password
    }

    userData.push(newUser)
    return data
}

export function updateUser(id, data){
    const index = userData.findIndex(user => user.id === id)
    if (index !== -1){
        userData[index] = {
            ...data, id
        }
    }
    return userData[index]
}


export function deleteUser(id){
    const index = userData.findIndex(user => user.id === id)
    const user = {}
    if (index !== -1){
        user = userData[index]
        delete userData[index]
    }
    return user
}