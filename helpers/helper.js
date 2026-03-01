import { stat, writeFile, readFile } from 'node:fs/promises';
import { mkdir, existsSync } from 'node:fs';
import path from "path"

export async function cacheFileIfOlderThan(maxDays, url) {
    if (!existsSync("test_cache")) {
    mkdir("test_cache");
    }
    const file = url.split('/').pop()
    const locaPath =path.join("test_cache", file)
    try {
        const stats = await stat(locaPath);
        const diffInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        if (diffInDays < maxDays) {

            const fileData = await readFile(locaPath)
            return JSON.parse(fileData);
        }
    }
    catch {
        ; // empty catch, file might not exsist
    }

    const response = await fetch(url);
    const data = await response.json();
    await writeFile(locaPath, JSON.stringify(data, null, 2));

    return data
}