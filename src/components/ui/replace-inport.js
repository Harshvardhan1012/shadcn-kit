// replace-imports.js
import fs from "fs";
import path from "path";

const targetDir = path.resolve("./");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Replace @/lib with @/lib
  const updated = content.replace(/(\.\.\/)+lib/g, "@/lib");

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (/\.(js|ts|jsx|tsx)$/.test(file)) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(targetDir);
console.log("✅ Replacement complete.");
