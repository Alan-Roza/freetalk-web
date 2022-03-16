const getToken = () => {
  const token = localStorage.getItem('@freetalk/token')
  if (token && token !== null) return token
  return undefined
}

const clearStorage = () => localStorage.clear()

export {
  getToken,
  clearStorage
}