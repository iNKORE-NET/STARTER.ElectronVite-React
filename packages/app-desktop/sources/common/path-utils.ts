/*
https://github.com/unjs/pathe
Based on Node.js implementation:
 - Forked from: https://github.com/nodejs/node/blob/4b030d057375e58d2e99182f6ef7aa70f6ebcf99/lib/path.js
 - Latest: https://github.com/nodejs/node/blob/main/lib/path.js
Check LICENSE file

*/

//#region Path

const _UNC_REGEX = /^[/\\]{2}/;
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const _ROOT_FOLDER_RE = /^\/([A-Za-z]:)?$/;

// Force POSIX contants
export const sep = "/";
export const delimiter = ":";

/**
 * Normalize a string path, reducing '..' and '.' parts.
 * When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved. On Windows backslashes are used.
 *
 * @param path string path to normalize.
 * @throws {TypeError} if `path` is not a string.
 */
export function normalize(path: string): string
{
    if (path.length === 0) 
    {
        return ".";
    }

    // If a protocol is found at the beginning of the path, we extract it and return the remaining path to normalize.
    const protocolExceptionSeparator = "://";
    if (path.includes(protocolExceptionSeparator))
    {
        const [scheme, ...rest] = path.split(protocolExceptionSeparator);
        return scheme + protocolExceptionSeparator + normalize(rest.join(protocolExceptionSeparator));
    }

    // Normalize windows argument
    path = normalizeWindowsPath(path);

    const isUNCPath = path.match(_UNC_REGEX);
    const isPathAbsolute = isAbsolute(path);
    const trailingSeparator = path[path.length - 1] === "/";

    // Normalize the path
    path = normalizeString(path, !isPathAbsolute);

    if (path.length === 0) 
    {
        if (isPathAbsolute) 
        {
            return "/";
        }
        return trailingSeparator ? "./" : ".";
    }
    if (trailingSeparator) 
    {
        path += "/";
    }
    if (_DRIVE_LETTER_RE.test(path)) 
    {
        path += "/";
    }

    if (isUNCPath) 
    {
        if (!isPathAbsolute) 
        {
            return `//./${path}`;
        }
        return `//${path}`;
    }

    return isPathAbsolute && !isAbsolute(path) ? `/${path}` : path;
};

/**
 * Join all arguments together and normalize the resulting path.
 *
 * @param paths paths to join.
 * @throws {TypeError} if any of the path segments is not a string.
 */
export function join(...arguments_: string[])
{
    if (arguments_.length === 0) 
    {
        return ".";
    }

    

    let joined: string | undefined = undefined;
    for (const argument of arguments_) 
    {
        if (argument && argument.length > 0) 
        {
            if (joined === undefined) 
            {
                joined = argument;
            }
            else 
            {
                joined += `/${argument}`;
            }
        }
    }
    if (joined === undefined) 
    {
        return ".";
    }

    //return normalize(joined.replace(/\/\/+/g, "/"));
    return normalize(joined.replaceAll("\\", "/"));
};


// Resolves . and .. elements in a path with directory names
export function normalizeString(path: string, allowAboveRoot: boolean) 
{
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let char: string | null = null;
    for (let index = 0; index <= path.length; ++index) 
    {
        if (index < path.length) 
        {
            char = path[index];
        }
        else if (char === "/") 
        {
            break;
        }
        else 
        {
            char = "/";
        }
        if (char === "/") 
        {
            if (lastSlash === index - 1 || dots === 1) 
            {
                // NOOP
            }
            else if (dots === 2) 
            {
                if (
                    res.length < 2 ||
                    lastSegmentLength !== 2 ||
                    res[res.length - 1] !== "." ||
                    res[res.length - 2] !== ".") 
                {
                    if (res.length > 2) 
                    {
                        const lastSlashIndex = res.lastIndexOf("/");
                        if (lastSlashIndex === -1) 
                        {
                            res = "";
                            lastSegmentLength = 0;
                        }
                        else 
                        {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                        }
                        lastSlash = index;
                        dots = 0;
                        continue;
                    }
                    else if (res.length > 0) 
                    {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = index;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) 
                {
                    res += res.length > 0 ? "/.." : "..";
                    lastSegmentLength = 2;
                }
            }
            else 
            {
                if (res.length > 0) 
                {
                    res += `/${path.slice(lastSlash + 1, index)}`;
                }
                else 
                {
                    res = path.slice(lastSlash + 1, index);
                }
                lastSegmentLength = index - lastSlash - 1;
            }
            lastSlash = index;
            dots = 0;
        }
        else if (char === "." && dots !== -1) 
        {
            ++dots;
        }
        else 
        {
            dots = -1;
        }
    }
    return res;
}

/**
 * Determines whether {path} is an absolute path. An absolute path will always resolve to the same location, regardless of the working directory.
 *
 * If the given {path} is a zero-length string, `false` will be returned.
 *
 * @param path path to test.
 * @throws {TypeError} if `path` is not a string.
 */
export function isAbsolute(path: string)
{
    return _IS_ABSOLUTE_RE.test(path);
};

/**
 * On Windows systems only, returns an equivalent namespace-prefixed path for the given path.
 * If path is not a string, path will be returned without modifications.
 * This method is meaningful only on Windows system.
 * On POSIX systems, the method is non-operational and always returns path without modifications.
 */
export function toNamespacedPath(path: string)
{
    return normalizeWindowsPath(path);
};

// extname
const _EXTNAME_RE = /.(\.[^./]+)$/;
/**
 * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
 * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string.
 *
 * @param path the path to evaluate.
 * @throws {TypeError} if `path` is not a string.
 */
export function extname(path: string)
{
    const match = _EXTNAME_RE.exec(normalizeWindowsPath(path));
    return (match && match[1]) || "";
};

/**
 * Return the directory name of a path. Similar to the Unix dirname command.
 *
 * @param path the path to evaluate.
 * @throws {TypeError} if `path` is not a string.
 */
export function dirname(path: string)
{
    const segments = normalizeWindowsPath(path)
        .replace(/\/$/, "")
        .split("/")
        .slice(0, -1);
    if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) 
    {
        segments[0] += "/";
    }
    return segments.join("/") || (isAbsolute(path) ? "/" : ".");
};

