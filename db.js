const sql = require("mssql");

const dbConfig = {
    user:"joaoneto",
    password:"Cor0l4@88!",
    server:"localhost",
    port:1433,
    database:"ThegCine",
    options:{
        encrypt: false,
        trustServerCertificates:true,
    }
}

async function connect(){
    try{
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (err){
        console.error("Erro ao conectar no DB: ", err);
        throw err;
    }
}

module.exports = {connect, sql};