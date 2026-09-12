import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/onboarding",
  "/auth",
  "/legal",
  "/forgot-password",
  "/reset-password",
];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/today";
    return NextResponse.redirect(url);
  }

  // Vérification onboarding pour les routes protégées (hors /onboarding).
  // Optimisation latence : une fois l'onboarding vérifié, on pose un cookie
  // `fueli_ob` = user.id. Tant qu'il correspond à l'utilisateur courant, on
  // saute la requête DB `profiles` à chaque navigation (elle renvoie toujours
  // la même chose une fois onboardé). Un changement de compte invalide
  // automatiquement le cookie (mismatch d'id) → la vérif DB est refaite.
  if (user && !isPublic && !pathname.startsWith("/onboarding")) {
    const alreadyChecked = request.cookies.get("fueli_ob")?.value === user.id;

    if (!alreadyChecked) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed_at")
        .eq("id", user.id)
        .single();

      if (!profile?.onboarding_completed_at) {
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      }

      // Onboarding confirmé : mémorise-le pour les prochaines navigations
      response.cookies.set("fueli_ob", user.id, {
        maxAge: 60 * 60 * 24 * 30, // 30 jours
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }
  }

  return response;
}
