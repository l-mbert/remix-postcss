import type {
  EntryContext,
  HtmlLinkDescriptor,
} from "@remix-run/server-runtime";
import fs from "fs";
import postcss from "postcss";
import postcssrc from "postcss-load-config";

export function remixPostcss(context: EntryContext) {
  const { routeModules } = context;

  postcssrc({
    cwd: process.cwd(),
  }).then(({ plugins }) => {
    const processor = postcss(plugins);

    Object.keys(routeModules).forEach((moduleKey) => {
      const module = routeModules[moduleKey];
      if (!module.links) return;
      const links = module.links();

      links.forEach((link: HtmlLinkDescriptor) => {
        if (!link.href) return;
        const filePath = `${process.cwd()}/public/${link.href}`;

        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error(err);
            return;
          }

          const untransformedCss = data.toString();

          processor
            .process(untransformedCss, {
              from: filePath,
              to: filePath,
            })
            .then(({ css }) => {
              fs.writeFile(filePath, css, (err) => {
                if (err) {
                  console.error(err);
                }
              });
            });
        });
      });
    });
  });
}
