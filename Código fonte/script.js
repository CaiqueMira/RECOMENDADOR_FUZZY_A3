
import { Fuzzy } from "./Fuzzy.js";
import { obtemGeneroPorId } from './Genres.js'

const fuzzy = new Fuzzy();

const API_KEY = "86cae7e4267e79cb2671eb78a9257cf0";
const BASE_URL = "https://api.themoviedb.org/3";

document.getElementById("searchBtn").addEventListener("click", obtemFilmes);

async function obtemFilmes() {
  const emocao = document.getElementById("emocao").value;
  const tensao = document.getElementById("tensao").value;
  const narrativa = document.getElementById("narrativa").value;

  const output = fuzzy.avaliarFilme(emocao, tensao, narrativa);

  console.log(output)

  let generos_compativeis = output.generos.filter(genero => genero.grau_pertinencia > 0)

  let ids = generos_compativeis.map(genero => genero.id).join('|');

  const duracao = document.getElementById("duracao").value;
  const epoca = document.getElementById("epoca").value;

  const {dataIniLancamento, dataFimLancamento} = obtemDatas(epoca);
  const {tempoMinimo, tempoMaximo} = obtemDuracao(duracao);
  const classificacao = parseInt(document.getElementById("classificacao")?.value) || null;

  console.log(classificacao)
  

  const url = `
    ${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR
    ${dataIniLancamento != undefined ? '&primary_release_date.gte=' + dataIniLancamento : ''}
    ${dataFimLancamento != undefined ? '&primary_release_date.lte=' + dataFimLancamento : ''}
    ${tempoMinimo != undefined ? '&with_runtime.gte=' + tempoMinimo : ''}
    ${tempoMaximo != undefined ? '&with_runtime.lte=' + tempoMaximo : ''}        
    &sort_by=popularity.desc
    &with_genres=${ids}`;
  const res = await fetch(url);
  const data = await res.json();

  console.log(data)

  const filmesPopulares = await Promise.all(
    data.results.map(async (movie) => {
      const [detalhesFilme, classificacoesFilme] = await Promise.all([
        fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=pt-BR`),
        fetch(`${BASE_URL}/movie/${movie.id}/release_dates?api_key=${API_KEY}`)
      ]);

      const detalhes = await detalhesFilme.json();
      const classificaoes = await classificacoesFilme.json();

      const classificacao = obtemClassificacaoBr(classificaoes);
      const runtime = detalhes.runtime || 100; // duração média se não informado

      const nota = movie.vote_average;

      const scoreRecomendacao = calculaScoreRecomendacao(movie.genre_ids, generos_compativeis)

      return { ...movie, scoreRecomendacao, nota, classificacao, runtime };
    })
  );

  const sorted = filmesPopulares
    .sort((a, b) => b.scoreRecomendacao == a.scoreRecomendacao ? b.nota - a.nota : b.scoreRecomendacao - a.scoreRecomendacao)
  
  let generos = generos_compativeis.map(genero => obtemGeneroPorId(genero.id)).join(', ')

  renderizaFilmes(sorted, generos);
}

function obtemClassificacaoBr(data) {
  const br = data.results.find(r => r.iso_3166_1 === "BR");
  if (br && br.release_dates.length > 0) {
    return br.release_dates[0].certification || "NA";
  }
  return "NA";
}

function calculaScoreRecomendacao(generos_filme, generos_compativeis) {
  let score = 0;
  let grau_pertinencia_total;

  if (generos_compativeis.length == 1) {
    grau_pertinencia_total = generos_compativeis[0].grau_pertinencia
  } else {
    grau_pertinencia_total = generos_compativeis.reduce((previous, current, index) => {    
      if (index == 1) {
        previous = previous.grau_pertinencia
      }
      previous += current.grau_pertinencia;
      return previous;
    });
  }

  generos_compativeis.forEach(genero => {
    if (generos_filme.includes(genero.id)) {
      score += genero.grau_pertinencia * 100 / grau_pertinencia_total
    }
  })

  score = score.toFixed(1)

  return score;
}

function obtemDatas(epoca) {
  switch(epoca) {
    case 'Antigo':
      return {dataFimLancamento: '1981-01-01'};
      break;
    case 'Moderno':
      return {dataIniLancamento: '1981-01-01', dataFimLancamento: '2011-01-01'}
      break;
    default: 
      return {dataIniLancamento: '2011-01-01'}
  }
}

function obtemDuracao(duracao) {
  switch(duracao) {
    case 'Curto':
      return {tempoMaximo: 90};
      break;
    case 'Medio':
      return {tempoMinimo: 90, tempoMaximo: 130}
      break;
    default: 
      return {tempoMinimo: 130}
  }
}

function renderizaFilmes(movies, genero) {
  const texto_genero = document.getElementById("generos");
  texto_genero.innerText = 'Gêneros recomendados: ' + genero;

  const grid = document.getElementById("moviesGrid");
  grid.innerHTML = movies.length
    ? movies.map((m, i) => `
      <div class="movie-card">
        <div class="rank">#${i + 1}</div>
        <img src="https://image.tmdb.org/t/p/w300${m.poster_path}" alt="${m.title}">
        <h3>${m.title}</h3>
        <p>📈 Compatibilidade: ${m.scoreRecomendacao}%</p>
        <p>⭐ Nota: ${m.vote_average}</p>
        <p>🔥 Popularidade: ${m.popularity.toFixed(0)}</p>
        <p>⏱️ Duração: ${m.runtime || "??"} min</p>
        <p>🔞 Classificação: ${m.classificacao || "L"}</p>
        
      </div>
    `).join("")
    : "<p>Nenhum filme encontrado com esses critérios.</p>";
}

function categoriaEmocao(x) {
    if (x <= 30) return "Relaxante";
    if (x <= 45) return "Tranquilo";
    if (x <= 65) return "Ligeiramente animado";
    if (x <= 80) return "Moderado";
    if (x <= 95) return "Frenético";
    return "Muito frenético";
}

function categoriaTensao(x) {
    if (x <= 40) return "Baixa";
    if (x <= 70) return "Média";
    if (x <= 90) return "Alta";
    return "Extremamente alta";
}

function categoriaNarrativa(x) {
    if (x <= 35) return "Simples";
    if (x <= 65) return "Moderada";
    if (x <= 85) return "Complexa";
    return "Muito complexa";
}

function ativarTooltip(slider, tooltip) {
    slider.addEventListener("mousedown", () => tooltip.style.opacity = "1");
    slider.addEventListener("touchstart", () => tooltip.style.opacity = "1");

    slider.addEventListener("mouseup", () => tooltip.style.opacity = "0");
    slider.addEventListener("mouseleave", () => tooltip.style.opacity = "0");
    slider.addEventListener("touchend", () => tooltip.style.opacity = "0");
}

function atualizarTooltip(slider, tooltip, categoriaFn) {
    const valor = Number(slider.value);
    const categoria = categoriaFn(valor);

    tooltip.textContent = `${valor} – ${categoria}`;

    const percent = (valor - slider.min) / (slider.max - slider.min);
    const largura = slider.offsetWidth;

    tooltip.style.left = `${percent * largura}px`;
}

const emocaoSlider = document.getElementById("emocao");
const emocaoTooltip = document.getElementById("tooltipEmocao");

const tensaoSlider = document.getElementById("tensao");
const tensaoTooltip = document.getElementById("tooltipTensao");

const narrativaSlider = document.getElementById("narrativa");
const narrativaTooltip = document.getElementById("tooltipNarrativa");

ativarTooltip(emocaoSlider, emocaoTooltip);
ativarTooltip(tensaoSlider, tensaoTooltip);
ativarTooltip(narrativaSlider, narrativaTooltip);


emocaoSlider.addEventListener("input", () =>
  atualizarTooltip(emocaoSlider, emocaoTooltip, categoriaEmocao)
);

tensaoSlider.addEventListener("input", () =>
  atualizarTooltip(tensaoSlider, tensaoTooltip, categoriaTensao)
);

narrativaSlider.addEventListener("input", () =>
  atualizarTooltip(narrativaSlider, narrativaTooltip, categoriaNarrativa)
);

// Inicializa escondido mas com posição correta
atualizarTooltip(emocaoSlider, emocaoTooltip, categoriaEmocao);
atualizarTooltip(tensaoSlider, tensaoTooltip, categoriaTensao);
atualizarTooltip(narrativaSlider, narrativaTooltip, categoriaNarrativa);

