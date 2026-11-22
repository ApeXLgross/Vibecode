> **Hinweis:** Diese Dokumentation ist auf Deutsch verfasst.

# Dokumentation: Transaktionsverlauf eines Studentenkontos

Die Datei `realistic_student_adjusted_savings.csv` enthält Beispieltransaktionen eines Studentenkontos. Sie umfasst 139 Transaktionen vom 1. April bis zum 27. September 2026. Die Beträge sind in Euro angegeben.

## Spalten

| Spalte | Bedeutung |
| --- | --- |
| `Date` | Transaktionsdatum im Format `YYYY-MM-DD` |
| `Description` | Beschreibung der Transaktion, z. B. Miete, Mensa oder Einkauf |
| `Amount` | Transaktionsbetrag: Einnahmen sind positiv, Ausgaben sind negativ |
| `Balance` | Kontostand nach der jeweiligen Transaktion |
| `Category` | Kategorie der Buchung aus der CSV-Datei |

Die CSV-Datei verwendet für die Transaktionen fünf Kategorien: **Geldeingang**, **Essen, Trinken, Miete**, **Unterhaltung**, **Freizeit** und **Anderes**. Die statische HTML-Seite zeigt diese Kategorien direkt aus der CSV an.

## Überblick

- Der niedrigste gemeldete Kontostand beträgt **-33,04 €**.
- Der zuletzt gemeldete Kontostand am 27. September 2026 beträgt **2.097,64 €**.

Die Datei dient als Beispieldatensatz zur Analyse von Einnahmen, Ausgaben und Kontoständen. Das Dashboard in `index.html` lädt die CSV dynamisch und bietet Suche, Kategorie-, Typ-, Betrags- und Sortierfilter. Buchungszeilen sind anklickbar und markieren den zugehörigen Move am Chart; Datum, Betrag und Balance können über die Tabellenköpfe sortiert werden. Dazu kommen ein konstant langsamer 30-Sekunden-Kontostandsverlauf, Ereignismarker für größere Einnahmen und Ausgaben, Pause/Weiter mit aktuellem Datum, Kontostand und Buchung sowie ein Dark-/Light-Mode. Über **Bull Run starten** wird der Chart mit den Ereignissen als Spielstand-Animation abgespielt. Für weichere Auswahl-Effekte wird optional Anime.js per CDN geladen; ohne Internet bleibt der CSS-Fallback aktiv. Beim direkten Öffnen der HTML-Datei kann die CSV je nach Browser blockiert werden; dafür gibt es die Dateiauswahl **CSV laden**. Für den normalen automatischen Ladevorgang eignet sich ein lokaler Webserver.

## Module

- `app.js`: Initialisierung, Interaktionen, Filter und Skeet-Journey-Animation
- `js/data.js`: CSV-Laden, Parsen und Kennzahlen
- `js/state.js`: Such-, Kategorie- und Sortierzustand
- `js/render.js`: Kennzahlen, Kategorien, Events und Tabelle
- `js/charts.js`: animierter Canvas-Kontostandsverlauf mit Event-Markern
- `style.css`: responsive Game-UI, Themes und Animationen

Die Daten sind Beispieldaten und kein echter Kontoauszug.

## Profil und typische Transaktionen

Der Datensatz beschreibt das Konto einer studentischen Person. Als regelmäßige Einnahmequelle ist insbesondere eine Zahlung aus dem studentischen Umfeld, beispielsweise BAföG, Unterstützung durch die Familie oder ein Nebenjob, zu erwarten. Die konkreten Einnahmequellen lassen sich aus den vorliegenden Angaben jedoch nicht eindeutig bestimmen.

Zu den häufigsten Ausgaben gehören voraussichtlich die Miete sowie alltägliche Einkäufe, etwa in der Mensa oder im Supermarkt. Weitere Ausgaben können im Datensatz anhand der jeweiligen Beschreibung nachvollzogen werden. Diese Einschätzung basiert auf den Transaktionsbeschreibungen und stellt keine vollständige Auswertung der Ausgabenanteile dar.

Das Design befindet sich in der separaten Datei `style.css`. Die Daten sind Beispieldaten und kein echter Kontoauszug.