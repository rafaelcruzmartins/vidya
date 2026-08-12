# VIDYA Media Server — add-on do Home Assistant

Add-on local que compila o VIDYA a partir deste repositório, já com as
correções dos materiais complementares e a interface revisada.

O repositório é privado, então o Home Assistant compila a imagem localmente a
partir do código que você copia pelo Samba — sem depender de nenhum registro
externo.

## Instalação

1. Baixe este repositório como ZIP pelo GitHub (botão **Code → Download ZIP**).
2. Descompacte. O conteúdo vem dentro de uma pasta chamada `vidya-main`.
3. Pelo Samba, abra o compartilhamento `addons` e crie a pasta `vidya`.
4. Copie **todo o conteúdo** de `vidya-main` para dentro de `addons/vidya`.
   O `config.yaml` precisa ficar na raiz dessa pasta, ao lado do `Dockerfile`.
5. No Home Assistant: **Configurações → Complementos → Loja de complementos →
   ⋮ (canto superior direito) → Verificar atualizações**.
6. O add-on **VIDYA Media Server** aparece em *Complementos locais*. Abra e
   clique em **Instalar**.

A primeira instalação compila a aplicação e leva alguns minutos.

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

## Atualizando o add-on

Depois de alterar o código:

1. Baixe o ZIP novo e substitua os arquivos em `addons/vidya`.
2. Aumente o campo `version` no `config.yaml` (por exemplo, para `"1.0.4"`).
3. Em **Verificar atualizações**, o Home Assistant oferece a atualização.

## Atenção após atualizar

As aulas já cadastradas guardam os anexos no banco. Para que os materiais
apareçam, rode uma nova varredura em **Settings → Scan Folders** dentro do
VIDYA.
