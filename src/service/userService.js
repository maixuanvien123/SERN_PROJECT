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
    // test relationship
    let newUser = await db.User.findOne({
        where: { id: 1 },
        attributes: ["id", "username", "email"],
        include: { model: db.Group, attributes: ["name", "description"] },
        raw: true,
        nest: true
    })

    // let roles = await db.Group.findOne({
    //     where: { id: 1 },
    //     include: { model: db.Role },
    //     raw: true,
    //     nest: true
    // })

    let r = await db.Role.findAll({
        include: { model: db.Group,  where: { id: 1 } },
        raw: true,
        nest: true
    })

    console.log(">>> CHECK NEW USER", newUser)
    console.log(">>> CHeck new roles", r)




    let users = [];
    users = await db.User.findAll();
    return users;
    // const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });

    // let user = [];

    // try {
    //     const [rows, fields] = await connection.execute(' Select * from user ');
    //     return rows;
    // } catch (error) {
    //     console.log(">>>Check error", error);
    // }

}

const deleteUser = async (userId) => {
    await db.User.destroy({
        where: {
            id: { userId }
        }
    })
    // const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });
    // let user = [];
    // try {
    //     const [rows, fields] = await connection.execute('DELETE FROM user WHERE id= ?', [id]);
    //     return rows;
    // } catch (error) {
    //     console.log(">>>Check error", error);
    // }
}

const getuserById = async (id) => {
    let user = {};
    user = await db.User.findOne({
        where: { id: id }
    })
    // converting entity to plain object
    return user.get({ plain: true })
    // const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });
    // let user = [];
    // try {
    //     const [rows, fields] = await connection.execute('Select  * FROM user WHERE id= ?', [id]);
    //     return rows;
    // } catch (error) {
    //     console.log(">>>Check error", error);
    // }
}
const updateUserInfo = async (email, username, id) => {

    await db.User.update(
        { email: email, username: username },
        {
            where: { id: id }
        }
    );
    // const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird });
    // // let user = [];
    // try {
    //     const [rows, fields] = await connection.execute('UPDATE user SET email = ?, username = ? WHERE id = ?', [email, username, id]);
    //     return rows;
    // } catch (error) {
    //     console.log(">>>Check error", error);
    // }
}
module.exports = {
    createNewUser, getUserList, deleteUser, getuserById, updateUserInfo
}