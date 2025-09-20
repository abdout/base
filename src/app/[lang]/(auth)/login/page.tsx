import { LoginForm } from "@/components/auth/login/form";
import { getDictionary } from "@/components/local/dictionaries";

export const dynamic = 'force-dynamic';

interface LoginPageProps {
  params: Promise<{
    lang: string;
  }>;
}

const LoginPage = async ({ params }: LoginPageProps) => {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);

  return (
    <LoginForm dictionary={dict} />
  );
}

export default LoginPage;