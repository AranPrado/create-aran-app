import { execSync } from "node:child_process";
import path from "node:path";

export function setupGit(projectPath: string) {
  try {
    execSync("git init", { cwd: projectPath, stdio: "ignore" });
    execSync("git add .", { cwd: projectPath, stdio: "ignore" });
    execSync('git commit -m "Initial commit"', {
      cwd: projectPath,
      stdio: "ignore",
    });
  } catch {
    console.log("⚠️ Git não configurado (git pode não estar instalado)");
  }
}
