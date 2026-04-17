"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDependencies = installDependencies;
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
function getDependencies(answers) {
    const dependencies = [];
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
function getInstallCommand(packageManager, dependencies) {
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
async function installDependencies(answers, basePath) {
    const dependencies = getDependencies(answers);
    if (dependencies.length === 0) {
        return;
    }
    const projectPath = node_path_1.default.join(basePath, answers.projectName);
    const { command, args } = getInstallCommand(answers.packageManager, dependencies);
    await new Promise((resolve, reject) => {
        const child = (0, node_child_process_1.spawn)(command, args, {
            cwd: projectPath,
            stdio: "inherit",
            shell: true,
        });
        child.on("close", (code) => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(new Error(`Falha ao instalar dependências. Código de saída: ${code}`));
        });
        child.on("error", (error) => {
            reject(error);
        });
    });
}
