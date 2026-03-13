import { NextResponse } from "next/server";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

function getNextMonthDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Dados incompletos" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: "A senha deve ter pelo menos 8 caracteres" },
                { status: 400 }
            );
        }

        // Verifica se email já existe
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "E-mail já está em uso" },
                { status: 400 }
            );
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o usuário e inicializa créditos em uma transação
        const user = await db.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            await tx.credit.create({
                data: {
                    userId: newUser.id,
                    balance: 10,
                    resetAt: getNextMonthDate(),
                },
            });

            return newUser;
        });

        // Envia e-mail de boas-vindas (não bloqueia a resposta)
        if (user.email) {
            sendWelcomeEmail(user.email, user.name);
        }

        return NextResponse.json(
            { message: "Conta criada com sucesso", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro no registro:", error);
        return NextResponse.json(
            { message: "Erro ao criar conta" },
            { status: 500 }
        );
    }
}
