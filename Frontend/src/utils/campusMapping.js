export const Campuses = {
  "Lí Thường Kiệt": [
    "A1",
    "A2",
    "A3",
    "A4",
    "B1",
    "B2",
    "B3",
    "B4",
    "C1",
    "C2",
    "C3",
    "C4",
  ],
  "Dĩ An": ["H1", "H2", "H3", "H4", "H5"],
};

export const Rooms = Array.from({ length: 5 }, (_, f) =>
  Array.from({ length: 5 }, (_, r) => `${f + 1}0${r + 1}`),
).flat();
const hours = Array.from({ length: 19 }, (_, i) => `${i + 5}:00`);

export const buildingIdToCampus = (() => {
  const mapping = {};
  let id = 1;

  for (const [campusName, buildings] of Object.entries(Campuses)) {
    for (const building of buildings) {
      mapping[id] = {
        building,
        campus: campusName,
      };
      id++;
    }
  }

  return mapping;
})();

export default buildingIdToCampus;
