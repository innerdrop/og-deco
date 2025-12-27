import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "@/components/auth/login-form";

export default async function AdminPage() {
    const session = await auth();
    if (session) {
        redirect("/admin/dashboard");
    }
    return <LoginForm />;
}