export interface FormatInputPathObject 
{
    /**
     * The root of the path such as '/' or 'c:\'
     */
    root?: string | undefined;
    /**
     * The full directory path such as '/home/user/dir' or 'c:\path\dir'
     */
    dir?: string | undefined;
    /**
     * The file name including extension (if any) such as 'index.html'
     */
    base?: string | undefined;
    /**
     * The file extension (if any) such as '.html'
     */
    ext?: string | undefined;
    /**
     * The file name without extension (if any) such as 'index'
     */
    name?: string | undefined;
}

/**
 * Return the last portion of a path. Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 *
 * @param path the path to evaluate.
 * @param suffix optionally, an extension to remove from the result.
 * @throws {TypeError} if `path` is not a string or if `ext` is given and is not a string.
 */
export function basename(path: string, suffix?: string)
{
    const lastSegment = normalizeWindowsPath(path).split("/").pop() ?? "";
    return suffix && lastSegment.endsWith(suffix)
        ? lastSegment.slice(0, -suffix.length)
        : lastSegment;
};

/**
 * Returns an object from a path string - the opposite of format().
 *
 * @param path path to evaluate.
 * @throws {TypeError} if `path` is not a string.
 */
export function parse(path: string)
{
    const root = normalizeWindowsPath(path).split("/").shift() || "/";
    const base = basename(path);
    const extension = extname(base);
    return {
        root,
        dir: dirname(path),
        base,
        ext: extension,
        name: base.slice(0, base.length - extension.length),
    };
};

//#endregion

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;

// Util to normalize windows paths to posix
export function normalizeWindowsPath(input = "") 
{
    if (!input) 
    {
        return input;
    }
    return input
        .replace(/\\/g, "/")
        .replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}

// #region Extended

export function basenameWithoutExtension(filePath) 
{
    return basename(filePath, extname(filePath));
}

// #endregion

//#region Utils


const pathSeparators = new Set(["/", "\\", undefined]);

const normalizedAliasSymbol = Symbol.for("pathe:normalizedAlias");

export function normalizeAliases(_aliases: Record<string, string>) 
{
    if ((_aliases as any)[normalizedAliasSymbol]) 
    {
        return _aliases;
    }

    // Sort aliases from specific to general (ie. fs/promises before fs)
    const aliases = Object.fromEntries(
        Object.entries(_aliases).sort(([a], [b]) => _compareAliases(a, b)),
    );

    // Resolve alias values in relation to each other
    for (const key in aliases) 
    {
        for (const alias in aliases) 
        {
            // don't resolve a more specific alias with regard to a less specific one
            if (alias === key || key.startsWith(alias)) 
            {
                continue;
            }

            if (
                aliases[key].startsWith(alias) &&
        pathSeparators.has(aliases[key][alias.length])
            ) 
            {
                aliases[key] = aliases[alias] + aliases[key].slice(alias.length);
            }
        }
    }

    Object.defineProperty(aliases, normalizedAliasSymbol, {
        value: true,
        enumerable: false,
    });
    return aliases;
}

export function resolveAlias(path: string, aliases: Record<string, string>) 
{
    const _path = normalizeWindowsPath(path);
    aliases = normalizeAliases(aliases);
    for (const [alias, to] of Object.entries(aliases)) 
    {
        if (!_path.startsWith(alias)) 
        {
            continue;
        }

        // Strip trailing slash from alias for check
        const _alias = hasTrailingSlash(alias) ? alias.slice(0, -1) : alias;

        if (hasTrailingSlash(_path[_alias.length])) 
        {
            return join(to, _path.slice(alias.length));
        }
    }
    return _path;
}

const FILENAME_RE = /(^|[/\\])([^/\\]+?)(?=(\.[^.]+)?$)/;

export function filename(path: string) 
{
    return path.match(FILENAME_RE)?.[2];
}

// --- internals ---

function _compareAliases(a: string, b: string) 
{
    return b.split("/").length - a.split("/").length;
}

// Returns true if path ends with a slash or **is empty**
function hasTrailingSlash(path = "/") 
{
    const lastChar = path[path.length - 1];
    return lastChar === "/" || lastChar === "\\";
}

//#endregion