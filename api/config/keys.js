// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
// if(process.env.NODE_ENV === 'production'){
if(process.env.HOSTNAME === 'localhost.localdomain'){
// prod
    module.exports = require('./prod');
}else{
// dev
    module.exports = require('./dev');
}