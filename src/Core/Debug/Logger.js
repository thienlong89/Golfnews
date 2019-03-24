const isDebug = true;

module.exports.log = function(messange,...params){
    if(!isDebug) return;
    let date = new Date();
    let date_time = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    let msg = `${date_time} : ${messange}`;
    console.log(msg,...params);
}

module.exports.warn = function(messange,...params){
    if(!isDebug) return;
    let date = new Date();
    let date_time = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    let msg = `${date_time} : ${messange}`;
    console.warn(msg,...params);
}

module.exports.error = function(messange,...params){
    if(!isDebug) return;
    let date = new Date();
    let date_time = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    let msg = `${date_time} : ${messange}`;
    console.error(msg,...params);
}

module.exports.trace = function(messange,...params){
    if(!isDebug) return;
    let date = new Date();
    let date_time = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    let msg = `${date_time} : ${messange}`;
    console.trace(msg,...params);
}

module.exports.info = function(messange,...params){
    if(!isDebug) return;
    let date = new Date();
    let date_time = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    let msg = `${date_time} : ${messange}`;
    console.info(msg,...params);
}
