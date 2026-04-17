#!/usr/bin/env node

import chalk from "chalk";
import path from "node:path";
import fs from "fs-extra";
import ora from "ora";
import prompts from "prompts";

import { askProjectQuestions } from "./prompts/projectQuestions.js";
import { createProject } from "./actions/createProject.js";
import { generateStructure } from "./actions/generateStructure.js";
import { installDependencies } from "./actions/installDependencies.js";
import { ProjectAnswers } from "./types/index.js";

async function main() {
  console.log(
    chalk.cyan.bold(`
╔══════════════════════════════╗
║       CREATE ARAN CLI        ║
╚══════════════════════════════╝
`),
  );

  const rawArgs = process.argv.slice(2);

  const isYesMode = rawArgs.includes("--yes");

  // 🔥 função helper para pegar flags
  const getArgValue = (flag: string) => {
    const index = rawArgs.indexOf(flag);
    return index !== -1 ? rawArgs[index + 1] : undefined;
  };

  // 🔥 pega nome do projeto (primeiro argumento que não é flag)
  const projectNameArg = rawArgs.find((arg) => !arg.startsWith("--"));

  // 🔥 pega path via flag
  let customPathArg = getArgValue("--path");

  // 🔥 normaliza path (importante no Windows)
  if (customPathArg) {
    customPathArg = customPathArg.replace(/\\/g, "/");
  }

  const defaultAnswers: ProjectAnswers = {
    projectLocationType: customPathArg ? "custom" : "current",
    customPath: customPathArg,

    projectName: projectNameArg || "my-app",
    language: "typescript",
    packageManager: "npm",
    setupGit: true,
    installAxios: true,
    installRouter: true,
    installReactQuery: true,
    installAntd: true,
    installZod: true,
    installDayjs: true,
    installUidotdevUsehooks: true,
    installZustand: true,
    installReactHookForm: true,
    createFolders: true,
  };

  let answers: ProjectAnswers;

  // 🔹 modo automático ou interativo
  if (isYesMode) {
    console.log(chalk.yellow("⚡ Modo automático ativado (--yes)\n"));
    answers = defaultAnswers;
  } else {
    answers = await askProjectQuestions();
  }

  // 🔹 resumo
  console.log(chalk.blue("\nResumo da escolha:\n"));
  console.log(answers);

  // 🔹 confirmação (apenas modo interativo)
  if (!isYesMode) {
    const confirm = await prompts({
      type: "select",
      name: "action",
      message: "Deseja continuar?",
      choices: [
        { title: "Sim, continuar", value: "continue" },
        { title: "Refazer respostas", value: "retry" },
        { title: "Cancelar", value: "cancel" },
      ],
    });

    if (confirm.action === "cancel") {
      console.log(chalk.red("\n❌ Operação cancelada."));
      process.exit(0);
    }

    if (confirm.action === "retry") {
      console.log(chalk.yellow("\n🔄 Reiniciando...\n"));
      return main();
    }
  }

  // 🔹 resolve path final
  let basePath = process.cwd();

  if (answers.projectLocationType === "custom" && answers.customPath) {
    basePath = path.resolve(answers.customPath);
  }

  console.log(chalk.gray(`\n📁 Criando em: ${basePath}\n`));

  const projectPath = path.join(basePath, answers.projectName);

  // 🔹 validações
  if (!(await fs.pathExists(basePath))) {
    console.error(chalk.red("\nO caminho informado não existe."));
    process.exit(1);
  }

  if (await fs.pathExists(projectPath)) {
    console.error(
      chalk.red("\nJá existe uma pasta com esse nome nesse caminho."),
    );
    process.exit(1);
  }

  try {
    // 🔹 criar projeto
    const spinner = ora("Criando projeto base com Vite...").start();

    await createProject(
      answers.projectName,
      answers.language,
      answers.packageManager,
      basePath,
    );

    spinner.succeed("Projeto base criado com sucesso!");

    // 🔹 instalar deps
    const spinnerDeps = ora("Instalando dependências...").start();

    await installDependencies(answers, basePath);

    spinnerDeps.succeed("Dependências instaladas com sucesso!");

    // 🔹 gerar estrutura
    const spinnerStructure = ora("Gerando estrutura do projeto...").start();

    await generateStructure(answers, basePath);

    spinnerStructure.succeed("Estrutura do projeto gerada com sucesso!");

    // 🔹 final
    console.log(chalk.green("\n🎉 Projeto criado com sucesso!\n"));

    console.log(chalk.cyan("Próximos passos:"));

    console.log(
      `cd ${
        answers.projectLocationType === "custom" ? `${answers.customPath}/` : ""
      }${answers.projectName}`,
    );

    if (answers.packageManager === "npm") {
      console.log("npm run dev");
    } else {
      console.log(`${answers.packageManager} dev`);
    }
  } catch (error) {
    console.error(chalk.red("\nErro ao criar o projeto."));
    console.error(error);
    process.exit(1);
  }
}

main();
