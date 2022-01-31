// Notre BDD
const users = [];

// Ajouter un user dans notre user 
function userJoin(id, username, room) {
    const user = {id, username, room};

    users.push(user);

    return user;
}

// Obtenir l'id du user actuellement connecté
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// supprimer un user de la liste : déconnexion
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Obtenir tous les users étant dans le même salon de chat
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};