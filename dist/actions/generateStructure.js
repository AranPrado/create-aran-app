"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStructure = generateStructure;
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
async function generateStructure(answers, basePath) {
    const projectPath = node_path_1.default.join(basePath, answers.projectName);
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
        await fs_extra_1.default.ensureDir(node_path_1.default.join(projectPath, folder));
    }
    // 🔹 Criar HomePage
    const homeDir = node_path_1.default.join(projectPath, "src/pages/Home");
    await fs_extra_1.default.ensureDir(homeDir);
    const homePageContent = `export function HomePage() {
  return <h1>Projeto criado com create-aran-app 🚀</h1>;
}
`;
    await fs_extra_1.default.writeFile(node_path_1.default.join(homeDir, "index.tsx"), homePageContent);
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
        await fs_extra_1.default.writeFile(node_path_1.default.join(projectPath, "src/libs/api.ts"), apiContent);
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
        await fs_extra_1.default.writeFile(node_path_1.default.join(projectPath, "src/libs/query-client.ts"), reactQueryContent);
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
        await fs_extra_1.default.writeFile(node_path_1.default.join(projectPath, "src/routes/index.tsx"), routerContent);
    }
    // 🔥 APP.TSX DINÂMICO (A PARTE MAIS IMPORTANTE)
    const appPath = node_path_1.default.join(projectPath, "src/App.tsx");
    const imports = [];
    let content = `<h1>Projeto criado com create-aran-app 🚀</h1>`;
    // Router
    if (answers.installRouter) {
        imports.push(`import { RouterProvider } from "react-router-dom";`);
        imports.push(`import { router } from "./routes";`);
        content = `<RouterProvider router={router} />`;
    }
    // React Query (envolve o conteúdo)
    if (answers.installReactQuery) {
        imports.push(`import { QueryClientProvider } from "@tanstack/react-query";`);
        imports.push(`import { queryClient } from "./libs/query-client";`);
        content = `
<QueryClientProvider client={queryClient}>
  ${content}
</QueryClientProvider>
`;
    }
    const appContent = `
${imports.join("\n")}

export default function App() {
  return (
    ${content}
  );
}
`;
    await fs_extra_1.default.writeFile(appPath, appContent);
}
