import { Resend } from "resend";

const getResend = () => {
    const key = process.env.RESEND_API_KEY;
    if (!key || key.trim() === "" || key.includes("re_...")) return null;
    return new Resend(key);
};

export async function sendWelcomeEmail(email: string, name?: string | null) {
    const resend = getResend();
    if (!resend) {
        console.warn("Resend API key missing. Skipping welcome email.");
        return;
    }
    try {
        await resend.emails.send({
            from: "Nana Prompt <onboarding@resend.dev>",
            to: [email],
            subject: "Bem-vindo à Nana Prompt! ✨",
            html: `
        <h1>Olá, ${name || "Criador(a)"}!</h1>
        <p>Estamos muito felizes em ter você conosco na Nana Prompt.</p>
        <p>Você acaba de ganhar 10 créditos para começar a transformar suas ideias em arte.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/generate">Começar a criar agora</a></p>
      `,
        });
    } catch (error) {
        console.error("Failed to send welcome email:", error);
    }
}

export async function sendLowCreditsEmail(email: string, balance: number) {
    const resend = getResend();
    if (!resend) {
        console.warn("Resend API key missing. Skipping low credits email.");
        return;
    }
    try {
        await resend.emails.send({
            from: "Nana Prompt <alerts@resend.dev>",
            to: [email],
            subject: "Seus créditos estão acabando! ⏳",
            html: `
        <p>Você tem apenas <strong>${balance}</strong> créditos restantes.</p>
        <p>Não deixe sua criatividade parar! Faça um upgrade para continuar gerando imagens sem limites.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/#pricing">Ver Planos</a></p>
      `,
        });
    } catch (error) {
        console.error("Failed to send low credits email:", error);
    }
}

export async function sendUpgradeSuccessEmail(email: string, plan: string) {
    const resend = getResend();
    if (!resend) {
        console.warn("Resend API key missing. Skipping upgrade email.");
        return;
    }
    try {
        await resend.emails.send({
            from: "Nana Prompt <billing@resend.dev>",
            to: [email],
            subject: "Upgrade realizado com sucesso! 🎉",
            html: `
        <h1>Parabéns pelo seu novo plano ${plan}!</h1>
        <p>Seus novos créditos já foram adicionados à sua conta.</p>
        <p>Agora você tem acesso a gerações em alta qualidade e muito mais.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/generate">Voltar a criar</a></p>
      `,
        });
    } catch (error) {
        console.error("Failed to send upgrade email:", error);
    }
}
