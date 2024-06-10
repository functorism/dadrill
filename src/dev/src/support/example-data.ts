export const exampleData = {
  title: "Dashboard",
  subtitle: "Development dashboard",
  description: "A dashboard for development",
  messages: [
    { type: "ai", content: "Hello, how are you?" },
    { type: "user", content: "I'm fine, thanks!" },
  ],
  sections: [
    {
      title: "Section A",
      subtitle: "a",
      content: "This is a, how neat!",
      rating: 5,
    },
    {
      title: "Section B",
      subtitle: "b",
      content: "This is b, how neat!",
      funny: true,
    },
    {
      title: "Section C",
      subtitle: "c",
      content: "This is c, how neat!",
      comments: ["This is a comment", "This is another comment"],
    },
    ...Array(1_000)
      .fill(0)
      .map((_, i) => ({
        title: `Section ${i}`,
        subtitle: `${i}`,
        content: `This is ${i}, how neat!`,
        rating: 5,
      })),
  ],
};
