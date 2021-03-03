const users = []

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUsers = users.find((user) => {user.room === room && user.name === name})
    if(existingUsers){
        return {
            error: "Username is already taken."
        }
    }

    const user = {id, name, room}
    users.push(user)

    return { user }

}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUsers = (id) => {
    // console.log(users , id)
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => { 
    // console.log('users.js:', users , room)
    return users.filter(user => user.room === room)
}

module.exports = { addUser, removeUser, getUsers, getUsersInRoom  }