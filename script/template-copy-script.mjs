import { mkdir, cp, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

async function createProject() {
    try {
        const projectName = process.argv[2];

        if (!projectName) {
            console.error('🚫 Please enter a project name. Usage: pnpm scaffolding <project-name>');
            process.exit(1);
        }
        const projectPath = path.join('app', projectName);
        const templateDir = path.join('shared', 'template');

        if (existsSync(projectPath)) {
            console.error(`🚫 Project '${projectName}' already exists.`);
            process.exit(1);
        }

        if (!existsSync(templateDir)) {
            console.error(`🚫 Template directory not found: ${templateDir}`);
            process.exit(1);
        }

        await mkdir(projectPath, { recursive: true });
        await cp(templateDir, projectPath, { recursive: true });

        const gitignorePath = path.join(templateDir, '.gitignore');
        if (existsSync(gitignorePath)) {
            await cp(gitignorePath, path.join(projectPath, '.gitignore'));
        }

        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
        packageJson.name = projectName;
        await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

        const tsconfigPath = path.join(projectPath, 'tsconfig.app.json');
        if (existsSync(tsconfigPath)) {
            let tsconfigContent = await readFile(tsconfigPath, 'utf8');
            tsconfigContent = tsconfigContent.replace(
                /"@plitvice\/ui": \["..\/ui\/src"\]/g,
                '"@plitvice/ui": ["../../shared/ui/src"]',
            );
            tsconfigContent = tsconfigContent.replace(
                /"@plitvice\/ui\/\*": \["..\/ui\/src\/\*"\]/g,
                '"@plitvice/ui/*": ["../../shared/ui/src/*"]',
            );
            await writeFile(tsconfigPath, tsconfigContent);
        }

        console.log('📦 Installing dependencies...');
        const { execSync } = await import('child_process');
        execSync('pnpm install', { stdio: 'inherit' });

        console.log(`🎉 Project '${projectName}' has been created successfully. HAPPY NEWID! 🎉 `);
    } catch (error) {
        console.error('❌ An error occurred:', error);
        process.exit(1);
    }
}

createProject();
