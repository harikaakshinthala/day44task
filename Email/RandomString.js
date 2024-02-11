const randomString = (lengthOfTheString) => {
    let token = ''
const string = "abcdefghijklmnopqrstuvwxyz1234567890"
for(let index = 0; index<lengthOfTheString; index++){
    token += string.charAt(Math.floor(Math.random()*string.length))
}
return token
}

export default randomString;