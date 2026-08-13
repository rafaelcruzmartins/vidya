# VIDYA Media Server — add-on do Home Assistant

Servidor auto-hospedado para cursos e videoaulas, com as correções dos
materiais complementares, do arranque e das travas do SQLite, e com a
interface revisada.

A imagem é compilada pelo GitHub e publicada em
`ghcr.io/rafaelcruzmartins/vidya`. O Home Assistant apenas baixa a imagem
pronta — não compila nada no seu equipamento.

## Instalação

1. **Configurações → Complementos → Loja de complementos**.
2. Menu **⋮** no canto superior direito → **Repositórios**.
3. Cole a URL abaixo e clique em **Adicionar**:

   ```
   https://github.com/rafaelcruzmartins/vidya
   ```

4. Feche a janela e recarregue a página. O **VIDYA Media Server** aparece
   numa seção com o nome do repositório.
5. Abra e clique em **Instalar**.

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
grupo vira a aula; os demais arquivos reconhecidos viram anexos. Se o grupo
não tiver vídeo, o primeiro documento vira a aula e o restante fica anexado.

Extensões reconhecidas:

- vídeo: `.mp4` `.mkv` `.avi` `.mov`
- material: `.pdf` `.zip` `.txt` `.md` `.html`
- legenda: `.vtt` `.srt`

Arquivos `.ts` não são reconhecidos. Converta com
`ffmpeg -i entrada.ts -c copy saida.mp4`.

## Atualizações

Quando houver versão nova, o Home Assistant mostra o botão **Atualizar**
sozinho no add-on. Não é preciso copiar arquivo nenhum.

## Atenção após atualizar

As aulas já cadastradas guardam os anexos no banco. Para que os materiais
apareçam, rode uma nova varredura em **Settings → Scan Folders** dentro do
VIDYA.
