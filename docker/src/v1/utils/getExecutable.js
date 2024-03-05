import { existsSync } from 'fs';

export function getExecutable() {
  let executableName;
  switch (process.platform) {
    case 'darwin':
      if (process.arch === 'arm64') {
        executableName = 'surge-macos-arm64-v1.0';
      } else {
        executableName = 'surge-macos-v1.0';
      }
      break;
    case 'linux':
      executableName = 'surge-linux-v1.0';
      break;
    default:
      throw new Error('Unsupported platform');
  }

  const executable = new URL(`../../../bin/${executableName}`, import.meta.url);
  if (!existsSync(executable)) {
    throw new Error('Executable not found');
  }
  return executable.pathname;
}
