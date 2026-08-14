import { HiddenCourse } from "../models/index.js";

// Ocultar precisa valer em toda parte: se o curso some da listagem mas aparece
// na busca ou na tela inicial, a opção não cumpre o que promete.
export const getHiddenCourseIds = async (userId) => {
  if (!userId) return new Set();
  const registros = await HiddenCourse.findAll({
    where: { UserId: userId },
    attributes: ["CourseId"],
  });
  return new Set(registros.map((r) => r.CourseId));
};
