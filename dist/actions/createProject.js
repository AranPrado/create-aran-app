"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
const node_child_process_1 = require("node:child_process");
function getViteTemplate(language) {
    return language === "typescript" ? "react-ts" : "react";
}
function getCreateCommand(packageManager, projectName, template) {
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
async function createProject(projectName, language, packageManager, basePath) {
    const template = getViteTemplate(language);
    const { command, args } = getCreateCommand(packageManager, projectName, template);
    return new Promise((resolve, reject) => {
        const child = (0, node_child_process_1.spawn)(command, args, {
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
