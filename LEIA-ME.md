# Como instalar

1. **Substitua** o `script.js` da raiz do seu projeto pelo `script.js` deste pacote
   (só foi adicionado: navegar para a página do cliente ao clicar no card).
2. **Copie** a pasta `pages/` para a raiz do seu projeto (fica ao lado do seu `index.html`).
3. **Copie** a pasta `styles/` para a raiz do seu projeto.
4. **Copie** a pasta `scripts/` para a raiz do seu projeto.

Estrutura final esperada:

```
/index.html
/style.css
/script.js          ← atualizado
/imgs/
/pages/
  cliente.html       ← nova página
/styles/
  infostyle.css       ← nova
/scripts/
  infoscript.js       ← novo
```

A pasta `/imgs` continua sendo usada normalmente — a página nova só referencia
`../imgs/Book.svg` e `../imgs/x-square.svg`, que você já tem.

## O que a página do cliente faz

- Abre ao clicar em qualquer card na lista de contatos (o botão de excluir continua
  funcionando normalmente, sem abrir a página).
- Mostra nome, empresa, departamento e status do cliente (clique na pílula de
  status no cabeçalho para alternar entre Ativo / Ausente / Inativo).
- Campo de observações rápidas, salvo automaticamente ao sair do campo.
- **Calendário** — clique em qualquer dia para marcar uma reunião (título, horário
  e observação). Dias com reunião marcada ficam destacados com uma bolinha.
  Clicar num dia já marcado permite editar ou remover a reunião.
- **Anotações estilo Notion** — editor de texto rico (negrito, itálico, sublinhado,
  título, lista e checklist) com salvamento automático, um por cliente.

Tudo é salvo no `localStorage` do navegador, seguindo o mesmo padrão que o
restante do projeto já usa.
