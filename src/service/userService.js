import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import bluebird from 'bluebird';
import db from '../models/index'


//Create the connection, specify bluebird as Promise

const salt = bcrypt.genSaltSync(10);



const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const createNewUser = async (email, password, username) => {
    let hashPass = hashUserPassword(password);

    try {
        await db.User.create({
            username: username,
            email: email,
            password: hashPass
        })
    } catch (error) {
        console.log(">>> Check error", error)
    }

}
const getUserList = async () => {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });

    let user = [];

    try {
        const [rows, fields] = await connection.execute(' Select * from user ');
        return rows;
    } catch (error) {
        console.log(">>>Check error", error);
    }



}

const deleteUser = async (id) => {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });
    let user = [];
    try {
        const [rows, fields] = await connection.execute('DELETE FROM user WHERE id= ?', [id]);
        return rows;
    } catch (error) {
        console.log(">>>Check error", error);
    }
}

const getuserById = async (id) => {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });
    let user = [];
    try {
        const [rows, fields] = await connection.execute('Select  * FROM user WHERE id= ?', [id]);
        return rows;
    } catch (error) {
        console.log(">>>Check error", error);
    }
}
const updateUserInfo = async (email, username, id) => {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });
    // let user = [];
    try {
        const [rows, fields] = await connection.execute('UPDATE user SET email = ?, username = ? WHERE id = ?', [email, username, id]);
        return rows;
    } catch (error) {
        console.log(">>>Check error", error);
    }
}
module.exports = {
    createNewUser, getUserList, deleteUser, getuserById, updateUserInfo
}