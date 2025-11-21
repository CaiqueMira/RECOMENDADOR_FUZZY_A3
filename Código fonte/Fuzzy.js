import { obtemGeneroPorId, obtemGeneroPorNome } from './Genres.js'

export class Fuzzy {

    // Funções base
    trapezoidal(x, a, b, c, d) {
        // Caso lado esquerdo infinito, retorna 1
        if (a == b && x <= b) return 1;
    
        // Caso lado direito infinito, retorna 1
        if (d == c && x >= c) return 1;

        // Valor fora da faixa de pertinência
        if (x <= a || x >= d) return 0;

        // Caso valor no platô da função trapezoidal, está no pico, portanto, retorna 1
        if (x >= b && x <= c) return 1;

        // Caso valor no platô da função trapezoidal, está no pico, portanto, retorna 1
        if (x >= b && x <= c) return 1;

        // Valor na subida
        if (x > a && x < b) return (x - a) / (b - a);

        // Valor na descida
        return (d - x) / (d - c);
    }

    triangular(x, a, b, c) {
        // Caso lado esquerdo infinito, retorna 1
        if (a == b && x <= b) return 1;
        
        // Caso lado direito infinito, retorna 1
        if (c == b && x >= b) return 1;

        // Valor fora da faixa de pertinência
        if (x <= a || x >= c) return 0;

        // Valor igual ao pico
        if (x == b) return 1;

        // Valor na subida do pico
        if (x > a && x < b) return (x - a) / (b - a);

        // Valor na descida do pico
        return (c - x) / (c - b);
    }

    
    // -------------------------
    // 1. Conjuntos Fuzzy: Nível de emoção (universo de valores de 0 a 100)
    // -------------------------
    emocao(x) {
        return {
            relaxante: this.trapezoidal(x, 0, 0, 15, 30),
            tranquilo: this.triangular(x, 20, 32, 45),
            ligeiramente_animado: this.triangular(x, 40, 55, 65),
            moderado: this.triangular(x, 60, 70, 80),
            frenetico: this.trapezoidal(x, 75, 85, 90, 95),
            muito_frenetico: this.trapezoidal(x, 90, 100, 100, 100)
        };
    }
    
    // -------------------------
    // 2. Conjuntos Fuzzy: Nível de tensão (universo de valores de 0 a 100)
    // -------------------------
    tensao(x) {
        return {
            baixa: this.trapezoidal(x, 0, 0, 20, 40),
            media: this.triangular(x, 30, 50, 70),
            alta: this.triangular(x, 60, 75, 90),
            extremamente_alta: this.trapezoidal(x, 75, 90, 100, 100)
        };
    }
    
    // -------------------------
    // 3. Conjuntos Fuzzy: Nível de complexidade narrativa (universo de valores de 0 a 100)
    // -------------------------
    complexidade(x) {
        return {
            simples: this.trapezoidal(x, 0, 0, 20, 35),
            moderada: this.triangular(x, 25, 45, 65),
            complexa: this.triangular(x, 55, 70, 85),
            muito_complexa: this.trapezoidal(x, 80, 95, 100, 100)
        };
    }

    // ------------------------------
    // 4. Conjuntos Fuzzy: Gênero do filme - Saída (universo de valores de 0 a 200)
    // ------------------------------    
    genero(y) {
        return {
            comedia: this.triangular(y, 0, 0, 25),
            romance: this.triangular(y, 20, 35, 55),
            animacao: this.triangular(y, 45, 60, 75),
            drama: this.triangular(y, 70, 90, 110),
            misterio: this.triangular(y, 100, 120, 140),
            aventura: this.triangular(y, 130, 150, 165),
            acao: this.triangular(y, 155, 170, 185),
            ficcao: this.triangular(y, 175, 188, 198),
            horror: this.triangular(y, 185, 200, 200)
        }
    }
    
    // ------------------------
    // 5. Regras fuzzy
    // ------------------------
    
