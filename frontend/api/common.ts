import { Comfy } from '@typings/comfy';
import requestClient, { apiPrefix } from './request-instance';

export interface WorkflowValidateRequest {
  client_id: string;
  prompt: Comfy.WorkflowOutput;
  workflow: any;
  extra_data: {
    extra_pnginfo: {
      workflow: Comfy.GraphPrompt['workflow'];
    };
  };
  front?: boolean;
  number?: number;
}

export const workflowValidate = async (
  number: number,
  output: any,
  workflow: any,
) => {
  const body: WorkflowValidateRequest = {
    client_id: (window.name || sessionStorage.getItem('clientId')) ?? '',
    workflow,
    prompt: output,
    extra_data: { extra_pnginfo: { workflow } },
  };

  if (number === -1) {
    body.front = true;
  } else if (number !== 0) {
    body.number = number;
  }

  return await requestClient.post(`${apiPrefix}/workflow-validate`, body);
};
