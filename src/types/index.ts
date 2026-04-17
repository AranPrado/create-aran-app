export type PackageManager = "npm" | "yarn" | "pnpm";

export interface ProjectAnswers {
  projectLocationType: "current" | "custom";
  customPath?: string;

  projectName: string;
  language: "javascript" | "typescript";
  packageManager: PackageManager;

  installAxios: boolean;
  installRouter: boolean;
  installReactQuery: boolean;
  installAntd: boolean;
  installZustand: boolean;
  installReactHookForm: boolean;
  installZod: boolean;
  installDayjs: boolean;
  installUidotdevUsehooks: boolean;
  createFolders: boolean;
  setupGit: boolean;
}
