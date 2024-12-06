/*
import CryptoJS from 'crypto-js'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

export class AuthService {

    async register(data: RegisterDTO) {
        const { name, surname, email, password }: RegisterDTO = data;

        const userExist = await prisma.manager.findUnique(
            {
                where: {
                    email: email
                }
            }
        );

        const passwordCrypt = CryptoJS.AES.encrypt(password, process.env.SECRET as string).toString();

        if (!userExist) {
            return await prisma.manager.create({
                data: {
                    name: name,
                    surname: surname,
                    email: email,
                    password: passwordCrypt,
                }
            });
        }
    }

    async login(data: Login) {

        const { email, password } = data;

        const manager = await prisma.manager.findUnique(
            {
                where: {
                    email: email
                },
                select: {
                    id: true,
                    email: true,
                    password: true
                }
            }
        );
        if (manager) {
            var bytes = CryptoJS.AES.decrypt(manager.password, process.env.SECRET as string);
            const passwordDecrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (password !== passwordDecrypted) {
                throw new Error('Usuário e/ou senha inválido ');
            }

            const secret = process.env.SECRET

            const token = jwt.sign(
                {
                    id: manager.id
                },
                secret as string,
                {
                    expiresIn: '2 days'
                }
            );

            return { token: token };
        }
        else{
            throw new Error('Usuário inexistente');
        }
    }

} */