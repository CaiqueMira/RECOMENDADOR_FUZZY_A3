# 🎬 Recomendador Fuzzy de Filmes

> Projeto que usa lógica fuzzy para recomendar gêneros de filmes conforme o estado emocional do usuário (emoção, tensão e complexidade narrativa). A aplicação consulta a API do **TMDB** para buscar filmes compatíveis com o resultado fuzzy.


[![Página principal](Código%20fonte/images/pagina.png)](https://caiquemira.github.io/RECOMENDADOR_FUZZY_A3/C%C3%B3digo%20fonte/)

<p align="center">
  <a href="https://caiquemira.github.io/RECOMENDADOR_FUZZY_A3/C%C3%B3digo%20fonte/">
    🔗 Acesso para página publicada
  </a>
</p>


## 🧭 Visão geral

Este projeto usa **lógica fuzzy** para recomendar filmes com base em três entradas:

* **Emoção** — quão leve ou intensa está a emoção desejada.
* **Tensão** — nível de adrenalina/ação que o usuário quer.
* **Narrativa** — complexidade da história desejada.

A lógica fuzzy permite trabalhar com valores que **não são apenas verdadeiro/falso**, mas sim graus intermediários — por exemplo, "médio", "alto", "baixo".

### Como funciona a lógica fuzzy neste projeto

1. **Fuzzificação** → converte cada slider em graus de pertinência (ex.: emoção = 60 pode significar 0.3 "médio" e 0.7 "alto").
2. **Regras fuzzy** → combina as categorias (ex.: “se emoção é alta e tensão é baixa, então gênero recomendado tende a romance/drama”).
3. **Defuzzificação (Centroide)** → gera um valor final entre 0 e 100.
4. Esse valor é mapeado para grupos de gêneros pré-definidos.
5. A aplicação busca os filmes usando a API do TMDB.

Este projeto fornece uma interface simples (HTML + CSS + JS) onde o usuário ajusta sliders para `emoção`, `tensão` e `narrativa`. Um motor fuzzy calcula uma saída (valor numérico) que é mapeada para gêneros de filmes; em seguida a aplicação consulta a API do TMDB para listar e ranquear filmes compatíveis.

### Principais tecnologias

* HTML, CSS e JavaScript (ES Modules)
* TMDB API para buscar filmes


## 🚀 Como usar (localmente)

1. Clone o repositório:

```bash
git clone https://github.com/CaiqueMira/RECOMENDADOR_FUZZY_A3
cd RECOMENDADOR_FUZZY_A3
```

2. Adicione sua chave da API do TMDB no arquivo `script.js` (variável `API_KEY`).

```js
const API_KEY = "SUA_CHAVE_AQUI";
```

3. Abra `index.html` no navegador (duplo clique ou `Live Server` no VS Code).

4. Ajuste os sliders e clique em **Buscar Filmes**.


## 👥 Integrantes

* Iago Assunção Amorim
* João Henrique Araujo Carneiro da Cunha
* Júlia Moreira Silva dos Santos
* Marcos Caique Campelo de Miranda
* Maria Eduarda Santos da Silva