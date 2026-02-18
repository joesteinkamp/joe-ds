# MCP Metadata

Metadata files designed for AI/MCP (Model Context Protocol) consumption.

## Purpose

These files help AI assistants understand and correctly use the js-ds-ui design system by providing:

1. **Semantic component information** - What components do, not just how they work
2. **Intent mapping** - Map natural language user requests to appropriate components
3. **Usage examples** - Real-world patterns for common scenarios
4. **Accessibility guidelines** - Ensure AI generates accessible code
5. **Best practices** - Encode design system wisdom for AI to follow

## Files

### `component-manifest.json`

Main component registry with:
- **Intent mapping**: "user wants to trigger an action" → Button component
- **Props documentation**: Detailed prop types, defaults, and semantics
- **Accessibility info**: ARIA roles, keyboard navigation, WCAG compliance
- **Usage guidelines**: When to use, when to avoid, common examples
- **Patterns**: Common UI patterns and their component compositions

### `usage-examples.json`

Comprehensive examples showing:
- **Basic examples**: Simple, common use cases
- **Complex patterns**: Multi-component compositions (forms, auth flows)
- **Conversational patterns**: Natural language → code mappings
- **Best practices**: Accessibility, performance, token usage guidelines

### `schemas/component-manifest.schema.json`

JSON Schema for the component manifest, enabling:
- Validation of manifest structure
- IDE autocomplete when editing manifests
- Type safety for tools consuming the manifest

## How AI Should Use This

### Intent Recognition

When a user says "I need a button", AI should:
1. Look up "button" in `component-manifest.json`
2. Check the `intent` array for matching natural language
3. Review `usage.examples` for similar scenarios
4. Generate appropriate code with accessibility attributes

### Component Selection

When a user describes a need:
1. Search `intent` arrays across all components
2. Match to the most appropriate component
3. Select props based on user requirements
4. Apply relevant patterns from `patterns` section

### Example Flow

```
User: "Add a search bar"
AI thinks:
1. Searches component-manifest for intent: "user wants to search"
2. Finds Input component with type="search"
3. Checks usage-examples for "searchBar" example
4. Generates: <Input type="search" placeholder="Search..." />
5. Adds label for accessibility
```

### Best Practices

AI should:
- ✅ Always include labels with inputs
- ✅ Use semantic tokens (--color-text-primary) not primitives
- ✅ Include ARIA attributes from accessibility section
- ✅ Follow examples in usage-examples.json
- ✅ Reference related components for complex patterns
- ❌ Never generate inaccessible code (missing labels, low contrast)
- ❌ Don't use primitive tokens directly in components
- ❌ Don't skip keyboard navigation attributes

## Extending Metadata

When adding new components:

1. **Update component-manifest.json**:
   ```json
   {
     "componentName": {
       "name": "ComponentName",
       "description": "Clear description",
       "intent": ["user intent 1", "user intent 2"],
       "props": { /* prop definitions */ },
       "accessibility": { /* a11y info */ },
       "usage": { /* guidelines and examples */ }
     }
   }
   ```

2. **Add examples to usage-examples.json**:
   ```json
   {
     "exampleName": {
       "intent": "What user wants to achieve",
       "solution": {
         "component": "ComponentName",
         "code": "Example code",
         "explanation": "Why this solution works"
       }
     }
   }
   ```

3. **Update conversationalPatterns** with natural language variants

## MCP Server Integration

To expose this metadata via MCP:

```typescript
// Example MCP server
const mcpServer = {
  tools: {
    "js-ds-ui-search": {
      description: "Search js-ds-ui components by intent",
      parameters: {
        intent: "User intent in natural language"
      },
      handler: (intent) => {
        // Search component-manifest.json
        // Return matching components with examples
      }
    },
    "js-ds-ui-component": {
      description: "Get details about a specific component",
      parameters: {
        componentName: "Name of the component"
      },
      handler: (name) => {
        // Return component from manifest
      }
    }
  }
};
```

## Validation

Validate manifest against schema:

```bash
npx ajv-cli validate \
  -s metadata/schemas/component-manifest.schema.json \
  -d metadata/component-manifest.json
```

## Future Enhancements

- [ ] Add component preview images/videos
- [ ] Include Figma design file references
- [ ] Add TypeScript type definitions inline
- [ ] Expand pattern library
- [ ] Add anti-patterns (what NOT to do)
- [ ] Include performance budgets per component
