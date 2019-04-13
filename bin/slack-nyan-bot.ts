#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { SlackNyanBotStack } from '../lib/slack-nyan-bot-stack';

const app = new cdk.App();
new SlackNyanBotStack(app, 'SlackNyanBotStack');
