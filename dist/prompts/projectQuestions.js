"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askProjectQuestions = askProjectQuestions;
const prompts_1 = __importDefault(require("prompts"));
async function askProjectQuestions() {
    const onCancel = () => {
        console.log("\n❌ Operação cancelada pelo usuário.");
        process.exit(0);
    };
    const responses = await (0, prompts_1.default)([
        {
            type: "select",
            name: "projectLocationType",
            message: "Onde deseja criar o projeto?",
            choices: [
                { title: "Pasta atual", value: "current" },
                { title: "Informar caminho manual", value: "custom" },
            ],
            initial: 0,
        },
        {
            type: (prev) => (prev === "custom" ? "text" : null),
            name: "customPath",
            message: "Digite o caminho completo:",
            validate: (value) => value.trim() ? true : "Informe um caminho válido",
        },
        {
            type: "text",
            name: "projectName",
            message: "Qual o nome do projeto?",
            validate: (value) => value.trim() ? true : "Informe um nome para o projeto",
        },
        {
            type: "select",
            name: "language",
            message: "Qual linguagem deseja usar?",
            choices: [
                { title: "TypeScript", value: "typescript" },
                { title: "JavaScript", value: "javascript" },
            ],
            initial: 0,
        },
        {
            type: "select",
            name: "packageManager",
            message: "Qual gerenciador de pacote deseja usar?",
            choices: [
                { title: "npm", value: "npm" },
                { title: "yarn", value: "yarn" },
                { title: "pnpm", value: "pnpm" },
            ],
            initial: 0,
        },
        {
            type: "confirm",
            name: "installAxios",
            message: "Deseja instalar axios?",
            initial: true,
        },
        {
            type: "confirm",
            name: "installRouter",
            message: "Deseja instalar react-router-dom?",
            initial: true,
        },
        {
            type: "confirm",
            name: "installReactQuery",
            message: "Deseja instalar @tanstack/react-query?",
            initial: true,
        },
        {
            type: "confirm",
            name: "installAntd",
            message: "Deseja instalar ant-design?",
            initial: true,
        },
        {
            type: "confirm",
            name: "installZod",
            message: "Deseja instalar zod?",
            initial: true,
        },
        {
            type: "confirm",
            name: "installDayjs",
            message: "Deseja instalar dayjs?",
            initial: true,
        },
        {
            type: "confirm",
            name: "installUidotdevUsehooks",
            message: "Deseja instalar @uidotdev/usehooks?",
            initial: true,
        },
        {
            type: "confirm",
            name: "installZustand",
            message: "Deseja instalar zustand?",
            initial: true,
        },
        {
            type: "confirm",
            name: "installReactHookForm",
            message: "Deseja instalar react-hook-form?",
            initial: true,
        },
        {
            type: "confirm",
            name: "createFolders",
            message: "Deseja gerar estrutura padrão de pastas?",
            initial: true,
        },
    ], {
        onCancel,
    });
    return responses;
}
