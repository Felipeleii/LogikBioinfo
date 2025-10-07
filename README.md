# LogikBioinfo

Site estático do LogikBioinfo com informações sobre serviços, portfólio, publicações, ferramentas utilizadas e formulário de orçamento.

- Páginas: Sobre, Portfólio, Ferramentas, Publicações e Orçamento
- Tecnologias: HTML (conteúdo estático, sem dependências de build)

Se publicado via GitHub Pages, o site ficará disponível em: https://felipeleii.github.io/LogikBioinfo/ (ative em Settings &gt; Pages).

---

## Conteúdo do projeto

- <a>index.html</a> — Página inicial
- <a>Sobre.html</a> — Sobre o projeto/profissional
- <a>Portfolio.html</a> — Portfólio de trabalhos
- <a>Ferramentas.html</a> — Ferramentas e stack utilizadas
- <a>Publicacoes.html</a> — Lista de publicações
- <a>orcamento.html</a> — Página de orçamento/contato
- <a>felipe_lei.jpg</a> — Imagem do autor
- <a>img/</a> — Imagens auxiliares
- <a>portfolio/</a> — Recursos do portfólio
- <a>.gitignore</a> — Arquivo de ignorados do Git

Observação: Não há arquivos CSS/JS externos no repositório; estilos e scripts, se existentes, estão embutidos nas páginas.

---

## Como executar localmente

Como é um site estático, você pode:
- Abrir o arquivo `index.html` diretamente no navegador, ou
- Servir localmente com um servidor simples (recomendado para caminhos relativos):

Com Python 3:
```bash
python -m http.server 8000
# Abra http://localhost:8000 no navegador
```

---

## Publicar no GitHub Pages

1. Vá em Settings &gt; Pages.
2. Em "Build and deployment", selecione:
   - Source: Deploy from a branch
   - Branch: main, pasta root
3. Salve e aguarde a publicação.
4. Acesse: `https://<seu-usuario>.github.io/LogikBioinfo/`

Dica: Adicione um `CNAME` (opcional) se quiser domínio customizado.

---

## Melhorias sugeridas

- Responsividade completa (meta viewport, layout fluido, imagens responsivas)
- SEO: título e descrição consistentes em todas as páginas, meta tags Open Graph/Twitter
- Acessibilidade: textos alternativos para imagens, hierarquia de heading, contraste de cores
- Navegação: menu consistente entre páginas e destaque de página ativa
- Favicon e manifesto para PWA (opcional)
- Analytics (ex.: Plausible ou Google Analytics)
- Minificação de HTML/imagens (para performance)
- Centralizar estilos em um arquivo CSS externo

---

## Contribuindo

- Faça um fork do repositório
- Crie um branch para sua feature/fix: `git checkout -b minha-melhoria`
- Commit: `git commit -m "Descreva a mudança"`
- Push: `git push origin minha-melhoria`
- Abra um Pull Request

Sugestões de PRs são bem-vindas, especialmente melhorias de acessibilidade, SEO e responsividade.

---

## Licença

Ainda não há uma licença definida neste repositório.
- Se desejar, adicione uma licença (por exemplo, MIT). Crie um arquivo `LICENSE` e indique aqui no README.

---

## Contato

- GitHub: <a href="https://github.com/Felipeleii">@Felipeleii</a>
