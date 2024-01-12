/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
'use strict';

// File path -> contents
const FileTemplate = ({libraryName, componentNames}) => `
/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * ${'@'}generated by codegen project: GenerateShadowNodeCpp.js
 */

#include <react/renderer/components/${libraryName}/ShadowNodes.h>

namespace facebook {
namespace react {

${componentNames}

} // namespace react
} // namespace facebook
`;

const ComponentTemplate = ({className}) =>
  `
extern const char ${className}ComponentName[] = "${className}";
`.trim();

module.exports = {
  generate(libraryName, schema, packageName, assumeNonnull = false) {
    const fileName = 'ShadowNodes.cpp';
    const componentNames = Object.keys(schema.modules)
      .map(moduleName => {
        const module = schema.modules[moduleName];

        if (module.type !== 'Component') {
          return;
        }

        const components = module.components; // No components in this module

        if (components == null) {
          return null;
        }

        return Object.keys(components)
          .map(componentName => {
            if (components[componentName].interfaceOnly === true) {
              return;
            }

            const replacedTemplate = ComponentTemplate({
              className: componentName,
            });
            return replacedTemplate;
          })
          .join('\n');
      })
      .filter(Boolean)
      .join('\n');
    const replacedTemplate = FileTemplate({
      componentNames,
      libraryName,
    });
    return new Map([[fileName, replacedTemplate]]);
  },
};