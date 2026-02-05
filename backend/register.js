import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Регистрируем загрузчик ts-node для ESM
register("ts-node/esm", pathToFileURL("./"));