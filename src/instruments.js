const instrumentImage = (name) => `${import.meta.env.BASE_URL}instruments/${name}.png`;

export const instruments = [
  { id: 1, name: "Alto Saxophone", type: "Woodwind", image: instrumentImage("saxophone") },
  { id: 2, name: "Trumpet", type: "Brass", image: instrumentImage("trumpet") },
  { id: 3, name: "Clarinet", type: "Woodwind", image: instrumentImage("clarinet") },
  { id: 4, name: "Flute", type: "Woodwind", image: instrumentImage("flute") },
  { id: 5, name: "Trombone", type: "Brass", image: instrumentImage("trombone") },
  { id: 6, name: "Violin", type: "Strings", image: instrumentImage("violin") },
  { id: 7, name: "Drums", type: "Percussion", image: instrumentImage("drums") },
  { id: 8, name: "Acoustic Guitar", type: "Strings", image: instrumentImage("guitar") },
  { id: 9, name: "Electric Guitar", type: "Strings", image: instrumentImage("electric-guitar") },
];
