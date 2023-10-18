const users = {};

function getUsers(arr) {
  const onlineUsers = [];
  arr.forEach((onlineUser) => {
    onlineUsers.push(Object.values(onlineUser)[0]);
  });
  return onlineUsers;
}

module.exports = { getUsers, users };
