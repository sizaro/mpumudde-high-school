import fs from "fs";
import path from "path";

const src = path.resolve("src");

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      walk(full);
      continue;
    }

    if (!file.endsWith(".ts")) continue;

    let content = fs.readFileSync(full, "utf8");

    content = content.replace(
      /from\s+['"](\.\/|\.\.\/)[^'"]+['"]/g,
      (match) => {
        if (match.endsWith(".js'") || match.endsWith('.js"')) {
          return match;
        }

        return match.replace(
          /(['"])$/,
          ".js$1"
        );
      }
    );

    fs.writeFileSync(full, content);
  }
}

walk(src);

console.log("ESM imports fixed");