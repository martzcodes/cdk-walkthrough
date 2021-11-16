#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HackathonTutorialStack } from '../lib/hackathon-tutorial-stack';

const app = new cdk.App();
new HackathonTutorialStack(app, 'HackathonTutorialStack');
