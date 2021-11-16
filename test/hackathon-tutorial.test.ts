import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as HackathonTutorial from '../lib/hackathon-tutorial-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new HackathonTutorial.HackathonTutorialStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
