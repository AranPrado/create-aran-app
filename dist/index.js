#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const ora_1 = __importDefault(require("ora"));
const prompts_1 = __importDefault(require("prompts"));
const projectQuestions_js_1 = require("./prompts/projectQuestions.js");
const createProject_js_1 = require("./actions/createProject.js");
const generateStructure_js_1 = require("./actions/generateStructure.js");
const installDependencies_js_1 = require("./actions/installDependencies.js");
async function main() {
    console.log(chalk_1.default.cyan.bold(`
╔══════════════════════════════╗
║       CREATE ARAN CLI        ║
╚══════════════════════════════╝
`));
    const rawArgs = process.argv.slice(2);
    const isYesMode = rawArgs.includes("--yes");
    // 🔥 função helper para pegar flags
    const getArgValue = (flag) => {
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
    const defaultAnswers = {
        projectLocationType: customPathArg ? "custom" : "current",
        customPath: customPathArg,
        projectName: projectNameArg || "my-app",
        language: "typescript",
        packageManager: "npm",
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
    let answers;
    // 🔹 modo automático ou interativo
    if (isYesMode) {
        console.log(chalk_1.default.yellow("⚡ Modo automático ativado (--yes)\n"));
        answers = defaultAnswers;
    }
    else {
        answers = await (0, projectQuestions_js_1.askProjectQuestions)();
    }
    // 🔹 resumo
    console.log(chalk_1.default.blue("\nResumo da escolha:\n"));
    console.log(answers);
    // 🔹 confirmação (apenas modo interativo)
    if (!isYesMode) {
        const confirm = await (0, prompts_1.default)({
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
            console.log(chalk_1.default.red("\n❌ Operação cancelada."));
            process.exit(0);
        }
        if (confirm.action === "retry") {
            console.log(chalk_1.default.yellow("\n🔄 Reiniciando...\n"));
            return main();
        }
    }
    // 🔹 resolve path final
    let basePath = process.cwd();
    if (answers.projectLocationType === "custom" && answers.customPath) {
        basePath = node_path_1.default.resolve(answers.customPath);
    }
    console.log(chalk_1.default.gray(`\n📁 Criando em: ${basePath}\n`));
    const projectPath = node_path_1.default.join(basePath, answers.projectName);
    // 🔹 validações
    if (!(await fs_extra_1.default.pathExists(basePath))) {
        console.error(chalk_1.default.red("\nO caminho informado não existe."));
        process.exit(1);
    }
    if (await fs_extra_1.default.pathExists(projectPath)) {
        console.error(chalk_1.default.red("\nJá existe uma pasta com esse nome nesse caminho."));
        process.exit(1);
    }
    try {
        // 🔹 criar projeto
        const spinner = (0, ora_1.default)("Criando projeto base com Vite...").start();
        await (0, createProject_js_1.createProject)(answers.projectName, answers.language, answers.packageManager, basePath);
        spinner.succeed("Projeto base criado com sucesso!");
        // 🔹 instalar deps
        const spinnerDeps = (0, ora_1.default)("Instalando dependências...").start();
        await (0, installDependencies_js_1.installDependencies)(answers, basePath);
        spinnerDeps.succeed("Dependências instaladas com sucesso!");
        // 🔹 gerar estrutura
        const spinnerStructure = (0, ora_1.default)("Gerando estrutura do projeto...").start();
        await (0, generateStructure_js_1.generateStructure)(answers, basePath);
        spinnerStructure.succeed("Estrutura do projeto gerada com sucesso!");
        // 🔹 final
        console.log(chalk_1.default.green("\n🎉 Projeto criado com sucesso!\n"));
        console.log(chalk_1.default.cyan("Próximos passos:"));
        console.log(`cd ${answers.projectLocationType === "custom" ? `${answers.customPath}/` : ""}${answers.projectName}`);
        if (answers.packageManager === "npm") {
            console.log("npm run dev");
        }
        else {
            console.log(`${answers.packageManager} dev`);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("\nErro ao criar o projeto."));
        console.error(error);
        process.exit(1);
    }
}
main();
