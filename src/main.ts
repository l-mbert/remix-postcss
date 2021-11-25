import type { EntryContext, LinkDescriptor } from '@remix-run/server-runtime';
import fs from 'fs/promises';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';

/**
 * remixPostcss will look at all `links` currently loaded by Remix and will overwrite them in the public-Directory
 * @param context The Remix Config-Object
 */
export async function remixPostcss(context: EntryContext) {
  // TODO: This is a bit Hacky, we could also just loop over the "public/build/_assets"-Folder but sometimes there are Files multiple times in it with another Hash
  const { routeModules } = context;

  const cwd = process.cwd();

  const { plugins } = await postcssrc({
    cwd,
  });
  const processor = postcss(plugins);

  // Get all Link-Modules from the Remix-Context
  const links: LinkDescriptor[] = [];
  Object.keys(routeModules).forEach((moduleKey) => {
    if (!routeModules.hasOwnProperty(moduleKey)) return;

    const module = routeModules[moduleKey];
    if (!module.links) return;

    links.push(...module.links());
  });

  const processFile = async (filePath: string) => {
    const fileBuffer = await fs.readFile(filePath);
    const file = fileBuffer.toString();

    const { css } = await processor.process(file, { from: filePath, to: filePath });

    await fs.writeFile(filePath, css);
  };

  for (let link of links) {
    // Make sure the Type is HtmlLinkDescriptor and not PageLinkDescriptor
    if ('page' in link || !link.href) continue;

    try {
      // Process all files in the build/ and public/build directories
      await processFile(`${cwd}/public/${link.href}`);
      await processFile(`${cwd}/${link.href}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
