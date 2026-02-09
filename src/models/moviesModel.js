import prisma from "../utils/prismaClient.js";

export const create = async (data) => {
  return await prisma.movie.create({ data });
};

export const findAll = async (filters = {}) => {
  const {
    title,
    description,
    duration,
    genre,
    rating,
    available,
    minRating,
    maxDuration,
    maxRating,
    minDuration,
  } = filters;
  const where = {};

  if (title) where.title = { contains: title, mode: "insensitive" };
  if (description)
    where.description = { contains: description, mode: "insensitive" };
  if (duration !== undefined) where.duration = parseInt(duration);

  if (minDuration !== undefined || maxDuration !== undefined) {
    where.duration = {};

    if (minDuration !== undefined) {
      where.duration.gte = Number(minDuration);
    }

    if (maxDuration !== undefined) {
      where.duration.lte = Number(maxDuration);
    }
  }
  if (genre) where.genre = genre;

  if (rating) {
    where.rating = parseInt(rating);
  }

  if (minRating !== undefined || maxRating !== undefined) {
    where.rating = {};

    if (minRating !== undefined) {
      where.rating.gte = Number(minRating);
    }

    if (maxRating !== undefined) {
      where.rating.lte = Number(maxRating);
    }
  }

  if (available !== undefined)
    where.available = available === "true" || available === true;

  return await prisma.movie.findMany({
    where,
    orderBy: { id: "asc" },
  });
};

export const findById = async (id) => {
  return await prisma.movie.findUnique({
    where: { id: parseInt(id) },
  });
};

export const update = async (id, data) => {
  return await prisma.movie.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const remove = async (id) => {
  return await prisma.movie.delete({
    where: { id: parseInt(id) },
  });
};