    avaliarFilme(emocao, tensao, complexidade) {
        // Fuzzificação

        // Grau de pertinência de emoção
        const {
            relaxante,
            tranquilo,
            ligeiramente_animado,
            moderado,
            frenetico,
            muito_frenetico
        } = this.emocao(emocao);
        console.log(relaxante)
        
        // Grau de pertinencia de tensão  
        const {
            baixa,
            media,
            alta,
            extremamente_alta
        }  = this.tensao(tensao);
        
        // Grau de pertinência de complexidade
        const {
            simples,
            moderada,
            complexa,
            muito_complexa
        } = this.complexidade(complexidade);

    
        // Aplicação das regras (força da regra = pertinência do antecedente)
        /* REGRAS ADOTADAS
            SE nível de emoção RELAXANTE e nível de tensão BAIXA e complexidade narrativa SIMPLES ENTÃO filme COMEDIA OU ROMANCE
            SE nível de emoção RELAXANTE e nível de tensão MEDIA e complexidade narrativa MODERADA ENTÃO filme ROMANCE
            SE nível de emoção RELAXANTE e nível de tensão ALTA e complexidade narrativa MODERADA ENTÃO filme DRAMA
            SE nível de emoção RELAXANTE e nível de tensão EXTREMAMENTE_ALTA e complexidade narrativa COMPLEXA ENTÃO filme MISTERIO

            SE nível de emoção TRANQUILO e nível de tensão BAIXA e complexidade narrativa SIMPLES ENTÃO filme COMEDIA OU ROMANCE OU ANIMACAO
            SE nível de emoção TRANQUILO e nível de tensão MEDIA e complexidade narrativa MODERADA ENTÃO filme ROMANCE OU ANIMACAO
            SE nível de emoção TRANQUILO e nível de tensão ALTA e complexidade narrativa MODERADA ENTÃO filme DRAMA
            SE nível de emoção TRANQUILO e nível de tensão EXTREMAMENTE_ALTA e complexidade narrativa COMPLEXA ENTÃO filme MISTERIO
            
            SE nível de emoção LIGEIRAMENTE_ANIMADO e nível de tensão BAIXA e complexidade narrativa SIMPLES ENTÃO filme ANIMACAO
            SE nível de emoção LIGEIRAMENTE_ANIMADO e nível de tensão BAIXA e complexidade narrativa MODERADA ENTÃO filme COMEDIA OU ROMANCE
            SE nível de emoção LIGEIRAMENTE_ANIMADO e nível de tensão MEDIA e complexidade narrativa MODERADA ENTÃO filme ANIMACAO OU DRAMA
            SE nível de emoção LIGEIRAMENTE_ANIMADO e nível de tensão ALTA e complexidade narrativa MODERADA ENTÃO filme AVENTURA
            SE nível de emoção LIGEIRAMENTE_ANIMADO e nível de tensão EXTREMAMENTE_ALTA e complexidade narrativa COMPLEXA ENTÃO filme MISTERIO

            SE nível de emoção MODERADO e nível de tensão BAIXA e complexidade narrativa MODERADA ENTÃO filme DRAMA 
            SE nível de emoção MODERADO e nível de tensão MEDIA e complexidade narrativa COMPLEXA ENTÃO filme DRAMA
            SE nível de emoção MODERADO e nível de tensão ALTA e complexidade narrativa MODERADA ENTÃO filme AVENTURA
            SE nível de emoção MODERADO e nível de tensão ALTA e complexidade narrativa COMPLEXA ENTÃO filme DRAMA OU MISTERIO
            SE nível de emoção MODERADO e nível de tensão EXTREMAMENTE_ALTA e complexidade narrativa COMPLEXA ENTÃO filme AVENTURA
            SE nível de emoção MODERADO e nível de tensão EXTREMAMENTE_ALTA e complexidade narrativa MUITO_COMPLEXA ENTÃO filme MISTERIO

            SE nível de emoção FRENETICO e nível de tensão BAIXA e complexidade narrativa SIMPLES ENTÃO filme ANIMACAO
            SE nível de emoção FRENETICO e nível de tensão MEDIA e complexidade narrativa SIMPLES ENTÃO filme ACAO
            SE nível de emoção FRENETICO e nível de tensão MEDIA e complexidade narrativa MODERADA ENTÃO filme AVENTURA
            SE nível de emoção FRENETICO e nível de tensão ALTA e complexidade narrativa MODERADA ENTÃO filme ACAO
            SE nível de emoção FRENETICO e nível de tensão ALTA e complexidade narrativa COMPLEXA ENTÃO filme FICCAO
            SE nível de emoção FRENETICO e nível de tensão ALTA e complexidade narrativa MUITO_COMPLEXA ENTÃO filme MISTERIO
            SE nível de emoção FRENETICO e nível de tensão EXTREMAMENTE_ALTA e complexidade narrativa MODERADA ENTÃO filme ACAO OU HORROR
            SE nível de emoção FRENETICO e nível de tensão EXTREMAMENTE_ALTA e complexidade narrativa MUITO_COMPLEXA ENTÃO filme MISTERIO OU HORROR

            SE nível de emoção MUITO_FRENETICO e nível de tensão BAIXA e complexidade narrativa SIMPLES ENTÃO filme ANIMACAO
            SE nível de emoção MUITO_FRENETICO e nível de tensão MEDIA e complexidade narrativa MODERADA ENTÃO filme ACAO 
            SE nível de emoção MUITO_FRENETICO e nível de tensão ALTA e complexidade narrativa COMPLEXA ENTÃO filme ACAO OU HORROR
            SE nível de emoção MUITO_FRENETICO e nível de tensão ALTA e complexidade narrativa MUITO_COMPLEXA ENTÃO filme FICCAO
            SE nível de emoção MUITO_FRENETICO e nível de tensão EXTREMAMENTE_ALTA e complexidade narrativa COMPLEXA ENTÃO filme ACAO OU HORROR
            SE nível de emoção MUITO_FRENETICO e nível de tensão EXTREMAMENTE_ALTA e complexidade narrativa MUITO_COMPLEXA ENTÃO filme FICCAO OU HORROR
        */
        const regrasPrincipais = {
            comedia: Math.max(
                Math.min(relaxante, baixa, simples),
                Math.min(tranquilo, baixa, simples),
                Math.min(ligeiramente_animado, baixa, moderada),
            ),

            romance: Math.max(
                Math.min(relaxante, baixa, simples),
                Math.min(relaxante, media, moderada),
                Math.min(tranquilo, baixa, simples),
                Math.min(tranquilo, media, moderada),
                Math.min(ligeiramente_animado, baixa, moderada),
            ),

            animacao: Math.max(
                Math.min(tranquilo, baixa, simples),
                Math.min(tranquilo, media, moderada),
                Math.min(ligeiramente_animado, baixa, simples),
                Math.min(ligeiramente_animado, media, moderada),
                Math.min(frenetico, baixa, simples),
                Math.min(muito_frenetico, baixa, simples),
            ),

            drama: Math.max(
                Math.min(relaxante, alta, moderada),
                Math.min(tranquilo, alta, moderada),
                Math.min(ligeiramente_animado, media, moderada),
                Math.min(moderado, baixa, moderada),
                Math.min(moderado, media, complexa),
                Math.min(moderado, alta, complexa),
            ),

            misterio: Math.max(
                Math.min(relaxante, extremamente_alta, complexa),
                Math.min(tranquilo, extremamente_alta, complexa),
                Math.min(ligeiramente_animado, extremamente_alta, complexa),
                Math.min(moderado, alta, complexa),
                Math.min(moderado, extremamente_alta, muito_complexa),
                Math.min(frenetico, alta, muito_complexa),
                Math.min(frenetico, extremamente_alta, muito_complexa),
            ),

            aventura: Math.max(
                Math.min(ligeiramente_animado, alta, moderada),
                Math.min(moderado, alta, moderada),
                Math.min(moderado, extremamente_alta, complexa),
                Math.min(frenetico, media, moderada),
            ),

            acao: Math.max(
                Math.min(frenetico, media, simples),
                Math.min(frenetico, alta, moderada),
                Math.min(frenetico, extremamente_alta, moderada),
                Math.min(muito_frenetico, media, moderada),
                Math.min(muito_frenetico, alta, complexa),
                Math.min(muito_frenetico, extremamente_alta, complexa),
            ),

            ficcao: Math.max(
                Math.min(frenetico, alta, complexa),
                Math.min(muito_frenetico, alta, muito_complexa),
                Math.min(muito_frenetico, extremamente_alta, muito_complexa),
            ),

            horror: Math.max(
                Math.min(frenetico, extremamente_alta, moderada),
                Math.min(muito_frenetico, extremamente_alta, complexa),
                Math.min(muito_frenetico, extremamente_alta, muito_complexa),
            ),
        };

        // regras baseadas SOMENTE em complexidade (possui cobertura genérica)
        // essas regras garantem que casos sem regras originais recebam uma ativação coerente
        const regrasComplexidade = {
            comedia: simples,
            romance: Math.max(simples, moderada * 0.8),
            animacao: simples,
            drama: Math.max(moderada, complexa * 0.6),
            misterio: Math.max(complexa * 0.8, muito_complexa),
            aventura: Math.max(moderada * 0.9, complexa * 0.6),
            acao: Math.max(complexa * 0.8, muito_complexa * 0.6),
            ficcao: Math.max(complexa * 0.9, muito_complexa),
            horror: muito_complexa,
        };

        const somaAtivacoes = Object.values(regrasPrincipais).reduce((s, v) => s + v, 0);
        let regrasFinais;
        
        // Caso nenhuma regra principal tenha sido ativada, realiza ativação pelas regras de complexidade da narrativa
        if (somaAtivacoes == 0) {
            regrasFinais = regrasComplexidade;
        } else {
            regrasFinais = regrasPrincipais
        }


        console.log('regrasPrincipais:', regrasPrincipais);
        console.log('regrasComplexidade:', regrasComplexidade);
        console.log('regrasFinais:', regrasFinais);
    
        // --------------------------------------------
        // 5. Defuzzificação pelo método do centroide
        // --------------------------------------------
    
        const resolution = 1000; // mais pontos = mais preciso
        let somatorio_produto_pos_pert = 0;
        let somatorio_grau_pertinencia = 0;
    
        for (let y = 0; y <= 200; y += 200 / resolution) {
            
            // Obtem o grau de pertinência do ponto atual para todos os gêneros
            const {
                comedia,
                romance,
                drama,
                misterio,
                animacao,
                aventura,
                acao,
                ficcao,
                horror
            } = this.genero(y)
            
            // Agregação: max das regras aplicadas ao mesmo conjunto
            const grau_pertinencia =
            Math.max(
                Math.min(regrasFinais.comedia, comedia),
                Math.min(regrasFinais.romance, romance),
                Math.min(regrasFinais.drama, drama),
                Math.min(regrasFinais.misterio, misterio),
                Math.min(regrasFinais.animacao, animacao),
                Math.min(regrasFinais.aventura, aventura),
                Math.min(regrasFinais.acao, acao),
                Math.min(regrasFinais.ficcao, ficcao),
                Math.min(regrasFinais.horror, horror),
            );
            
            // Cálculo do centroide, somatório do ponto em que se encontra multiplicado pelo grau de pertinencia dividido pelo somatório dos graus de pertinência dos pontos.
            // Soma(y * u(y)) / Soma(u(y))
            somatorio_produto_pos_pert += y * grau_pertinencia;
            somatorio_grau_pertinencia += grau_pertinencia;
        }
        
        const saida = somatorio_produto_pos_pert / somatorio_grau_pertinencia;

        // Obtem o grau de pertinência do valor de saída para todos os gêneros
        const {
            comedia,
            romance,
            drama,
            misterio,
            animacao,
            aventura,
            acao,
            ficcao,
            horror
        } = this.genero(saida)
        
        return {
            valor: saida,
            generos: [
                {                    
                    id: obtemGeneroPorNome("Comedia"),
                    nome: obtemGeneroPorId(obtemGeneroPorNome("Comedia")),
                    grau_pertinencia: comedia
                },
                {                    
                    id: obtemGeneroPorNome("Romance"),
                    nome: obtemGeneroPorId(obtemGeneroPorNome("Romance")),
                    grau_pertinencia: romance
                },
                {                    
                    id: obtemGeneroPorNome("Drama"),
                    nome: obtemGeneroPorId(obtemGeneroPorNome("Drama")),
                    grau_pertinencia: drama
                },
                {                    
                    id: obtemGeneroPorNome("Mistério"),
                    nome: obtemGeneroPorId(obtemGeneroPorNome("Mistério")),
                    grau_pertinencia: misterio
                },
                {                    
                    id: obtemGeneroPorNome("Animação"),
                    nome: obtemGeneroPorId(obtemGeneroPorNome("Animação")),
                    grau_pertinencia: animacao
                },
                {                    
                    id: obtemGeneroPorNome("Aventura"),
                    nome: obtemGeneroPorId(obtemGeneroPorNome("Aventura")),
                    grau_pertinencia: aventura
                },
                {                    
                    id: obtemGeneroPorNome("Ação"),
                    nome: obtemGeneroPorId(obtemGeneroPorNome("Ação")),
                    grau_pertinencia: acao
                },
                {                    
                    id: obtemGeneroPorNome("Ficção"),
                    nome: obtemGeneroPorId(obtemGeneroPorNome("Ficção")),
                    grau_pertinencia: ficcao
                },
                {                    
                    id: obtemGeneroPorNome("Horror"),
                    nome: obtemGeneroPorId(obtemGeneroPorNome("Horror")),
                    grau_pertinencia: horror
                },
            ]
        }
    }
}
