import { spawn } from "node:child_process";
import path from "node:path";
import type { PackageManager, ProjectAnswers } from "../types/index.js";

function getDependencies(answers: ProjectAnswers) {
  const dependencies: string[] = [];

  if (answers.installAxios) {
    dependencies.push("axios");
  }

  if (answers.installRouter) {
    dependencies.push("react-router-dom");
  }

  if (answers.installReactQuery) {
    dependencies.push("@tanstack/react-query");
  }

  if (answers.installAntd) {
    dependencies.push("antd");
  }

  if (answers.installZustand) {
    dependencies.push("zustand");
  }

  if (answers.installReactHookForm) {
    dependencies.push("react-hook-form");
  }

  if (answers.installZod) {
    dependencies.push("zod");
  }

  if (answers.installDayjs) {
    dependencies.push("dayjs");
  }

  if (answers.installUidotdevUsehooks) {
    dependencies.push("@uidotdev/usehooks");
  }

  return dependencies;
}

function getInstallCommand(
  packageManager: PackageManager,
  dependencies: string[],
) {
  if (packageManager === "npm") {
    return {
      command: "npm",
      args: ["install", ...dependencies],
    };
  }

  if (packageManager === "yarn") {
    return {
      command: "yarn",
      args: ["add", ...dependencies],
    };
  }

  return {
    command: "pnpm",
    args: ["add", ...dependencies],
  };
}

export async function installDependencies(
  answers: ProjectAnswers,
  basePath: string,
) {
  const dependencies = getDependencies(answers);

  if (dependencies.length === 0) {
    return;
  }

  const projectPath = path.join(basePath, answers.projectName);
  const { command, args } = getInstallCommand(
    answers.packageManager,
    dependencies,
  );

  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(`Falha ao instalar dependências. Código de saída: ${code}`),
      );
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}
