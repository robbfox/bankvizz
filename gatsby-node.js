// gatsby-node.js (ESM-compatible)
export const createPages = async ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: "/using-dsg",
    component: new URL("./src/templates/using-dsg.js", import.meta.url).pathname,
    context: {},
    defer: true,
  });
};
