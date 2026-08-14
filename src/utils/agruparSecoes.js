// As seções chegam já ordenadas por módulo e posição. Agrupar as consecutivas
// que compartilham groupName dá a hierarquia visual sem que o banco precise
// guardar uma árvore: cursos de dois níveis simplesmente não têm groupName e
// caem num grupo sem cabeçalho.
export const agruparSecoes = (sections = []) => {
  const grupos = [];
  for (const section of sections) {
    const nome = section.groupName || null;
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.nome === nome) ultimo.sections.push(section);
    else grupos.push({ nome, sections: [section] });
  }
  return grupos;
};
