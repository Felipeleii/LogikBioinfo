---
name: code-review
description: Diretrizes de revisão de código para scripts Python e Bash de bioinformática (pipelines de genômica, análise de resistência antimicrobiana, geração de relatórios). Use esta skill ao revisar pull requests que alterem arquivos .py, .sh ou notebooks de processamento de dados genômicos neste repositório.
---

Ao revisar código neste repositório, escreva os comentários em português e avalie os pontos abaixo, além das boas práticas gerais.

## Reprodutibilidade e ambiente

- Dependências devem estar fixadas (requirements.txt, environment.yml para conda/mamba) em vez de instalação implícita.
- Evite caminhos absolutos fixos no código (ex: /home/usuario/...). Prefira argumentos de linha de comando, variáveis de ambiente ou arquivos de configuração.
- Sinalize trechos que dependam de um sistema operacional específico (ex: comandos que só funcionam em WSL ou apenas em Linux nativo) sem alguma verificação ou aviso.

## Scripts Bash

- Scripts devem começar com set -euo pipefail para falhar rápido em caso de erro.
- Verifique se o código de saída de ferramentas externas (blastn, samtools, abricate, spades, etc.) é checado antes de prosseguir para o próximo passo do pipeline.
- Variáveis devem estar entre aspas ("$variavel") para evitar word-splitting e glob expansion indesejados.
- Evite parsing frágil de ls ou saída não estruturada de comandos; prefira find, arrays ou saída em formato estruturado (TSV/JSON) quando disponível.

## Scripts Python

- Siga PEP 8. Funções que implementem lógica biológica (ex: cálculo de identidade, cobertura, ou classificação de genes de resistência) devem ter docstrings explicando os parâmetros e seu significado biológico, não só o tipo.
- Leitura de arquivos genômicos (FASTA, FASTQ, VCF, BAM) deve tratar exceções explicitamente; nunca falhar silenciosamente ou retornar resultado vazio sem aviso.
- Prefira bibliotecas estabelecidas (Biopython, pandas, pysam) a parsers manuais de formatos de bioinformática, quando aplicável.

## Lógica específica de bioinformática

- Verifique e comente explicitamente convenções de coordenadas (0-based vs 1-based) ao lidar com BED, GFF, VCF ou outros formatos posicionais, já que erros de off-by-one são um risco comum.
- Thresholds usados em chamadas de genes de resistência ou tipagem (identidade, cobertura, e-value) devem estar documentados no código ou em comentário próximo, com referência à ferramenta/documento que os define.
- Scripts não devem assumir que arquivos de entrada estão bem formados; valide contagem de sequências, headers e formato antes de processar.

## Segurança e dados sensíveis

- Nenhuma credencial, chave de API, token ou string de conexão deve estar hardcoded no código.
- Dados de amostras clínicas ou identificadores de pacientes não devem aparecer em exemplos, logs ou arquivos de teste versionados.

## Legibilidade

- Nomes de variáveis e funções devem ser descritivos; evite nomes genéricos (data, tmp, x) em lógica não trivial.
- Comentários devem explicar o "porquê" de decisões não óbvias (ex: por que um parâmetro específico foi escolhido para uma ferramenta), não apenas repetir o que o código já mostra.

## Saída e relatórios

- Quando o script gera relatórios (HTML, CSV, etc.) para entrega a clientes ou pesquisadores, verifique que a saída final não contém informações de debug, caminhos locais ou dados internos antes da entrega.
