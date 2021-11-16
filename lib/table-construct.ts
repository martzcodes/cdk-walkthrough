import { Construct, RemovalPolicy, CustomResource } from "@aws-cdk/core";
import { Provider } from "@aws-cdk/custom-resources";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { join } from "path";
import { Runtime } from "@aws-cdk/aws-lambda";
import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { LogGroup, RetentionDays } from '@aws-cdk/aws-logs';
import config from "config";

export class HackathonTableConstruct extends Construct {
  table: Table;
  initResource: CustomResource;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const { namespace } = config.get("cdk");

    const tableName = `hackTable-${namespace}`;
    this.table = new Table(this, tableName, {
      partitionKey: { name: "id", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName,
    });

    const functionName = `initFn-${namespace}`;
    const initFn = new NodejsFunction(this, `initFn`, {
      entry: join(__dirname, "../lambda/initFn.ts"),
      runtime: Runtime.NODEJS_14_X,
      environment: {
          tableName
      },
      functionName
    });

    this.table.grantWriteData(initFn);

    new LogGroup(this, `initLogGroup`, {
        logGroupName: `/aws/lambda/${functionName}`,
        retention: RetentionDays.ONE_DAY,
        removalPolicy: RemovalPolicy.DESTROY,
    });

    const initProvider = new Provider(scope, `initProvider-${namespace}`, {
      onEventHandler: initFn,
    });

    this.initResource = new CustomResource(scope, `initResource-${namespace}`, {
      serviceToken: initProvider.serviceToken,
    });
  }
}
