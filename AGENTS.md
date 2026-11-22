# Hinweise für Agenten

## Projekt

Dieses Verzeichnis enthält einen Beispieldatensatz zu studentischen Kontobewegungen und eine statische Website zur Anzeige und Auswertung der Buchungen.

- `realistic_student_adjusted_savings.csv`: Buchungsdaten mit den Spalten `Date`, `Description`, `Amount` und `Balance`.
- `index.html`: eigenständige Website, die die CSV lädt und Kennzahlen, Kontostandsverlauf, Ausgabenkategorien sowie durchsuch- und filterbare Buchungen anzeigt.
- `README.md`: deutschsprachige Beschreibung des Datensatzes und seiner Spalten.

## Dokumentation

- Schreibe und aktualisiere die Projektdokumentation auf Deutsch.
- Behalte die ursprünglichen englischen CSV-Spaltennamen in der Datendatei bei. Erkläre sie bei Bedarf auf Deutsch, statt das CSV-Schema ohne ausdrücklichen Auftrag zu ändern.
- Stelle die Beispieldaten nicht als echte Kontoauszüge oder echte persönliche Finanzdaten dar.
- Prüfe Kennzahlen wie Buchungsanzahl, Zeitraum und Kontostände anhand der CSV, bevor du sie in der Dokumentation angibst.
- Halte die README kurz und auf den tatsächlichen Inhalt der Dateien abgestimmt.

## Änderungen an der Website

- Halte die Website statisch und vermeide zusätzliche Abhängigkeiten, sofern sie nicht ausdrücklich benötigt werden.
- Die CSV wird relativ zur `index.html` geladen. Bewahre diesen Zusammenhang und den Dateinamen, oder aktualisiere die Ladefunktion, falls sich die Datei ändert.
- Ein lokaler Webserver ermöglicht das automatische Laden der CSV. Beim direkten Öffnen der HTML-Datei kann der Browser den Zugriff blockieren; die Seite bietet dafür eine Dateiauswahl als Ausweichmöglichkeit.
- Achte darauf, dass Darstellung und Bedienelemente auch auf schmalen Bildschirmen funktionieren.

## Änderungsprotokoll

Trage jede Änderung an Projektdateien in diesem Abschnitt ein. Ergänze bei jeder künftigen Änderung das Datum, die betroffenen Datei(en) und eine kurze Beschreibung. Fasse zusammengehörige Änderungen in einem Eintrag zusammen.

- 2026-10-29 — `README.md`: Deutsche Dokumentation zu Datensatz, Spalten und Kennzahlen ergänzt.
- 2026-10-29 — `index.html`: Statisches Dashboard mit Kennzahlen, Kontostandsverlauf, Ausgabenkategorien, Buchungsfiltern und CSV-Export erstellt.
- 2026-10-29 — `AGENTS.md`: Deutsche Projekt- und Dokumentationshinweise angelegt.
- 2026-10-29 — `AGENTS.md`: Regel zum Änderungsprotokoll ergänzt und bisherige Projektänderungen eingetragen.
- 2026-11-08 — `index.html`, `realistic_student_adjusted_savings.csv`: Arbeitgebername in den Geldeingängen durch „Braun Food Services GmbH“ ersetzt.
- 2026-11-08 — `index.html`, `style.css`, `app.js`, `js/`: Interaktives, modulares Finanz-Dashboard mit Charts, Filtern, Journey-Animation und Themes erstellt.
- 2026-11-08 — `index.html`, `style.css`, `app.js`, `js/state.js`: Skeet-Run im Chart mit Figur, Ballon-Effekten, Ursachen-Popups sowie Typ- und Betragsfiltern ergänzt.
- 2026-11-08 — `index.html`, `style.css`, `app.js`: Anime-Läufer detailliert, Kurvenlauf verlangsamt und Abschluss exakt am Datenpunkt 27.09.2026 fixiert.
- 2026-11-08 — `index.html`, `style.css`: Anime-inspirierte Bullenfigur mit Hörnern, Ohren, Schnauze und Gallop-Animation ergänzt.
- 2026-11-08 — `app.js`, `style.css`, `js/charts.js`: Bull Run auf 24 Sekunden verlangsamt und Smile-/Cry-Ballonreaktionen für Gehalt, Miete und Versicherung ergänzt.
- 2026-11-08 — `index.html`, `app.js`, `js/render.js`, `style.css`: Buchungstabelle klickbar und über Datum, Betrag und Balance sortierbar gemacht; Anime.js optional für Auswahl-Effekte eingebunden.
- 2026-11-08 — `index.html`, `app.js`, `js/charts.js`, `style.css`: Bull Run auf konstant langsame 30 Sekunden umgestellt und Pause/Weiter mit aktuellem Datum, Kontostand und Buchung ergänzt.
- 2026-11-08 — `app.js`: Bull Run nach dem Abschluss zurücksetzbar gemacht, sodass ein zweiter Lauf erneut ab dem Startdatum beginnt.
- 2026-11-08 — `style.css`: iPad-inspirierte, abgerundete Oberflächen sowie weichere Schatten und taktile Button-Zustände ergänzt.
- 2026-11-08 — `app.js`, `style.css`: Drittes Schwarz-Weiss-Theme mit zyklischem Theme-Button ergänzt.
- 2026-11-14 — `app.js`, `js/charts.js`, `js/data.js`, `js/render.js`, `style.css`: Bull-Run-Feedback mit Emojis und klaren Ereignistexten verbessert; Kontostandschart um Achsenwerte und aktuelle Markierung ergänzt sowie Fortschrittsanzeige am tatsächlichen Kontostandsbereich ausgerichtet.
- 2026-11-14 — `index.html`, `style.css`: Kontostandslauf als Balance-Slalom gestaltet, mit Snowboard, Pistenstruktur und deutlich höher fliegenden Emoji-Reaktionen ergänzt.
- 2026-11-14 — `style.css`: Laufende Figur als Snowboarder mit Helm, reflektierender Skibrille, Jacke, Boots, Board und Schneespray neu gestaltet.
- 2026-11-14 — `app.js`, `js/state.js`: Buchungstabelle um dynamische Zeitfilter für einzelne Monate und Kalenderwochen ergänzt.
- 2026-11-14 — `app.js`, `style.css`: Pause-Checkpoint mit Datum, Kontostand sowie Einnahmen und Ausgaben des aktuellen Tages ergänzt; Snowboarder-Animationen pausieren vollständig mit.
- 2026-11-14 — `app.js`, `style.css`: Ständige Verbrauchsanzeige mit Tages- und Wochenkosten, Vergleichswerten und batterieartigen Balken zur Missionskarte hinzugefügt.
- 2026-11-22 — `index.html`, `AGENTS.md`: Ungültige Zeichen vor und nach dem HTML-Starttag entfernt und Änderung dokumentiert.
- 2026-11-22 — `.gitignore`, `AGENTS.md`, Git-Verknüpfung `my`: Defekte Submodul-Referenz entfernt und lokalen, separaten Ordner `my/` vom Webseiten-Repository ausgeschlossen, damit GitHub Pages bauen kann.
- 2026-11-22 — `index.html`, `README.md`, `AGENTS.md`: Sichtbaren Hinweis ergänzt, dass Transaktionen KI-generiert und frei erfunden sind; Excel-Datei als Voraussetzung ausgeschlossen und CSV-Datei benannt.
