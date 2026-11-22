# Vibecode

> **Hinweis:** Diese Dokumentation ist auf Deutsch verfasst.

# Dokumentation: Transaktionsverlauf eines Studentenkontos

Die Datei `realistic_student_adjusted_savings.csv` enthält KI-generierte, frei erfundene Beispieltransaktionen. Sie stammen nicht aus einem echten Konto und sind kein echter Kontoauszug. Die Beispieldatei umfasst 139 Einträge vom 1. April bis zum 27. September 2026. Die Beträge sind in Euro angegeben.

## Spalten

| Spalte | Bedeutung |
| --- | --- |
| `Date` | Transaktionsdatum im Format `YYYY-MM-DD` |
| `Description` | Beschreibung der Transaktion, z. B. Miete, Mensa oder Einkauf |
| `Amount` | Transaktionsbetrag: Einnahmen sind positiv, Ausgaben sind negativ |
| `Balance` | Kontostand nach der jeweiligen Transaktion |
| `Category` | Kategorie der Buchung auf dem Konto |

Die CSV-Datei verwendet für die Transaktionen fünf Kategorien: **Geldeingang**, **Essen, Trinken, Miete**, **Unterhaltung**, **Freizeit** und **Anderes**. Die statische HTML-Seite zeigt diese Kategorien direkt aus der CSV an.

## Überblick

- Der niedrigste gemeldete Kontostand beträgt **-33,04 €**.
- Der zuletzt gemeldete Kontostand am 27. September 2026 beträgt **2.097,64 €**.

Die Seite lädt die CSV-Datei `realistic_student_adjusted_savings.csv`; eine Excel-Datei wird nicht benötigt. Sie bietet Suche, Kategorie-, Typ-, Betrags- und Sortierfilter, einen animierten Kontostandsverlauf, Ereignismarker, Pause/Weiter und einen Dark-/Light-Mode. Falls der automatische CSV-Ladevorgang beim direkten Öffnen der HTML-Datei blockiert wird, kann die CSV über **CSV laden** ausgewählt werden. Die dargestellten Beträge, Namen und Kontostände sind ausschließlich KI-generierte Beispieldaten.

## Module

- `app.js`: Initialisierung, Interaktionen, Filter und Skeet-Journey-Animation
- `js/data.js`: CSV-Laden, Parsen und Kennzahlen
- `js/state.js`: Such-, Kategorie- und Sortierzustand
- `js/render.js`: Kennzahlen, Kategorien, Events und Tabelle
- `js/charts.js`: animierter Canvas-Kontostandsverlauf mit Event-Markern
- `style.css`: responsive Game-UI, Themes und Animationen

Alle Transaktionen und Kontostände sind KI-generiert und frei erfunden. Sie stellen keine echten Finanzdaten und keinen echten Kontoauszug dar.
