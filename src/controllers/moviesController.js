import * as model from "../models/moviesModel.js";

export const getAll = async (req, res) => {
  try {
    const filmes = await model.findAll(req.query);

    if (!filmes || filmes.length === 0) {
      return res.status(200).json({
        message: "Nenhum Filme encontrado.",
      });
    }
    res.json(filmes);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    res.status(500).json({ error: "Erro ao buscar filmes" });
  }
  const { title, description, duration, genre, rating, available, minRating, maxDuration } = req.query;
  const filters = {};
  if (title) filters.title = title;
  if (description) filters.description = description;
  if (duration) filters.duration = duration;
  if (genre) filters.genre = genre;
  if (rating) filters.rating = rating;
  if (minRating) filters.minRating = parseFloat(rating = 8.0);
  if (maxDuration) filters.maxDuration = parseInt(duration = 120);
  if (available) filters.available = available === "true";
};

export const create = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Corpo da requisição vazio. Envie os dados do filme!",
      });
    }

    const { title, description, duration, genre, rating, available } = req.body;

    if (!title)
      return res.status(400).json({ error: "O título (title) é obrigatório!" });
    if (title)
      if (title.length < 3)
        return res
          .status(400)
          .json({ error: "O título deve ter pelo menos 3 caracteres!" });

    const filmeExiste = await model.findAll({ title });
    if (filmeExiste && filmeExiste.length > 0) {
      return res
        .status(400)
        .json({ error: "Já existe um filme com este título!" });
    }

    if (!description)
      return res
        .status(400)
        .json({ error: "A descrição (description) é obrigatória!" });
    if (description.length < 10)
      return res.status(400).json({
        error: "A descrição (description) deve ter pelo menos 10 caracteres!",
      });
    if (!duration)
      return res
        .status(400)
        .json({ error: "A duração (duration) é obrigatória!" });
    if (duration > 300)
      return res.status(400).json({
        error: "A duração (duration) deve ser menor que 300 minutos!",
      });
    if (!genre)
      return res.status(400).json({ error: "O gênero (genre) é obrigatório!" });
    if (
      genre &&
      ![
        "Ação",
        "Drama",
        "Comédia",
        "Terror",
        "Romance",
        "Animação",
        "Ficção Científica",
        "Suspense",
      ].includes(genre)
    ) {
      return res.status(400).json({
        error:
          "O gênero (genre) informado é inválido! Gêneros válidos: Ação, Drama, Comédia, Terror, Romance, Animação, Ficção Científica, Suspense.",
      });
    }
    if (!rating)
      return res.status(400).json({
        error: "A avaliação (rating) é obrigatória!",
      });
    if (rating < 0 || rating > 10)
      return res.status(400).json({
        error: "A avaliação (rating) deve estar entre 0 e 10!",
      });
    const data = await model.create({
      title,
      description,
      duration: parseInt(duration),
      genre,
      rating: parseFloat(rating),
      available: (available = true),
    });

    res.status(201).json({
      message: "Filme cadastrado com sucesso!",
      data,
    });
  } catch (error) {
    console.error("Erro ao criar:", error);
    res
      .status(500)
      .json({ error: "Erro interno no servidor ao salvar o Filme." });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "O ID enviado não é um número válido." });
    }

    const data = await model.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Filme não encontrado." });
    }
    res.json({ data });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    res.status(500).json({ error: "Erro ao buscar Filme" });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Corpo da requisição vazio. Envie os dados do filme!",
      });
    }

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const exists = await model.findById(id);
    if (!exists) {
      return res
        .status(404)
        .json({ error: "Filme não encontrado para atualizar." });

        
    }

    if(available === false) {
        return res.status(400).json({ 
            error: "Filmes que não estão disponíveis não podem ser atualizados." 
        });
    }

    const data = await model.update(id, req.body);
    res.json({
      message: `O Filme "${data.title}" foi atualizado com sucesso!`,
      data,
    });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    res.status(500).json({ error: "Erro ao atualizar Filme" });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const exists = await model.findById(id);
    if (!exists) {
      return res
        .status(404)
        .json({ error: "Filme não encontrado para deletar." });
    }

    if(exists.rating > 9) {
        return res.status(400).json({ 
            error: "Filmes com avaliação maior que 9 não podem ser deletados." 
        });
    }

    await model.remove(id);
    res.json({
      message: `O Filme "${exists.title}" foi deletado com sucesso!`,
      deletado: exists,
    });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ error: "Erro ao deletar Filme" });
  }
};
