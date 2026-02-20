import path from 'path';

export interface PathAliases {
  components: string;
  utils: string;
  hooks: string;
}

/**
 * Resolve a registry file path to an absolute target path in the user's project.
 */
export function resolveTargetPath(
  registryPath: string,
  aliases: PathAliases,
  cwd = process.cwd()
): string {
  if (registryPath.startsWith('components/')) {
    return path.join(cwd, aliases.components, registryPath.replace('components/', ''));
  }

  if (registryPath.startsWith('lib/')) {
    return path.join(cwd, aliases.utils, registryPath.replace('lib/', ''));
  }

  if (registryPath.startsWith('hooks/')) {
    return path.join(cwd, aliases.hooks, registryPath.replace('hooks/', ''));
  }

  return path.join(cwd, 'src', registryPath);
}
