import { toStandardJsonSchema } from '@valibot/to-json-schema';

/**
 * Attach a [Standard JSON Schema](https://standardschema.dev/) converter to a
 * valibot schema.
 *
 * Devframe stays validator neutral: it describes an RPC `returns` schema with
 * the validator's own converter, and valibot does not ship one by default.
 * Without it devframe falls back to a permissive object schema and advertises
 * that as the MCP `outputSchema`, so a tool returning an array fails every
 * `tools/call` against the schema the server itself published.
 *
 * With the converter attached, an object return is described accurately, and
 * an array return advertises no output schema at all, since MCP only allows an
 * object there. Either way the response matches what was advertised.
 */
export function describable<T>(schema: T): T {
  const described = { ...schema, ...toStandardJsonSchema(schema as never) } as T;

  // Conversion is lazy, and devframe swallows a converter that throws by
  // falling back to a permissive object schema: the very thing this avoids.
  // Converting once here turns that into an error at startup instead.
  (described as { '~standard': { jsonSchema: { input: (o: unknown) => unknown } } })[
    '~standard'
  ].jsonSchema.input({ target: 'draft-2020-12' });

  return described;
}
