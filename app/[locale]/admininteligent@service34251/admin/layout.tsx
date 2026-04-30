import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Definim params ca fiind un Promise
}) {
  // 1. Așteptăm rezolvarea parametrilor (FOARTE IMPORTANT în Next.js 15)
  const { locale } = await params;

  // 2. Așteptăm cookies
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  // 3. VERIFICAREA DE SECURITATE
  if (session !== "true") {
    console.log(`[AUTH] Acces refuzat pe limba ${locale}. Redirecționare...`);
    
    // Redirecționăm către admin-ul curent
    redirect(`/${locale}/admin`);
  }

  // 4. Dacă totul e OK, afișăm interfața de admin
  return (
    <div className="admin-layout-wrapper">
      {children}
    </div>
  );
}