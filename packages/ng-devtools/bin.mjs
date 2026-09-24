#!/usr/bin/env node
import { createCac } from 'devframe/adapters/cac';
import ngDevtools from '@santoshyadavdev/ng-devtools/devframe';

createCac(ngDevtools, { mcp: true }).parse();
