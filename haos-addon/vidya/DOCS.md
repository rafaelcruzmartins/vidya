# VIDYA Media Server — add-on do Home Assistant

Add-on local que usa a imagem publicada em
`ghcr.io/rafaelcruzmartins/vidya`, já com as correções dos materiais
complementares aplicadas.

O código-fonte fica no repositório privado; apenas a imagem compilada é
pública. O Home Assistant não compila nada — só baixa a imagem pronta.

## Instalação

1. Pelo Samba, abra o compartilhamento `addons` e crie a pasta `vidya`.
2. Copie para dentro dela os quatro arquivos desta pasta do repositório
   (`haos-addon/vidya`): `config.yaml`, `DOCS.md`, `icon.png` e `logo.png`.
   Nada além disso — o código-fonte não precisa ser copiado.
3. No Home Assistant: **Configurações → Complementos → Loja de complementos →
   ⋮ (canto superior direito) → Verificar atualizações**.
4. O add-on **VIDYA Media Server** aparece em *Complementos locais*. Abra e
   clique em **Instalar**.

## Configuração

Não há opções a preencher. Depois de iniciar, acesse:

```
http://IP_DO_HAOS:31415
```

No assistente inicial, informe a pasta raiz dos cursos:

```
/media/Yoga/Cursos
```

## Pastas disponíveis dentro do add-on

| Caminho  | Conteúdo                                      |
| -------- | --------------------------------------------- |
| `/media` | compartilhamento *media* do Home Assistant    |
| `/share` | compartilhamento *share* do Home Assistant    |
| `/data`  | banco SQLite e assets (persistente do add-on) |

## Estrutura esperada das pastas

O VIDYA lê exatamente três níveis. Subpastas dentro de uma seção são ignoradas.

```
/media/Yoga/Cursos/
└── Curso de Grego/
    ├── 00. Módulo Preliminar/
    │   ├── 00. Material Didático de Grego.mp4
    │   ├── 00. Athenaze.pdf
    │   └── 00. Material Didático.zip
    └── 01. Primeira Unidade/
        └── 01. Primeira aula.mp4
```

Arquivos com o mesmo prefixo numérico formam uma aula. O primeiro vídeo do
grupo vira a aula; os demais arquivos reconhecidos viram anexos. Se o grupo não
tiver vídeo, o primeiro documento vira a aula e o restante fica anexado.

Extensões reconhecidas:

- vídeo: `.mp4` `.mkv` `.avi` `.mov`
- material: `.pdf` `.zip` `.txt` `.md` `.html`
- legenda: `.vtt` `.srt`

Arquivos `.ts` não são reconhecidos. Converta com
`ffmpeg -i entrada.ts -c copy saida.mp4`.

## Como as atualizações funcionam

Quando o código muda no repositório, o GitHub compila a imagem nova sozinho e
a publica com o número de versão que está no `config.yaml` deste add-on.

Para receber a atualização no Home Assistant, edite pelo Samba o arquivo
`addons/vidya/config.yaml` e coloque o mesmo número de versão que foi
publicado. Depois use **Verificar atualizações** e o botão **Atualizar** que
aparece no add-on.

A versão publicada mais recente aparece em
**GitHub → seu perfil → Packages → vidya**.

## Atenção após atualizar

As aulas já cadastradas guardam os anexos no banco. Para que os materiais
apareçam, rode uma nova varredura em **Settings → Scan Folders** dentro do
VIDYA.
