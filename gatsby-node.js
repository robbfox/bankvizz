import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const createPages = async ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  });
};
