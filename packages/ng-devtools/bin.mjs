#!/usr/bin/env node
import { createNgDevtoolsCli } from '@pangular-inspector/core/cli';

await createNgDevtoolsCli().parse();
