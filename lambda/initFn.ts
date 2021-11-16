import {
  CloudFormationCustomResourceEvent,
  CloudFormationCustomResourceFailedResponse,
  CloudFormationCustomResourceSuccessResponse,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const tableName = `${process.env.tableName}`;
const db = new DocumentClient({ region: "us-east-1" });

export const handler = async (
  event: CloudFormationCustomResourceEvent
): Promise<
  | CloudFormationCustomResourceSuccessResponse
  | CloudFormationCustomResourceFailedResponse
> => {
  console.log(JSON.stringify(event));
  console.log(`tableName: ${tableName}`);
  try {
    const item = await db
      .put({
        TableName: tableName,
        Item: { id: "some-pk-that-doesn-t-exist" },
      })
      .promise();
    console.log('in item');
    console.log(JSON.stringify(item));
    return { ...event, PhysicalResourceId: "asdf", Status: "SUCCESS" };
  } catch (e: any) {
    console.log("in catch");
    console.log(e);
    return {
      ...event,
      PhysicalResourceId: "asdf",
      Reason: e.message,
      Status: "FAILED",
    };
  }
};
