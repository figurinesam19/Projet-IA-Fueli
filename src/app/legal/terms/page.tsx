import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const LAST_UPDATE = "25 juin 2026";

export default function TermsPage() {
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
        <h1 className="text-[22px] font-medium">
          Conditions Générales d&apos;Utilisation
        </h1>
        <p className="text-xs text-muted-foreground">
          Dernière mise à jour : {LAST_UPDATE}
        </p>
      </header>

      <section className="space-y-2">
        <p className="text-sm leading-relaxed">
          Les présentes Conditions Générales d&apos;Utilisation (CGU)
          définissent les règles d&apos;accès et d&apos;utilisation du service
          Fueli. En créant un compte ou en utilisant l&apos;application, tu
          acceptes ces conditions dans leur intégralité.
        </p>
      </section>

      <Section title="1. Éditeur du service">
        <p>
          Fueli est un service web de suivi nutritionnel disponible à
          l&apos;adresse <strong>fueli.app</strong>. Le service est édité par
          l&apos;équipe Fueli. Pour tout contact, utilise l&apos;adresse email
          associée à ton compte.
        </p>
      </Section>

      <Section title="2. Acceptation des CGU">
        <p>
          L&apos;utilisation du service implique l&apos;acceptation pleine et
          entière des présentes CGU. Si tu n&apos;acceptes pas ces conditions,
          tu ne dois pas utiliser Fueli. Ces CGU sont accessibles à tout moment
          depuis l&apos;application.
        </p>
        <p>
          Fueli se réserve le droit de modifier ces CGU à tout moment. La
          version applicable est celle en vigueur à la date d&apos;utilisation
          du service. En cas de modification substantielle, tu seras notifié par
          email avant l&apos;entrée en vigueur de la nouvelle version.
        </p>
      </Section>

      <Section title="3. Description du service">
        <p>
          Fueli est une application de suivi nutritionnel personnel. Elle
          permet de :
        </p>
        <List
          items={[
            "Calculer un objectif calorique journalier personnalisé (formule Mifflin-St Jeor).",
            "Enregistrer des repas par photo (analyse IA), recherche texte ou scan de code-barre.",
            "Visualiser son bilan nutritionnel quotidien et son historique.",
            "Consulter des articles sur la nutrition et les bases de l'alimentation.",
          ]}
        />
        <p>
          Fueli est un outil d&apos;aide à la prise de conscience
          nutritionnelle. Il ne constitue pas un conseil médical ou diététique
          professionnel. En cas de problème de santé, consulte un professionnel
          de santé qualifié.
        </p>
      </Section>

      <Section title="4. Création de compte">
        <p>
          L&apos;accès aux fonctionnalités de Fueli nécessite la création
          d&apos;un compte. Tu t&apos;engages à :
        </p>
        <List
          items={[
            "Fournir des informations exactes lors de l'inscription (âge, poids, taille, etc.) — la précision de ces données conditionne la fiabilité de ton objectif calorique.",
            "Ne créer qu'un seul compte par personne.",
            "Ne pas partager tes identifiants de connexion.",
            "Mettre à jour tes informations si elles changent de façon significative.",
          ]}
        />
        <p>
          Tu es seul responsable des activités réalisées depuis ton compte.
          Toute utilisation frauduleuse doit être signalée immédiatement.
        </p>
      </Section>

      <Section title="5. Conditions d'utilisation">
        <p>Tu t&apos;engages à utiliser Fueli de manière conforme à sa destination et à ne pas :</p>
        <List
          items={[
            "Tenter d'accéder aux données d'un autre utilisateur.",
            "Tenter de contourner les mécanismes de sécurité ou d'authentification.",
            "Utiliser le service à des fins commerciales sans autorisation préalable.",
            "Transmettre des contenus illicites, offensants ou portant atteinte à des droits tiers via les fonctionnalités de l'app.",
            "Utiliser des scripts ou outils automatisés pour solliciter l'API de façon abusive.",
          ]}
        />
      </Section>

      <Section title="6. Données personnelles">
        <p>
          Le traitement de tes données personnelles est décrit dans notre{" "}
          <Link
            href="/legal/privacy"
            className="text-primary underline-offset-4 hover:underline"
          >
            Politique de confidentialité
          </Link>
          , qui fait partie intégrante des présentes CGU. En acceptant ces CGU,
          tu acceptes également cette politique.
        </p>
        <p>
          Les données de santé que tu renseignes (poids, taille, objectifs)
          sont considérées comme des données sensibles au sens du RGPD. Leur
          traitement repose sur ton consentement explicite, recueilli lors de
          l&apos;onboarding.
        </p>
      </Section>

      <Section title="7. Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments constituant Fueli — code source,
          design, textes, logo, articles — est la propriété exclusive de
          l&apos;équipe Fueli et est protégé par les lois relatives à la
          propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, distribution ou modification sans autorisation
          écrite préalable est interdite.
        </p>
        <p>
          Les données nutritionnelles issues d&apos;
          <a
            href="https://world.openfoodfacts.org"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Open Food Facts
          </a>{" "}
          sont soumises à la licence{" "}
          <a
            href="https://opendatacommons.org/licenses/odbl/"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Open Database License (ODbL)
          </a>
          .
        </p>
      </Section>

      <Section title="8. Limitation de responsabilité">
        <p>
          Fueli est fourni «&nbsp;en l&apos;état&nbsp;». L&apos;équipe Fueli
          s&apos;efforce de maintenir le service disponible et fiable, mais ne
          garantit pas :
        </p>
        <List
          items={[
            "L'exactitude des valeurs nutritionnelles estimées par l'analyse IA — les résultats sont des estimations et ne remplacent pas un étiquetage officiel.",
            "La disponibilité continue du service sans interruption ni erreur.",
            "L'adéquation des recommandations caloriquesgénérées à une situation médicale particulière.",
          ]}
        />
        <p>
          En aucun cas l&apos;équipe Fueli ne saurait être tenue responsable
          des décisions alimentaires ou de santé prises sur la base des données
          affichées dans l&apos;application.
        </p>
      </Section>

      <Section title="9. Suspension et résiliation">
        <p>
          Tu peux supprimer ton compte à tout moment depuis la section{" "}
          <strong>Profil → Supprimer mon compte</strong>. Cette action efface
          définitivement toutes tes données conformément à notre politique de
          confidentialité.
        </p>
        <p>
          Fueli se réserve le droit de suspendre ou résilier un compte sans
          préavis en cas de violation grave des présentes CGU (tentative
          d&apos;accès non autorisé, usage abusif de l&apos;API, etc.).
        </p>
      </Section>

      <Section title="10. Droit applicable">
        <p>
          Les présentes CGU sont régies par le droit français. Tout litige
          relatif à leur interprétation ou leur exécution relève de la
          compétence des tribunaux français.
        </p>
        <p>
          Si une clause des présentes CGU était déclarée nulle ou inapplicable,
          les autres clauses demeureraient en vigueur.
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
