# Logik Bioinfo

[![Website](https://img.shields.io/badge/Website-logikbioinfo.com.br-green)](https://logikbioinfo.com.br)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-blue)](https://github.com/Felipeleii/LogikBioinfo)

Site multilíngue de serviços de bioinformática desenvolvido com HTML estático, Tailwind CSS e JavaScript vanilla.

## 🌐 Idiomas Suportados

- 🇧🇷 **Português** (padrão) - Diretório raiz (`/`)
- 🇬🇧 **English** - Diretório `/en/`
- 🇪🇸 **Español** - Diretório `/es/`

## 🛠️ Stack Tecnológico

- **HTML5** - Markup semântico
- **Tailwind CSS** - Framework CSS via CDN
- **JavaScript Vanilla** - Sem dependências pesadas
- **Font Awesome 6.5.1** - Ícones
- **Formspree** - Formulários de contato
- **GitHub Pages** - Hospedagem

## 📁 Estrutura do Projeto

```text
/                        Português (padrão/raiz)
├── index.html          Homepage principal
├── servicos.html       Página de serviços
├── publicacoes.html    Publicações científicas
├── portfolio.html      Portfolio de trabalhos
├── ferramentas.html    Ferramentas de bioinformática
├── blog.html           Listagem do blog
├── orcamento.html      Calculadora de orçamento
├── sobre.html          Sobre/Contato
├── quem-sou-eu.html    Sobre o profissional
├── obrigado.html       Página de agradecimento
└── posts/              Posts do blog

/en/                     Versões em inglês
/es/                     Versões em espanhol
/js/                     Scripts e estilos JS
/img/                    Imagens
/portfolio/              Imagens do portfolio
/docs/                   Documentação detalhada
/scripts/                Utilitários Python
```

## ✨ Funcionalidades

- **Tema Claro/Escuro** - Toggle automático com persistência via localStorage
- **Design Responsivo** - Mobile-first com menu hamburger
- **Seletor de Idiomas** - Navegação entre PT/EN/ES
- **Formulários** - Integração Formspree com anti-spam
- **Ferramentas Interativas** - Calculadoras e conversores para bioinformática

## 🚀 Desenvolvimento Local

Este é um site estático. Para desenvolvimento:

1. Clone o repositório
2. Abra qualquer arquivo `.html` no navegador
3. Ou use um servidor local:

   ```bash
   npx serve .
   # ou
   python -m http.server 8000
   ```

## 📖 Documentação

Documentação detalhada disponível em `/docs/`:

- `DEPLOYMENT_CHECKLIST.md` - Lista de verificação para deploy
- `I18N_GUIDE.md` - Guia de internacionalização
- `FORMSPREE_SETUP.md` - Configuração de formulários
- `LINT_REPORT.md` - Análise de código

## 🔧 Configurações

### Formspree (Formulários)

- Endpoint: `https://formspree.io/f/mkgqqrbw`
- Configurado no dashboard Formspree

### Tema (Dark/Light Mode)

- Arquivo: `/js/theme-toggle.js` e `/js/theme-toggle.css`
- Persistência: localStorage

## 📝 Padrões de Código

- Use lowercase para arquivos HTML
- Kebab-case para nomes compostos
- Tailwind CSS para estilos principais
- Estilos customizados em blocos `<style>` inline
- JavaScript vanilla sem frameworks

## 📄 Licença

© 2024-2026 Logik Bioinfo - Felipe Alberto Lei

---

**Contato:** [contato@logikbioinfo.com.br](mailto:contato@logikbioinfo.com.br)
