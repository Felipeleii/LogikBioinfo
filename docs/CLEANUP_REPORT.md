# Relatório de Limpeza e Lint - LogikBioinfo

**Data:** October 22, 2025  
**Objetivo:** Identificar arquivos desnecessários e otimizar o repositório

---

## 📊 Análise do Repositório

### ✅ Estrutura Principal (Necessária)

```
├── index.html, servicos.html, blog.html, etc.  [Páginas PT]
├── en/                                          [Páginas EN]
├── es/                                          [Páginas ES]
├── img/                                         [Imagens do site]
├── favicon.png, favicon.ico                     [Ícones]
├── js/language-selector.js                      [JavaScript essencial]
├── posts/                                       [Blog posts]
└── .github/copilot-instructions.md              [Instruções Copilot]
```

### ⚠️ Arquivos Identificados para Análise

#### 1. **Documentação Técnica** (Manter)

- ✅ `SECURITY.md` - Guia de segurança
- ✅ `DEPLOYMENT_CHECKLIST.md` - Checklist de deploy
- ✅ `FORMSPREE_SETUP.md` - Setup de formulários
- ✅ `I18N_GUIDE.md` - Guia de internacionalização
- ✅ `LINT_REPORT.md` - Relatório anterior
- ✅ `VERIFICATION.txt` - Verificações
- ✅ `CHANGES.md` - Changelog

#### 2. **Mídia/Branding** (Revisar)

- `LogoLOGIK.pdf` - Logo em PDF
- `LogoLOGIK.png` - Logo em PNG
- `LogoLOGIK1.png` - Logo alternativo (duplicado?)
- `FRENTE_cartaoLogik.pdf` - Cartão (arquivo pessoal)
- `verso_cartaoLogik.pdf` - Cartão (arquivo pessoal)
- `felipe_lei.jpg` - Foto pessoal
- `CNAME` - Configuração DNS (necessária para GitHub Pages)

**Recomendação:** Manter logos, considerar mover cartões/fotos para pasta pessoal

#### 3. **Pasta `portfolio/`** (Revisar)

- ✅ Imagens PNG utilizadas (necessárias)
- ⚠️ `CNPq_Descriptive_Flow*.png` - Não utilizado?
- ⚠️ `Covid_Tree.png` - Não utilizado?
- ⚠️ `Lollipop_G5.png`, `Lollipop_Spike_G4.png` - Versões antigas?
- ⚠️ `Figure_1_Final.tif` - Arquivo TIFF (não usado, considere PNG)
- ❌ `convert_pages.py`, `convert_pdfs.py` - Scripts de desenvolvimento
- ❌ `watermark_images.py`, `watermark_tiled.py` - Scripts de desenvolvimento
- ❌ `tailwind-custom-example.html` - Arquivo de exemplo

**Recomendação:** Mover scripts `.py` e exemplo para pasta `/portfolio/dev/` (na .gitignore)

#### 4. **Pasta `unused_files/`** (Remover/Arquivar)

- ❌ `Portfolio.html` - Duplicado (versão antiga em maiúscula)
- ❌ `post-acinetobacter.html` - Post duplicado/antigo

**Recomendação:** Remover do Git (está em .gitignore, então não aparecerá)

#### 5. **Pastas Sistema** (Já no .gitignore)

- `.vs/` - Visual Studio cache
- `.vscode/` - VS Code settings
- `.idea/` - IDE settings
- `.playwright-mcp/` - Test automation cache
- `.github/` - GitHub configs (necessário manter para Copilot instructions)

#### 6. **Arquivos de Configuração**

- `.prettierrc`, `.prettierignore` - Prettier config (podem estar em .gitignore agora?)
- `.gitignore` - Configuração (necessário)
- `CNAME` - GitHub Pages DNS (necessário)

---

## 📋 Ações Recomendadas

### 1. Atualizar `.gitignore`

```gitignore
# Portfolio development scripts (não são necessários no repo)
portfolio/convert_pages.py
portfolio/convert_pdfs.py
portfolio/watermark_images.py
portfolio/watermark_tiled.py
portfolio/tailwind-custom-example.html

# Imagens não utilizadas no portfolio
portfolio/CNPq_Descriptive_Flow*.png
portfolio/Covid_Tree.png
portfolio/Lollipop_G5.png
portfolio/Lollipop_Spike_G4.png
portfolio/Figure_1_Final.tif

# Arquivos pessoais (não necessários no site)
FRENTE_cartaoLogik.pdf
verso_cartaoLogik.pdf
```

### 2. Arquivos a Manter

- ✅ Todas as páginas HTML
- ✅ Favicon (PNG e ICO)
- ✅ Logo (PNG)
- ✅ Foto do perfil (se usada no site)
- ✅ Documentação técnica
- ✅ CNAME (essencial para GitHub Pages)

### 3. Estrutura Sugerida

**Atual:**

```
portfolio/
├── [imagens utilizadas]
├── [imagens não utilizadas]
└── [scripts de desenvolvimento]
```

**Sugerido:**

```
portfolio/
├── [apenas imagens utilizadas]
└── dev/ (adicionado ao .gitignore)
    ├── scripts (.py files)
    ├── examples (html files)
    └── unused-images/
```

---

## 🎯 Tamanho do Repositório

### Arquivos que Ocupam Espaço

- Imagens PNG: ~1-2MB total
- PDFs (cartões/branding): ~500KB
- Scripts Python: <50KB
- Páginas HTML: ~200KB

**Estimativa total:** ~3-4MB

### Oportunidades de Otimização

1. ✅ Remover imagens não utilizadas (~100-200KB)
2. ✅ Mover scripts de desenvolvimento
3. ✅ Considerar compressão de imagens PNG

---

## ✨ Recomendações Finais

| Ação    | Arquivo                           | Status        |
| ------- | --------------------------------- | ------------- |
| Manter  | Páginas HTML                      | ✅ Necessário |
| Manter  | Documentação .md                  | ✅ Necessário |
| Manter  | Favicon                           | ✅ Necessário |
| Manter  | Logo PNG                          | ✅ Necessário |
| Manter  | Imagens de portfolio (utilizadas) | ✅ Necessário |
| Ignorar | Scripts Python (.py)              | ⚠️ Dev only   |
| Ignorar | HTML de exemplo                   | ⚠️ Dev only   |
| Revisar | Imagens não utilizadas            | ❓ Decide     |
| Remover | Duplicatas (Portfolio.html)       | ✅ Redundante |
| Remover | Posts antigos duplicados          | ✅ Redundante |

---

## 📝 Checklist de Limpeza

- [ ] Atualizar `.gitignore` com scripts de desenvolvimento
- [ ] Remover/arquivar imagens não utilizadas
- [ ] Revisar `unused_files/` - considerar deletar
- [ ] Documentar estrutura de desenvolvimento
- [ ] Fazer commit de limpeza final

---

**Próximos passos:** Execute os comandos abaixo para finalizar a limpeza.

```bash
# 1. Atualizar .gitignore (ver seção acima)
# 2. Fazer commit
git add .gitignore
git commit -m "Cleanup: Update .gitignore to exclude development files"
git push origin main

# 3. (Opcional) Remover arquivos desnecessários do Git
git rm --cached portfolio/*.py
git rm --cached portfolio/tailwind-custom-example.html
git commit -m "Cleanup: Remove development scripts from tracking"
git push origin main
```

---

**Mantido por:** LogikBioinfo Team  
**Última atualização:** October 22, 2025
