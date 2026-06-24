import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const LAST_UPDATE = "20 juin 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl p-6 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour
      </Link>

      <header className="space-y-2">
        <h1 className="text-[22px] font-medium">Politique de confidentialité</h1>
        <p className="text-xs text-muted-foreground">
          Dernière mise à jour : {LAST_UPDATE}
        </p>
      </header>

      <section className="space-y-2">
        <p className="text-sm leading-relaxed">
          Fueli est un service de suivi nutritionnel qui fonctionne uniquement
          si tu nous confies certaines informations sur ta santé. Cette page
          explique précisément quelles données on collecte, à quoi elles
          servent, combien de temps on les garde et comment tu peux les
          contrôler.
        </p>
      </section>

      <Section title="1. Responsable du traitement">
        <p>
          Les données collectées via Fueli sont traitées par l&apos;équipe
          Fueli. Pour toute question liée à tes données, contacte-nous à
          l&apos;adresse email associée à ton compte.
        </p>
      </Section>

      <Section title="2. Données collectées à l'inscription">
        <List
          items={[
            "Adresse email — utilisée uniquement pour t'identifier et te permettre de réinitialiser ton mot de passe. Aucun usage marketing.",
            "Mot de passe — chiffré par Supabase Auth (jamais stocké en clair, jamais accessible par nous).",
            "Prénom, nom — pour personnaliser l'expérience.",
            "Âge, sexe, poids, taille — strictement nécessaires au calcul de ton objectif calorique journalier (formule Mifflin-St Jeor).",
            "Objectif (perte / masse / équilibre) et niveau d'activité physique — pour ajuster ton objectif calorique.",
            "Horodatage du consentement RGPD — preuve que tu as accepté ce traitement.",
          ]}
        />
      </Section>

      <Section title="3. Données collectées pendant l'utilisation">
        <List
          items={[
            "Repas enregistrés (aliments, portions estimées, calories, macros, date et heure).",
            "Mises à jour de poids — horodatées pour permettre le suivi de progression.",
          ]}
        />
        <p className="mt-3">
          <strong>Photos de repas :</strong> elles sont transmises à
          l&apos;API OpenAI (GPT-4o Mini) pour analyse, puis immédiatement
          libérées. <strong>Aucune photo n&apos;est conservée par Fueli.</strong>{" "}
          Seul le résultat de l&apos;analyse (aliments identifiés + valeurs
          nutritionnelles estimées) est enregistré dans ton journal.
        </p>
      </Section>

      <Section title="4. Pourquoi on collecte ces données">
        <List
          items={[
            "Calculer ton objectif calorique personnalisé.",
            "Afficher ton bilan nutritionnel quotidien et ton historique.",
            "Analyser les photos de repas que tu envoies via le scan IA.",
            "Te permettre de te connecter de façon sécurisée.",
          ]}
        />
        <p className="mt-3">
          Fueli applique le principe de <strong>minimisation</strong> : aucune
          donnée de localisation, aucun tracking comportemental, aucun
          partenaire publicitaire, aucune revente de données.
        </p>
      </Section>

      <Section title="5. Avec qui ces données sont partagées">
        <List
          items={[
            "Supabase — hébergement de la base de données et système d'authentification (serveurs en Union Européenne).",
            "OpenAI — analyse des photos de repas (image transmise puis libérée, jamais stockée chez OpenAI au-delà du traitement temporaire).",
            "Open Food Facts — recherche d'aliments et lookup code-barre. Aucune donnée personnelle ne lui est transmise, uniquement le terme recherché.",
            "Vercel — hébergement de l'application web.",
          ]}
        />
        <p className="mt-3">
          Aucune donnée n&apos;est partagée avec des tiers à des fins
          publicitaires ou commerciales.
        </p>
      </Section>

      <Section title="6. Durée de conservation">
        <p>
          Tes données sont conservées tant que ton compte existe. Si tu
          supprimes ton compte depuis l&apos;app (section Profil), toutes tes
          données personnelles, repas et historiques sont définitivement
          effacés des serveurs Fueli sous un délai maximum de 30 jours.
        </p>
      </Section>

      <Section title="7. Tes droits">
        <p>
          Conformément au RGPD, tu disposes des droits suivants, exerçables
          directement depuis l&apos;app :
        </p>
        <List
          items={[
            "Droit d'accès — consulter toutes les données associées à ton compte depuis la page Profil.",
            "Droit de rectification — modifier ces données depuis la page Profil > Modifier.",
            "Droit à l'effacement — supprimer définitivement ton compte et toutes tes données depuis Profil > Supprimer mon compte.",
            "Droit à la portabilité — sur demande à notre équipe.",
            "Droit d'opposition et de limitation — sur demande à notre équipe.",
          ]}
        />
        <p className="mt-3">
          Si tu estimes que tes droits ne sont pas respectés, tu peux saisir
          la <strong>CNIL</strong> à l&apos;adresse{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            www.cnil.fr
          </a>
          .
        </p>
      </Section>

      <Section title="8. Sécurité">
        <p>
          Toutes les communications avec l&apos;app sont chiffrées en HTTPS.
          Les mots de passe sont hashés par Supabase Auth. L&apos;accès à ta
          ligne de profil et à tes repas en base est restreint par des
          politiques d&apos;isolation (Row Level Security) — un utilisateur ne
          peut accéder qu&apos;à ses propres données.
        </p>
      </Section>

      <Section title="9. Modifications de cette politique">
        <p>
          Si nous mettons à jour cette politique, la date en haut de page sera
          modifiée. Pour les changements substantiels qui affecteraient la
          façon dont tes données sont traitées, nous te notifierons par email
          avant l&apos;entrée en vigueur.
        </p>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-[18px] font-medium">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="ml-5 list-disc space-y-1 marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
