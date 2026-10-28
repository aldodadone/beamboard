# BeamBoard

**Presentazioni LaTeX guidate, senza conoscere LaTeX.**

BeamBoard crea presentazioni Beamer con una procedura guidata in italiano: si sceglie che cosa mostrare (alcuni punti, un confronto, una foto, una formula…), si risponde a qualche domanda e la slide si compone da sola, con un’anteprima vera del PDF finale.

Tutto avviene nel browser: il motore LaTeX gira sul computer di chi la usa, i testi e le immagini non vengono inviati da nessuna parte, e dopo la prima apertura funziona anche senza internet. Funziona al meglio con Chrome, Edge, Vivaldi o Brave.

## Cosa sa fare

- Dodici tipi di slide, ognuno con la sua procedura guidata, riapribile in qualsiasi momento.
- Elementi da combinare: testi, elenchi (anche a comparsa), immagini, riquadri, tabelle, citazioni e formule.
- Un editor visuale per le formule, con tastiera di simboli in italiano.
- Otto temi, sette colori, cinque caratteri, formato 16:9 o 4:3.
- Salvataggio automatico su un file `.beamboard` del computer.
- Installabile come applicazione e utilizzabile offline.

**Provala:** [aldodadone.github.io/beamboard](https://aldodadone.github.io/beamboard/)

## Come è fatto questo repository

| Percorso | Contenuto |
|---|---|
| `index.html` | BeamBoard |
| `aiuto.html`, `crediti.html` | Guida e crediti |
| `css/`, `js/`, `img/` | Stili, codice dell’interfaccia e del generatore di slide, icone e anteprime dei temi |
| `engine/` | Il motore LaTeX (SwiftLaTeX modificato) e il pacchetto compresso dei file TeX |
| `vendor/` | PDF.js e MathLive |
| `sw.js`, `manifest.webmanifest` | Funzionamento offline e installazione |

## Come si pubblica

Il sito è pubblicato con GitHub Pages direttamente da questo repository: in *Settings → Pages* la voce *Source* è impostata su *Deploy from a branch*, ramo `main`, cartella `/ (root)`. A ogni modifica il sito si aggiorna da solo in un paio di minuti.

## Come si aggiorna

1. Estrai la nuova versione sul computer e apri la cartella `beamboard`.
2. Nel repository premi *Add file → Upload files* e trascina nella pagina **il contenuto** della cartella: file e sottocartelle, non la cartella stessa. I file con lo stesso nome vengono sostituiti.
3. Se nella cartella `engine/` il pacchetto `tex-….bin.gz` ha cambiato nome, elimina quello vecchio.
4. Premi *Commit changes*.

Chi sta già usando BeamBoard vedrà un avviso con il pulsante *Aggiorna ora*. Il caricamento dal sito di GitHub accetta file fino a 25 MB: il pacchetto dei file TeX ci sta, di poco.

## Licenza

BeamBoard è software libero, distribuito con licenza **GNU Affero General Public License v3.0**: vedi il file `LICENSE`. Il motore LaTeX deriva da [SwiftLaTeX](https://github.com/SwiftLaTeX/SwiftLaTeX), anch’esso AGPL-3.0. Gli altri componenti e i caratteri hanno licenze libere compatibili, elencate in `crediti.html`.
