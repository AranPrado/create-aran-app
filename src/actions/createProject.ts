import { spawn } from "node:child_process";
import { PackageManager } from "../types";

type Language = "javascript" | "typescript";

function getViteTemplate(language: Language) {
  return language === "typescript" ? "react-ts" : "react";
}

function getCreateCommand(
  packageManager: PackageManager,
  projectName: string,
  template: string,
) {
  if (packageManager === "npm") {
    return {
      command: "npm",
      args: [
        "create",
        "vite@latest",
        projectName,
        "--",
        "--template",
        template,
        "--no-interactive",
      ],
    };
  }

  if (packageManager === "yarn") {
    return {
      command: "yarn",
      args: [
        "create",
        "vite",
        projectName,
        "--template",
        template,
        "--no-interactive",
      ],
    };
  }

  return {
    command: "pnpm",
    args: [
      "create",
      "vite",
      projectName,
      "--template",
      template,
      "--no-interactive",
    ],
  };
}

export async function createProject(
  projectName: string,
  language: Language,
  packageManager: PackageManager,
  basePath: string,
) {
  const template = getViteTemplate(language);

  const { command, args } = getCreateCommand(
    packageManager,
    projectName,
    template,
  );

  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      cwd: basePath,
      env: {
        ...process.env,
        CI: "true",
      },
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Falha ao criar o projeto. Código de saída: ${code}`));
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}
