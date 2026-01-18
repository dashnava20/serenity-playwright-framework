export const serenityCrew = [
  // Consola Serenity/JS
  '@serenity-js/console-reporter',

  // JSON para Serenity BDD CLI (reportes estáticos)
  [ '@serenity-js/serenity-bdd', { specDirectory: './specs' } ],

  // Archivo de artefactos (json + screenshots)
  [ '@serenity-js/core:ArtifactArchiver', { outputDirectory: './target/site/serenity' } ],
] as const;
