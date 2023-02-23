const apis = {
  login: { method: 'POST', url: 'user/login', group: 'ECirculation', dataType: 'keyValue' },
  loginByUsername: { method: 'POST', url: 'user/loginByUsername', group: 'ECirculation', dataType: 'keyValue' },
  modifyPassword: { method: 'POST', url: 'user/modifyPassword', group: 'ECirculation', dataType: 'keyValue' },
  binding: { method: 'POST', url: 'user/binding', group: 'ECirculation', dataType: 'keyValue' }
}

export default apis
