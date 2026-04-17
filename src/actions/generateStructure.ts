import fs from "fs-extra";
import path from "node:path";
import type { ProjectAnswers } from "../types/index.js";
import ora from "ora";
import { setupGit } from "./setupGit.js";

export async function generateStructure(
  answers: ProjectAnswers,
  basePath: string,
) {
  const projectPath = path.join(basePath, answers.projectName);

  if (!answers.createFolders) {
    return;
  }

  const folders = [
    "src/assets",
    "src/components",
    "src/hooks",
    "src/layouts",
    "src/pages",
    "src/routes",
    "src/services",
    "src/styles",
    "src/types",
    "src/utils",
    "src/libs",
  ];

  // 🔹 Criar pastas
  for (const folder of folders) {
    await fs.ensureDir(path.join(projectPath, folder));
  }

  const gitignoreContent = `
node_modules
dist
.env
.env.local
.vscode
`;

  await fs.writeFile(path.join(projectPath, ".gitignore"), gitignoreContent);

  // 🔹 Criar HomePage
  const homeDir = path.join(projectPath, "src/pages/Home");
  await fs.ensureDir(homeDir);

  const homePageContent = `export function HomePage() {
  return <h1>Projeto criado com create-aran-app 🚀</h1>;
}
`;

  await fs.writeFile(path.join(homeDir, "index.tsx"), homePageContent);

  // 🔹 Criar api.ts se tiver axios
  if (answers.installAxios) {
    const apiContent = `import axios from "axios";

      export const api = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
    'Content-Type': 'application/json',
  },
      });
      `;

    await fs.writeFile(path.join(projectPath, "src/libs/api.ts"), apiContent);
  }

  if (answers.installReactQuery) {
    const reactQueryContent = `import { QueryClient } from '@tanstack/react-query';

          export const queryClient = new QueryClient({
            defaultOptions: {
              queries: {
                refetchOnWindowFocus: false,
                retry: 0,
              },
            },
          });
      `;

    await fs.writeFile(
      path.join(projectPath, "src/libs/query-client.ts"),
      reactQueryContent,
    );
  }

  if (answers.installRouter) {
    const routerContent = `
    
      import { createBrowserRouter } from 'react-router-dom';

      export const router = createBrowserRouter([
        {
          path: '/',
          element: <>
            <h1>Layout aqui</h1>
          </>,
          children: [
            {
              path: '',
              element: <><h1>Conteudo</h1></>,
            },
          ],
          errorElement: <h1>404</h1>,
        },
        
      ]);
    `;
    await fs.writeFile(
      path.join(projectPath, "src/routes/index.tsx"),
      routerContent,
    );
  }

  // 🔥 APP.TSX DINÂMICO (A PARTE MAIS IMPORTANTE)

  const appPath = path.join(projectPath, "src/App.tsx");

  const imports: string[] = [];
  let content = `<h1>Projeto criado com create-aran-app 🚀</h1>`;

  // Router
  if (answers.installRouter) {
    imports.push(`import { RouterProvider } from "react-router-dom";`);
    imports.push(`import { router } from "./routes";`);

    content = `<RouterProvider router={router} />`;
  }

  // React Query (envolve o conteúdo)
  if (answers.installReactQuery) {
    imports.push(
      `import { QueryClientProvider } from "@tanstack/react-query";`,
    );
    imports.push(`import { queryClient } from "./libs/query-client";`);

    content = `
<QueryClientProvider client={queryClient}>
  ${content}
</QueryClientProvider>
`;
  }

  if (answers.setupGit) {
    const spinnerGit = ora("Configurando Git...").start();

    setupGit(projectPath);

    spinnerGit.succeed("Git configurado com sucesso!");
  }

  const appContent = `
${imports.join("\n")}

export default function App() {
  return (
    ${content}
  );
}
`;

  await fs.writeFile(appPath, appContent);
}
